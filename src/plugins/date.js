export const dateFormat = (row, column) => {
  var date = row[column.property]
  if (date === undefined) {
    return ''
  }
  var moment = require('moment')
  return moment(date * 1000).format('YYYY-DD-MM HH:mm:ss')
}
