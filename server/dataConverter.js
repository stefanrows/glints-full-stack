const { json } = require('body-parser')
const CSVToJSON = require('csvtojson')
const fs = require('fs')
const { inspect } = require('util')
const calculateHour = require('./dataConversion/calculateHour')
const { getMongoCollection, closeClient } = require('./mongo')

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

// Converts the slightly formatted CSV file into a JSON Object
CSVToJSON()
  .fromFile('./restaurants.csv')
  .then(async (jsonObj) => {
    const mongoCollection = await getMongoCollection()
    const records = []

    // End Result -> Loops over each item inside of the jsonObj and returns newRecord as a formatted object ready to be transferred to Mongo DB.
    // newRecord will be a new record in Mongo DB
    for (const item of jsonObj) {
      const newRecord = {
        name: item.restaurant,
        hours_string: item.days,
        open_hours: parseHoursString(item.days),
      }
      records.push(newRecord)
      // console.log(inspect(newRecord, false, null, true))
    }
    // Enable below only if we need to add new data to the DB
    // await mongoCollection.insertMany(records)
    console.log('done writing')
    await closeClient()
    //
    function parseHoursString(hours_string) {
      // Utilizing the splitBy function
      const splitBySpace = splitBy(' ')
      // Splitting the hours_string at every / and map it to a new array splitHours that splits again after every space
      const splitHours = hours_string.split(' / ').map(splitBySpace)
      return splitHours.flatMap(getDateObjects)
    }

    function getDateObjects([days, hours]) {
      const [open, close] = getTimes(hours)
      const splitDays = days.split(',').flatMap(getDays)
      return splitDays.map((day) => ({ day, open, close }))
    }

    function getTimes(hoursString) {
      const [openString, closeString] = hoursString.split('-')
      return [calculateHour(openString), calculateHour(closeString)]
    }

    function getDays(item) {
      if (!item.includes('-')) {
        return [item]
      }
      return getDaysFromRange(item)
    }

    function getDaysFromRange(range) {
      const [start, finish] = range.split('-')
      const startPosition = WEEK_DAYS.indexOf(start)
      const finishPosition = WEEK_DAYS.indexOf(finish)

      if (startPosition < finishPosition) {
        return WEEK_DAYS.slice(startPosition, finishPosition + 1)
      }
      // Go from the finishPosition to end of array
      return [
        ...WEEK_DAYS.slice(startPosition, WEEK_DAYS.length),
        // Go from beginning of array to startPosition
        ...WEEK_DAYS.slice(0, finishPosition + 1),
      ]
    }

    // Re-useable str.split() function. So we can just use something like splitBy(' ') or splitBy(':') to use the split method
    function splitBy(char) {
      return function (str) {
        return str.split(char)
      }
    }

    // Writing converted objects to restaurants.json
    fs.writeFileSync(
      'restaurants.json',
      JSON.stringify(jsonObj),
      'utf-8',
      (err) => {
        if (err) console.log(err)
      }
    )
  })
