import { isNumber, isObject } from '@/tools/variable-type';

const padStart = (str: string | number, maxlength = 2, filler = '0', local: 'prefix' | 'suffix' = 'prefix') => {
  let newStr = str.toString();
  while (newStr.length < maxlength) {
    if (local === 'prefix') {
      newStr = filler + newStr;
    } else {
      newStr = newStr + filler;
    }
  }
  return newStr;
};

/**
 * 获取时间年月日时分秒毫秒
 *
 * @param {number} _time
 * @param {boolean} [CM=true] 是否是中国的月，中国的月是要+1
 * @return {*}
 */
const getTimeObj = (_time: number, CM = true) => {
  const timeDate = new Date(_time);
  const year = timeDate.getFullYear();
  const month = timeDate.getMonth() + 1;
  const date = timeDate.getDate();
  const hours = timeDate.getHours();
  const minutes = timeDate.getMinutes();
  const seconds = timeDate.getSeconds();
  const milliseconds = timeDate.getSeconds();
  return {
    year,
    month,
    date,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
};

/**
 * 格式化时间
 * @date 2022-03-30
 * @param {any} time:number
 * @param {any} form: YYYY、MM、DD、hh、mm、ss、DT形式的任意一段，DT会分别写出”日“的中文，包括”今天“/"明天",如果不是这两天，就变成了DD
 * @returns {any}
 */
const format = (time: number, form: string) => {
  // "YYYY-MM-DD hh:mm:ss" | "today hh:mm"
  if (!time) {
    throw new Error('format：传入参数和合法');
  }
  const { year, month, date, hours, minutes, seconds } = getTimeObj(time);
  const result = form.replace(/YYYY|MM|DD|hh|mm|ss/g, (match) => {
    switch (match) {
      case 'YYYY':
        return padStart(year);
      case 'MM':
        return padStart(month);
      case 'DT': {
        const currentDate = getTimeObj(new Date().getTime());
        if (year === currentDate.year && month === currentDate.month && date === currentDate.date) {
          return '今天';
        }
        if (year === currentDate.year && month === currentDate.month && date === currentDate.date + 1) {
          return '明天';
        }
      }
      // eslint-disable-next-line no-fallthrough
      case 'DD':
        return padStart(date);
      case 'hh':
        return padStart(hours);
      case 'mm':
        return padStart(minutes);
      case 'ss':
        return padStart(seconds);

      default:
        return match;
    }
  });
  return result;
};

/**
 * 是否是相同的时间，level中Y代表年，ms是毫秒
 * 如果是level是m,那么会比较年月日时分，ms就是完全相同的时间
 * @param {number} time1
 * @param {number} time2
 * @param {('Y' | 'M' | 'D' | 'h' | 'm' | 's' | 'ms')} [level='D']
 * @return {*}  {boolean}
 */
const isSameTime = (time1: number, time2: number, level: 'Y' | 'M' | 'D' | 'h' | 'm' | 's' | 'ms' = 'D'): boolean => {
  const tO1 = getTimeObj(time1);
  const tO2 = getTimeObj(time2);
  switch (level) {
    case 'ms':
      if (tO1.milliseconds !== tO2.milliseconds) {
        return false;
      }
    // eslint-disable-next-line no-fallthrough
    case 's':
      if (tO1.seconds !== tO2.seconds) {
        return false;
      }
    // eslint-disable-next-line no-fallthrough
    case 'm':
      if (tO1.minutes !== tO2.minutes) {
        return false;
      }
    // eslint-disable-next-line no-fallthrough
    case 'h':
      if (tO1.hours !== tO2.hours) {
        return false;
      }
    // eslint-disable-next-line no-fallthrough
    case 'D':
      if (tO1.date !== tO2.date) {
        return false;
      }
    // eslint-disable-next-line no-fallthrough
    case 'M':
      if (tO1.month !== tO2.month) {
        return false;
      }
    // eslint-disable-next-line no-fallthrough
    case 'Y':
      if (tO1.year !== tO2.year) {
        return false;
      }
    // eslint-disable-next-line no-fallthrough
    default:
      return true;
  }
};
type TimeLevel = 'Y' | 'M' | 'D' | 'h' | 'm' | 's' | 'ms';
type TAdditional = {
  [level in TimeLevel]?: number;
};
/**
 * 增加或减少年月日时分秒毫秒操作
 *
 * @param {number} time
 * @param {TAdditional} additional
 * @return {*}  {Date}
 */
const operateTime = (time: number, additional: TAdditional): Date => {
  if (!time || !isObject(additional)) {
    throw new Error('addOrSubtracTime：入参不合法');
  }
  const target = new Date(time);
  const tO = getTimeObj(time, false);
  const keys = Object.keys(additional) as TimeLevel[];
  keys.forEach((key) => {
    const operatoin = additional[key];
    if (!isNumber(operatoin)) {
      return;
    }
    switch (key) {
      case 'ms':
        target.setMilliseconds(tO.milliseconds + operatoin);
        break;
      case 's':
        target.setSeconds(tO.seconds + operatoin);
        break;
      case 'm':
        target.setMinutes(tO.minutes + operatoin);
        break;
      case 'h':
        target.setHours(tO.hours + operatoin);
        break;
      case 'D':
        target.setDate(tO.date + operatoin);
        break;
      case 'M':
        target.setMonth(tO.month + operatoin);
        break;
      case 'Y':
        target.setFullYear(tO.year + operatoin);
        break;
    }
  });
  return target;
};

/**
 * 更新时间的某个层级,当设置月的时候，从0开始
 *
 * @param {number} time
 * @param {TAdditional} updataLevel
 */
const updataTimeLevel = (time: number, updataLevel: TAdditional): Date => {
  const target = new Date(time);
  const keys = Object.keys(updataLevel) as TimeLevel[];
  keys.forEach((key) => {
    const num = updataLevel[key];
    if (!num) {
      return;
    }
    switch (key) {
      case 'ms':
        target.setMilliseconds(num);
        break;
      case 's':
        target.setSeconds(num);
        break;
      case 'm':
        target.setMinutes(num);
        break;
      case 'h':
        target.setHours(num);
        break;
      case 'D':
        target.setDate(num);
        break;
      case 'M':
        target.setMonth(num);
        break;
      case 'Y':
        target.setFullYear(num);
        break;
    }
  });
  return target;
};
export { getTimeObj, format, padStart, isSameTime, operateTime, updataTimeLevel };
