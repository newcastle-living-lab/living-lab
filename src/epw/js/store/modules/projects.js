import api from '../../services/api';
import { getField, updateField } from 'vuex-map-fields';

/**
 * Initial state
 *
 */
const state = {
	all: [],
	currentProject: {
		name: '',
		created_by: '',
		created_at: '',
		modified_at: '',
		data: {
			title: '',
			goals: {
				label: '',
				body: '',
			},
			services: [],
			initiators: [],
		}
	},
	modified: false,
};


/**
 * Getters
 *
 */
const getters = {
	getField,
	getCurrentProjectDataField(state) {
		return getField(state.currentProject.data);
	}
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
				commit('setCurrentProject', project);
				dispatch('app/doInfo', null, { root: true });
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
	saveCurrentProject({ commit, state }) {
		commit('touchModifiedDate');
		api.saveProject(state.currentProject.id, state.currentProject)
			.then(res => {
				return res;
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
	},
	updateCurrentProjectDataField(state, field) {
		return updateField(state.currentProject.data, field);
	},
	touchModifiedDate(state) {
		state.modified_at = (new Date()).toLocaleDateString();
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
