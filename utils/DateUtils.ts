import ExpoLocalization from "expo-localization/src/ExpoLocalization";

const formatDate = (date: Date) => {
  const locales = ExpoLocalization.getLocales();
  return new Intl.DateTimeFormat(locales[0].languageTag).format(date);
};

const isBefore = (firstDate: Date, secondDate: Date) => {
  return firstDate < secondDate;
};

const isAfter = (firstDate: Date, secondDate: Date) => {
  return firstDate > secondDate;
};

export { formatDate, isBefore, isAfter };
