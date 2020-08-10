// Global libs
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
import tinymce from "tinymce";
(window as any).tinymce = tinymce;

// Load vue plugins
Vue.use(VueI18n);
Vue.use(VueRouter);
Vue.use(VTooltip);

// Index component
import IndexComponent from "./components/index.component.vue";

// Router
import { router } from "./router";

// Locale
import { i18n } from "./locale";

export default new Vue({
  el: "#app",
  render: (h) => h(IndexComponent),
  router,
  i18n,
});
