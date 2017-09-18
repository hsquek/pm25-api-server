var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cron = require('node-cron')

var users = require('./routes/users')

var http = require('http')

setInterval(function () {
  http.get('http://pm25-api-server.herokuapp.com')
  console.log('--------------------------')
  console.log('pinging server')
  console.log('--------------------------')
}, 300000) // every 5 minutes (300000)

cron.schedule('15 */10 * * * *', function () {
  console.log('===========================')
  console.log('running a task every 10 minutes')
  console.log('===========================')
})

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/v1/users', users)

app.use('/', function (req, res) {
  res.json({hello: 'world'})
})

module.exports = app
