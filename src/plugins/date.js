export const dateFormat = (row, column) => {
  var date = row[column.property]
  if (date === undefined) {
    return ''
  }
  var moment = require('moment')
  return moment(date * 1000).format('YYYY-MM-DD HH:mm:ss')
}
