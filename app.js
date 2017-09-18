var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cron = require('node-cron')

var users = require('./routes/users')

cron.schedule('15 */2 * * * *', function () {
  console.log('===========================')
  console.log('running a task 5 minutes')
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
