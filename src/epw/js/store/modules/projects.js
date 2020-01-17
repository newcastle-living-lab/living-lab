import api from '../../services/api';
import { getField, updateField } from 'vuex-map-fields';

/**
 * Initial state
 *
 */
const state = {
	all: [],
};


/**
 * Getters
 *
 */
const getters = {

	getField,

};


/**
 * Actions
 *
 */
const actions = {

	getAllProjects({ commit }) {
		api.getProjects()
			.then(projects => {
				commit('setProjects', projects);
			});
	},

	getProject({ commit, dispatch }, id) {
		api.getProject(id)
			.then(project => {
				// commit('setCurrentProject', project);
				dispatch('project/setProject', project, { root: true });
				dispatch('app/projectLoaded', null, { root: true });
			});
	},

	createNewProject({ commit }, newProject) {
		return api.createProject(newProject)
			.then(id => {
				return id;
			})
			.catch(err => {
				reject(err);
			});
	},
};


/**
 * Mutations
 *
 */
const mutations = {

	setProjects(state, projects) {
		state.all = projects
	},

	updateField,
};


export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
