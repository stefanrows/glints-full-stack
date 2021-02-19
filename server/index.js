const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { getMongoCollection, closeClient } = require('./mongo')

// Set PORT to either dotenv OR default to 5000
const PORT = process.env.PORT || 5000

const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

async function start() {
  const mongoCollection = await getMongoCollection()
  startServer(mongoCollection)
}

function startServer(mongoCollection) {
  const app = express()
  app.use(cors())
  app.use(bodyParser.json())
  // API Endpoint. POST request to http://localhost:5000/  logs request body in the console and returns the restaurant inside of data as a response.
  app.post('/', async function rootPostHandler(req, res) {
    console.log('data', req.body)

    // Get date as dateString and startTime from request body from frontend
    const { date: dateString, startTime } = req.body
    // Create new variable date from dateString
    const date = new Date(dateString)

    // Search for results in MongoDB
    const dataResult = await mongoCollection
    .find({
      'open_hours.day':WEEK_DAYS[date.getDay()],
      'open_hours.open': { $lte:startTime },

    })
    .toArray()

    // Send response as json object with data
    res.json({
      data:dataResult,
    })
  })
  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
}

start().catch(async (e) => {
  console.log('error', e)
  await closeClient()
  process.exit(1)
})
