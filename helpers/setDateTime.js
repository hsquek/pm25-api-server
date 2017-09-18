function setDateTime (str) {
  var year = str.slice(0, 4)
  var month = str.slice(4, 6)
  var day = str.slice(6, 8)
  var hour = str.slice(8, 10)
  var minute = str.slice(10, 12)
  var second = str.slice(12)

  // in js, months start from 0 i.e. jan [0] to dec [11]
  return new Date(year, month - 1, day, hour, minute, second)
}

module.exports = setDateTime
