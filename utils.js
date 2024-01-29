import moment from 'moment';
import 'moment/locale/id';

export function momentDate(date) {
  moment.locale('id')
  return moment(date).format('dddd, DD MMMM YYYY')
}
