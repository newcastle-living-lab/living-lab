import api from '../../services/api';
import { getField, updateField } from 'vuex-map-fields';

/**
 * Initial state
 *
 */
const state = {
	appName: 'COSMOS',
	editing: false,
	loading: false,
	sidebarView: 'welcome',
	editPanel: 'details',
	user: null,
	scale: false,
	toast: {},
	stageHover: false,
	options: {
		fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
	}
};


/**
 * Getters
 *
 */
const getters = {

	getField,

	hasUser(state) {
		return state.user !== null && typeof state.user === 'object' && state.user.username;
	},

	userCanEdit(state) {
		var hasUser = state.user !== null && typeof state.user === 'object' && state.user.username;
		var hasEditRole = (hasUser && state.user.roles.indexOf('edit') >= 0)
		return (hasUser && hasEditRole);
	}

};


/**
 * Actions
 *
 */
const actions = {
	setSidebar({ commit }, viewName) {
		commit('sidebarView', viewName);
	},
	setEdit({ commit }, panelName) {
		commit('editPanel', panelName);
	},
	doWelcome({ commit }) {
		commit('sidebarView', 'welcome');
	},
	doNew({ commit }) {
		commit('sidebarView', 'new');
	},
	doOpen({ commit, dispatch }) {
		dispatch('projects/getAllProjects', null, { root: true });
		commit('sidebarView', 'projects');
	},
	doEdit({ commit }) {
		commit('sidebarView', 'edit');
	},
	doInfo({ commit, state }) {
		commit('sidebarView', 'info');
	},
	doToast({ commit }, params) {
		commit('setToast', params);
	},
	projectLoaded({ commit, state }) {
		if (state.sidebarView == 'edit' || state.sidebarView == 'projects') {
			return;
		}
		commit('sidebarView', 'info');
	},

	/**
	 * Go to the next 'edit' item in the list based on supplied 'current' panel.
	 *
	 */
	doEditNext({ commit }, source) {

		let order = [
			'details',
			'projection',
			'drivers',
			'policydef',
			'specdes',
			'deployment',
			'delivery',
			'evaluation',
			'user',
			'beneficiary',
			'initiator',
			'services-extsvc',
			'services-extorg',
			'services-infsvc',
			'social',
		];

		let idx = order.indexOf(source);

		if (idx >= 0) {
			commit('editPanel', order[idx + 1]);
		}
	}
};


/**
 * Mutations
 *
 */
const mutations = {

	updateField,

	isEditing(state, isEditing) {
		state.editing = isEditing;
	},

	isLoading(state, isLoading) {
		state.loading = isLoading;
	},

	sidebarView(state, viewName) {
		state.sidebarView = viewName;
	},

	editPanel(state, panelName) {
		state.editPanel = panelName;
	},

	setUser(state, user) {
		state.user = user;
	},

	setToast(state, params) {
		if (params === false) {
			params = { active: false };
		} else {
			params.active = true;
		}
		state.toast = params;
	},

	clearToast(state, params) {
		params.active = false;
		state.toast = {};
	},

	setHover(value) {
		state.stageHover = true;
	},

	unsetHover() {
		state.stageHover = false;
	}

};


export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
