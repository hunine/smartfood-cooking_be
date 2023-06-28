import moment from 'moment-timezone';
import { DATE_FORMAT, TIMEZONE } from 'src/common/constants/date-time';

export class DateTimeHelper {
  static async getLastWeeksDate() {
    const now = new Date();

    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  }

  static getDateString(date, format) {
    return moment(date).tz(TIMEZONE.GMT7).format(format);
  }

  static getTodayString() {
    return moment().tz(TIMEZONE.GMT7).format(DATE_FORMAT.Date);
  }
}
