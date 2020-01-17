import 'es6-promise/auto';

import Vue from 'vue';
import VueKonva from 'vue-konva';

import App from './App';
import i18n from './plugins/i18n';
import router from './plugins/router';
import api from './services/api';
import store from './store';

Vue.use(VueKonva);


// General components
import SidebarHeading from './components/sidebar/partials/Heading';
Vue.component('sidebar-heading', SidebarHeading);


new Vue({
	el: '#app',
	template: '<App/>',
	user: window.user,
	i18n,
	router,
	store,
	components: { App },
});

