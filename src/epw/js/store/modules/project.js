import api from '../../services/api';
import { getField, updateField } from 'vuex-map-fields';

/**
 * Initial state
 *
 */
const state = {
	modified: false,
	project: {
		id: null,
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
			beneficiary: {
				label: '',
				colour: '',
				comment: '',
			},
			services: [],
			initiators: [],
		}
	}
};


/**
 * Getters
 *
 */
const getters = {

	getField,

	goals(state) {
		if (state.project && typeof state.project.data.goals === 'object') {
			return state.project.data.goals;
		}

		return {
			label: '',
			body: '',
		}
	},

	beneficiary(state) {
		if (state.project && typeof state.project.data.beneficiary === 'object') {
			return state.project.data.beneficiary;
		}

		return {
			label: 'test!',
			colour: '',
			comment: '',
		}
	},

	getDataField(state) {
		return getField(state.project.data);
	},

};


/**
 * Actions
 *
 */
const actions = {
	setProject({ commit }, project) {
		commit('setProject', project);
	},
	saveProject({ commit, state }) {
		commit('touchModifiedDate');
		api.saveProject(state.project.id, state.project)
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

	updateField,

	setProject(state, project) {
		console.log(project);
		state.project = { ...project };
	},

	updateDataField(state, field) {
		return updateField(state.project.data, field);
	},

	updateValue(state, field) {

		console.log(field);

		if (field.prop in state.project.data) {
			state.project.data[field.prop] = field.value;
		} else {
			let newVal = {};
			newVal[field.prop] = field.value;
			state.project.data = Object.assign({}, state.project.data, newVal);	//[field.prop] = field.value;
		}
	},

	updateBeneficiary(state, field) {
		let newVal = {};
		newVal[field.prop] = field.value;
		state.project.data.beneficiary = Object.assign({}, state.project.data.beneficiary, newVal);
	},

	updateGoals(state, field) {
		let newVal = {};
		newVal[field.prop] = field.value;
		state.project.data.goals = Object.assign({}, state.project.data.goals, newVal);
	},

	touchModifiedDate(state) {
		state.project.modified_at = (new Date()).toLocaleDateString();
	},

};


export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
