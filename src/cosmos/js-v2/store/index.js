import Vue from 'vue';
import Vuex from 'vuex';
import pathify from './pathify';

import { state, getters, actions, mutations } from './base';

Vue.use(Vuex)
export default new Vuex.Store({
	plugins: [ pathify.plugin ],
	state,
	getters,
	actions,
	mutations,
});
