var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cron = require('node-cron')
var parseString = require('xml2js').parseString
var setDateTime = require('./helpers/setDateTime.js')

// var users = require('./routes/users')
var Reading = require('./models').Reading

var http = require('http')

setInterval(function () {
  http.get('http://pm25-api-server.herokuapp.com')
  console.log('--------------------------')
  console.log('pinging server')
  console.log('--------------------------')
}, 300000) // every 5 minutes (300000)

cron.schedule('15 5 */1 * * *', function () {
  console.log('===========================')
  console.log('running a task every 1 hour')
  console.log('===========================')
  http.get(
    'http://api.nea.gov.sg/api/WebAPI/?dataset=pm2.5_update&keyref=781CF461BB6606AD4852D40C8C54E93CEA620D12C5E7DF2C',
    function (response) {
      var completeResponse = ''
      console.log('hellow')
      response.on('data', function (chunk) {
        completeResponse += chunk
      })
      response.on('end', function () {
        parseString(completeResponse, function (err, result) {
          var rawReadings = result['channel']['item'][0]['region']
          var createArray = []
          for (var i = 0; i < rawReadings.length; i++) {
            var rawHourlyRecord = rawReadings[i]
            var createRecord = {
              region: rawHourlyRecord.id[0].slice(1),
              latitude: parseFloat(rawHourlyRecord.latitude[0]),
              longitude: parseFloat(rawHourlyRecord.longitude[0]),
              timestamp: setDateTime(rawHourlyRecord.record[0]['$'].timestamp),
              concentration: rawHourlyRecord.record[0].reading[0]['$'].value
            }
            createArray.push(createRecord)
          }
          Reading
            .bulkCreate(createArray)
            .then(function () {
              console.log('bulk create successful!')
              return
            })
        })
      })
    })
})

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// app.use('/api/v1/users', users)

app.use('/', function (req, res) {
  return Reading.findAll({
                  where: {
                    createdAt: {
                      $gt: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
                    }
                  }
                })
                .then(function (readings) {
                  res.setHeader('Access-Control-Allow-Origin', '*')
                  res.json(readings)
                })
})

module.exports = app
