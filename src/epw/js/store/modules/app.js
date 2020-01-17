import api from '../../services/api';

/**
 * Initial state
 *
 */
const state = {
	appName: 'EPW',
	editing: false,
	loading: false,
	sidebarView: 'welcome',
	editPanel: 'details',
	user: null,
};


/**
 * Getters
 *
 */
const getters = {}


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
	doInfo({ commit }) {
		commit('sidebarView', 'info');
	}
};


/**
 * Mutations
 *
 */
const mutations = {
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
	}
};


export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
