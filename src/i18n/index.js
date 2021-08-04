import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import zh from "./config/zh";
import en from "./config/en";

export default new VueI18n( {
  locale: localStorage.getItem("locale") || "zh",
  messages: {
    zh,
    en,
  },
} );
