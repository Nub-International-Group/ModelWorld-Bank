const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect('mongodb://127.0.0.1/mWorld')

mongoose.connection.on('error', function (err) {
  console.log('DB Connection Error')
  console.log(err)

  process.exit()
})

app.listen(process.env.PORT || 8081)
