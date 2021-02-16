const CSVToJSON = require('csvtojson')
const fs = require('fs')
const { inspect } = require('util')
const calculateHour = require('./dataConversion/calculateHour')

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

// Destructuring
// Array.split
// Array.slice AND String.slice
// Function Currying ->
//   Higher Order Function (Function that returns a function OR takes a function as an argument)
// Array.indexOf -> Find the position of something in an array

CSVToJSON()
  .fromFile('./restaurants.csv')
  .then((jsonObj) => {
    for (const item of jsonObj) {
      const newRecord = {
        name: item.restaurant,
        hours_string: item.days,
        open_hours: parseHoursString(item.days),
      }
      console.log(inspect(newRecord, false, null, true))
    }

    function parseHoursString(hours_string) {
      const splitBySpace = splitBy(' ')
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

    function splitBy(char) {
      return function (str) {
        return str.split(char)
      }
    }
    // Saturday-Sunday
    // Tuesday-Wednesday

    // Old stuff Robert
    // // Separate time slots
    // jsonObj.forEach((item) => {
    //   item.days = item.days.split(' / ')
    // })

    // // Separate days from times [Weekdays, opening hours]
    // jsonObj.forEach((item) => {
    //   const reg = /(\s)/g
    //   item.days = item.days.map((element) =>
    //     element.split(reg).filter((item) => item.trim().length)
    //   )

    //   // Separate days after comma
    //   item.days = item.days.map((element) => {
    //     return [element[0].split(','), element[1]]
    //   })
    //   // Get date ranges
    //   item.days = item.days.map((element) => {
    //     const dayRange = element[0].filter((item) => item.includes('-'))
    //     // const singleDay = element[0].filter((item) => !item.includes('-'))

    //     if (dayRange.length) {
    //       const daysSplit = dayRange[0].split('-')

    //       function day(first, last) {
    //         var week = [
    //           'Sunday',
    //           'Monday',
    //           'Tuesday',
    //           'Wednesday',
    //           'Thursday',
    //           'Friday',
    //           'Saturday',
    //         ]
    //         let start = week.indexOf(first)
    //         let end = week.indexOf(last)
    //         return start > end
    //           ? [...week.slice(start), ...week.slice(0, end + 1)]
    //           : week.slice(start, end + 1)
    //       }

    //       const newDayRange = day(daysSplit[0], daysSplit[1])
    //       element[0] = [
    //         newDayRange,
    //         ...element[0].filter((item) => !item.includes('-')),
    //       ]
    //     }

    //     return [element[0], element[1]]
    //   })
    //   console.log(item.restaurant)
    //   console.log(item.days)
    // })

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
