import ExpoLocalization from "expo-localization/src/ExpoLocalization";

const formatDate = (date: Date) => {
  const locales = ExpoLocalization.getLocales();
  return new Intl.DateTimeFormat(locales[0].languageTag).format(date);
};

const getDateInSqlLiteDateFormatTimezoneSensitive = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const newDate = new Date(date.getTime() - offset * 60 * 1000);
  return newDate.toISOString().split("T")[0];
};

const getDateInSqlLiteDateFormatAsUTC = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const isBefore = (firstDate: Date, secondDate: Date) => {
  return firstDate < secondDate;
};

const isAfter = (firstDate: Date, secondDate: Date) => {
  return firstDate > secondDate;
};

export {
  formatDate,
  isBefore,
  isAfter,
  getDateInSqlLiteDateFormatTimezoneSensitive,
  getDateInSqlLiteDateFormatAsUTC,
};
