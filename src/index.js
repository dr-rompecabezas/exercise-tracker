const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoute = require('./routes/users')
const logRoute = require('./routes/logs')
require('dotenv').config()
const path = require('path')
const cors = require('cors')

app.use(cors())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})

// This middleware is available in Express v4.16.0 onwards (replaces deprecated body-parser).
app.use(express.urlencoded({extended:false})) 
app.use(express.json())

// Console log http requests
app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)
  // Call next so that the chain of functions does not break
  next()
})

// Routers
app.use(userRoute)
app.use(logRoute)

// Serve index.html and style.css
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'))
})

// Error 404 Handler (usually positioned towards end of functions chain)
app.use((req, res, next) => {
  res.status(404).send('Error 404. We think you are lost!')
})

// Error 500 Handler
app.use((err, req, res, next) => {
  console.log(err.stack)
  res.sendFile(path.join(__dirname, '../views/500.html'))
})

// Console log MongoDB connection status
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

// Console log server status
const hostname = process.env.HOST || localhost
const port = process.env.PORT || 3000
app.listen(port, hostname, () => console.info(`Server running at http://${hostname}:${port}/`))