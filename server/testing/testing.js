const CSVToJSON = require('csvtojson')

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

CSVToJSON()
  .fromFile('./testData.csv')
  .then((jsonObj) => {
    for (const item of jsonObj) {
      const newRecord = {
        name: item.restaurant,
        hours_string: item.days,
        open_hours: parseHoursString(item.days),
      }
      // console.log(newRecord.open_hours)
    }

    function parseHoursString(hours_string) {
      const splitBySpace = splitBy(' ')
      let splitHours = hours_string.split(' / ').map(splitBySpace)
      return splitHours.flatMap(getDateObjects)
    }

    function getDateObjects([days, hours]) {
      // Get open and close time from getTimes function
      const [open, close] = getTimes(hours)
      // Split days at "," and put them into one array. Use getDays() to add days without a - to the array directly
      const splitDays = days.split(',').flatMap(getDays)
      console.log(splitDays)
      return splitDays.map((day) => ({ day, open, close }))
    }

    function getTimes(hoursString) {
      const [openString, closeString] = hoursString.split('-')
      return [calculateHour(openString), calculateHour(closeString)]
    }

    function calculateHour(timeString) {
      // Check if time is AM or PM
      const amOrPM = timeString.slice(timeString.length - 2, timeString.length)

      const [hoursString, minutesString] = timeString
        .slice(0, timeString.length - 2)
        .split(':')

      const baseHours = parseInt(hoursString, 10)
      const hoursNumber =
        amOrPM === 'pm' && baseHours < 12 ? baseHours + 12 : baseHours
      const minutesNumber = parseInt(minutesString, 10) / 60

      return hoursNumber + minutesNumber
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

    // Split Function
    function splitBy(char) {
      return function (str) {
        return str.split(char)
      }
    }
  })
