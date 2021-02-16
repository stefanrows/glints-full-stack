const CSVToJSON = require('csvtojson')
const { json } = require('express')
const fs = require('fs')
const moment = require('moment')

CSVToJSON()
  .fromFile('./restaurants.csv')
  .then((jsonObj) => {
    // Separate time slots
    jsonObj.forEach((item) => {
      item.days = item.days.split(' / ')
    })

    // Separate days from times [Weekdays, opening hours]
    jsonObj.forEach((item) => {
      const reg = /(\s)/g
      item.days = item.days.map((element) =>
        element.split(reg).filter((item) => item.trim().length)
      )

      // Separate days after comma
      item.days = item.days.map((element) => {
        return [element[0].split(','), element[1]]
      })
      // Get date ranges
      item.days = item.days.map((element) => {
        const dayRange = element[0].filter((item) => item.includes('-'))
        // const singleDay = element[0].filter((item) => !item.includes('-'))

        if (dayRange.length) {
          const daysSplit = dayRange[0].split('-')

          function day(first, last) {
            var week = [
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ]
            let start = week.indexOf(first)
            let end = week.indexOf(last)
            return start > end
              ? [...week.slice(start), ...week.slice(0, end + 1)]
              : week.slice(start, end + 1)
          }

          const newDayRange = day(daysSplit[0], daysSplit[1])
          element[0] = [
            newDayRange,
            ...element[0].filter((item) => !item.includes('-')),
          ]
        }

        return [element[0], element[1]]
      })
      console.log(item.restaurant)
      console.log(item.days)
    })

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
