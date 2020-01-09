import api from '../../services/api';

/**
 * Initial state
 *
 */
const state = {
	all: [],
	currentProject: null,
	modified: false,
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
	getAllProjects({ commit }) {
		api.getProjects().then(projects => {
			commit('setProjects', projects)
		});
	},
	getProject({ commit, dispatch }, id) {
		api.getProject(id).then(project => {
			commit('setCurrentProject', project);
			dispatch('app/doInfo', null, { root: true });
		});
	}
};


/**
 * Mutations
 *
 */
const mutations = {
	setModified(state, isModified) {
		state.modified = isModified;
	},
	setProjects(state, projects) {
		state.all = projects
	},
	setCurrentProject(state, project) {
		state.currentProject = project;
	}
};


export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
