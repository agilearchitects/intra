import * as bootstrap from "bootstrap";
import $ from "jquery";
import popper from "popper.js";
(window as any).$ = $;
(window as any).popper = popper;
(window as any).bootstrap = bootstrap;

// VueJS
import VTooltip from "v-tooltip";
import Vue from "vue";
import VueI18n from "vue-i18n";
import VueRouter from "vue-router";

// TinyMCE
import tinymce from "tinymce/tinymce";
(window as any).tinymce = tinymce;

Vue.use(VueI18n);
Vue.use(VueRouter);
Vue.use(VTooltip);

import loading from "./utils/loading/loading.plugin";
Vue.use(loading);

// Index component
import IndexComponent from "./components/index.component.vue";

// Router
import router from "./router";

import { i18n } from "./locale";
const app = new Vue({
  el: "#app",
  render: (h) => h(IndexComponent),
  router,
  i18n,
});
