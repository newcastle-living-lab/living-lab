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
import EditHint from './components/sidebar/partials/EditHint';
import ButtonGroup from './components/partials/ButtonGroup';
import ColourPicker from './components/partials/ColourPicker';

Vue.component('sidebar-heading', SidebarHeading);
Vue.component('edit-hint', EditHint);
Vue.component('button-group', ButtonGroup);
Vue.component('colour-picker', ColourPicker);

Vue.config.productionTip = false;

new Vue({
	el: '#app',
	template: '<App/>',
	user: window.user,
	i18n,
	router,
	store,
	components: { App },
});

