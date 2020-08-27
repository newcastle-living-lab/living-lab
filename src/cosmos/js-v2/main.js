import 'es6-promise/auto';

import Vue from 'vue';

import VueKonva from 'vue-konva';
Vue.use(VueKonva);

// import VueTour from 'vue-tour';
// Vue.use(VueTour);

import UI from "./components/ui";
Vue.use(UI);

import Cosmos from "./components/cosmos";
Vue.use(Cosmos);

import Editors from "./components/project/edit";
Vue.use(Editors);

// import Templates from "./templates";
// Vue.use(Templates.Components);

import Aspects from "./aspects";
Vue.use(Aspects.Components);

import i18n from './plugins/i18n';
import router from './plugins/router';
import store from './store';

import App from './App';


Vue.config.productionTip = false;

new Vue({
	el: '#app',
	template: '<App/>',
	config: window.config,
	i18n,
	router,
	store,
	components: { App },
});

