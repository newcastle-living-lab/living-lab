import Vue from 'vue';
import VueI18n from 'vue-i18n';

import language from "@/data/language.json";

Vue.use(VueI18n);

const i18n = new VueI18n({
	locale: 'en', // set locale
	fallbackLocale: 'en', // set fallback locale
	messages: language,
});

export default i18n;
