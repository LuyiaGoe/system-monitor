import Vue from "vue";
import VueRouter from "vue-router";

import Performance from "../components/Performance.vue";
import Process from "../components/Process.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/process",
  },
  {
    path: "/process",
    component: Process,
  },
  {
    path: "/performance",
    name: "performance",
    component: Performance,
  }
];

const router = new VueRouter( {
  routes,
} );

export default router;
