const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const RedditStrategy = require('passport-reddit').Strategy
const config = require('config')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/**
 * All responses should be JSON unless otherwise mentioned
 */
app.use(function (req, res, next) {
  res.contentType('application/json')
  res.setHeader('X-Powered-By', 'The dreams and salt of MHOC')
  next()
})

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

passport.use(new RedditStrategy({
  clientID: config.reddit.key,
  clientSecret: config.reddit.secret,
  callbackURL: 'http://' + config.deploymentURL + '/api/auth/return'
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    // TODO: Grab extended user from the DATABASE
    console.log(profile)
    return done(null, profile)
  })
}))

app.use(passport.initialize())

mongoose.connect(config.mongoURL)

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
 * Auth Endpoints Begin
 */

 /**
  * Gets the redirect url and sends it to the client which will then redirect
  */
app.get('/api/auth/login', function (req, res, next) {
  passport.authenticate('reddit', {
    state: 'test',
    duration: 'permanent'
  })(req, res, next)
})

/**
 * Handles the return from the reddit site
 */
app.get('/api/auth/return', function (req, res, next) {
  passport.authenticate('reddit', {
    successRedirect: '/#/auth/success',
    failureRedirect: '/#/login'
  })(req, res, next)
})

/**
 * Handles the client requesting a JWT
 */
app.get('/api/auth/jwt', function (req, res, next) {

})

/**
 * Handles logout. Cleans up the auth only session
 */
app.get('/api/auth/logout', function (req, res, next) {
  
})
/**
 * 404 Handler
 */
app.use(function (req, res, next) {
  res.status(404).json({err: {code: 404, desc: 'Resource not found'}})
})

app.listen(process.env.PORT || 8081)
