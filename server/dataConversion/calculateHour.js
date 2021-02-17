 /*
  11:15pm => 23.25
  08:45am => 8.75
*/
function calculateHour(timeString) {
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

module.exports = calculateHour

