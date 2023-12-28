import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

import english from "./english.json";
import spanish from "./spanish.json";

const i18n = new I18n({
  en: english,
  es: spanish,
});

i18n.locale = getLocales()[0].languageCode;

i18n.enableFallback = true;

export default i18n;
