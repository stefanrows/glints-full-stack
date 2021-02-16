const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.json())
const PORT = process.env.PORT || 5000

const WEEK_DAYS = ['sun', 'mon', 'tue', 'wed', 'thurs', 'fri', 'sat']
app.post('/', (req, res) => {
  console.log('data', req.body)
  const { date: dateString } = req.body
  const date = new Date(dateString)

  console.log(WEEK_DAYS[date.getDay()], date.getHours())
  res.json({
    data: [
      {
        name: 'DumbRestaurant',
        openHours:
          'Monday-Friday 10:30am-9:30pm / Saturday-Sunday 10:00am-9:30pm',
      },
    ],
  })
})

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
