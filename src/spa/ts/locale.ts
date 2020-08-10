import VueI18n from "vue-i18n";
import sv from "../resources/locale/sv.json";

export const i18n = new VueI18n({
  locale: "sv", // set locale,
  messages: {
    sv,
  }
});