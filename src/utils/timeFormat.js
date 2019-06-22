import moment from 'moment'

export function dateFormat(row, column) {
    var date = row[column.property];
    if (date == undefined) {
        return "";
    }
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }

export function dateFormatNoTable(date) {
    if (date == undefined) {
        return "";
    }
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }