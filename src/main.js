import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element";
import store from "./store";
import i18n from "./i18n";

Vue.config.productionTip = false;
new Vue( {
  router,
  store,
  i18n,
  render: h => {
    return h(App);
  },
} ).$mount("#app");
