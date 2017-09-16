const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/**
 * All responses should be JSON unless otherwise mentioned
 */
app.use(function (req, res, next) {
  res.contentType('application/json')
  next()
})

mongoose.connect('mongodb://127.0.0.1/mWorld')

mongoose.connection.on('error', function (err) {
  console.log('DB Connection Error')
  console.log(err)

  process.exit()
})

/**
 * Endpoints Begin
 */

/**
 * Health Endpoint. Sends 200 if up
 */
app.get('/api/health', function (req, res, next) {
  res.status(200).json({time: new Date(), uptime: process.uptime(), memory: process.memoryUsage()})
})

/**
 * 404 Handler
 */
app.use(function (req, res, next) {
  res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
})

app.listen(process.env.PORT || 8081)
