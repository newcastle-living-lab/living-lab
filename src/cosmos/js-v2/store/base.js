import { make } from 'vuex-pathify';
import Network from '@/services/Network';


export const state = {
	appName: 'CoSMoS',
	isEditing: false,
	isLoading: false,
	config: {
		user: null,
		require_auth: true,
		version: null,
	},
	scale: false,
	stageHover: false,
	projects: [],
	project: {},
	toast: {
		active: false,
		message: null,
		type: null,
		seconds: null
	},
	options: {
		fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
	}
};


export const getters = {

	requireAuth(state) {
		return (state.config.require_auth === true);
	},

	hasUser(state) {
		return state.config.user !== null && typeof state.config.user === 'object' && state.config.user.username;
	},

	hasEditRole(state, getters) {
		return (getters.hasUser && getters.user.roles.indexOf('edit') >= 0);
	},

	user(state) {
		return state.config.user;
	},

	userCanEdit(state, getters) {

		if ( ! getters.requireAuth) {
			return true;
		}

		return getters.hasUser && getters.hasEditRole;
	}

};


export const mutations = {

	// creates SET_* functions
	...make.mutations(state),

	TOUCH_MODIFIED_DATE(state) {
		state.project.modified_at = (new Date()).toLocaleDateString();
	},

	START_LOADING(state) {
		state.isLoading = true;
	},

	STOP_LOADING(state) {
		state.isLoading = false;
	},

	START_EDITING(state) {
		state.isEditing = true;
	},

	STOP_EDITING(state) {
		state.isEditing = false;
	},

	SET_TOAST(state, { type, message, seconds }) {
		state.toast.active = true;
		state.toast.type = type;
		state.toast.message = message;
		state.toast.seconds = seconds;
	},

	CLEAR_TOAST(state) {
		state.toast.active = false;
		state.toast.type = null;
		state.toast.message = null;
		state.toast.seconds = null;
	},

	START_STAGE_HOVER(state) {
		state.stageHover = true;
	},

	STOP_STAGE_HOVER(state) {
		state.stageHover = false;
	}

};

export const actions = {

	fetchProjects({ state, commit }) {
		commit('START_LOADING');
		Network.getProjects()
			.then(projects => { commit('SET_PROJECTS', projects) })
			.then(() => commit('STOP_LOADING'));
	},


	fetchProject({ state, commit }, id) {
		commit('SET_PROJECT', {});
		commit('SET_SCALE', false);
		commit('START_LOADING');
		Network.getProject(id)
			.then(project => { commit('SET_PROJECT', project) })
			.then(() => commit('STOP_LOADING'));
	},

	saveProject({ state, commit }) {

		commit('START_LOADING');
		commit('TOUCH_MODIFIED_DATE');

		Network.saveProject(state.project.id, state.project)
			.then(res => {
				if (res && res.success) {
					commit('SET_TOAST', { message: 'Project saved!', type: 'success', seconds: 2 });
				} else {
					commit('SET_TOAST', { message: 'Error saving project: ' + res.reason, type: 'error', seconds: 10 });
				}
				return res.success;
			})
		.then(() => commit('STOP_LOADING'));
	}

}
