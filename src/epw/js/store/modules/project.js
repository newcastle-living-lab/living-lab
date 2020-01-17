import Vue from 'vue';
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

		let value = {
			label: '',
			colour: '',
			comment: '',
			shape: '',
		};

		if (state.project && typeof state.project.data.beneficiary === 'object') {
			value = Object.assign({}, value, state.project.data.beneficiary);
		}

		return value;
	},

	getDataField(state) {
		return getField(state.project.data);
	},

	social(state) {
		if (state.project && Array.isArray(state.project.data.social)) {
			return state.project.data.social;
		}

		return [];
	}

};


/**
 * Actions
 *
 */
const actions = {
	setProject({ commit }, project) {
		commit('setProject', project);
	},
	saveProject({ commit, dispatch, state }) {
		commit('touchModifiedDate');
		api.saveProject(state.project.id, state.project)
			.then(res => {
				if (res && res.success) {
					dispatch('app/doToast', { 'type': 'success', 'content': 'Saved!', seconds: 2}, { root: true });
				} else {
					dispatch('app/doToast', { 'type': 'error', 'content': 'Error saving project: ' + res.reason, seconds: 5}, { root: true });
				}
				return res.success;
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
		// console.log(project);
		state.project = { ...project };
	},

	updateDataField(state, field) {
		return updateField(state.project.data, field);
	},

	updateValue(state, field) {

		// console.log(field);

		if (field.prop in state.project.data) {
			state.project.data[field.prop] = field.value;
		} else {
			// let newVal = {};
			// newVal[field.prop] = field.value;
			// state.project.data = Object.assign({}, state.project.data, newVal);	//[field.prop] = field.value;
			Vue.set(state.project.data, field.prop, field.value);
		}
	},

	updateBeneficiary(state, field) {
		if (typeof state.project.data.beneficiary != 'object') {
			Vue.set(state.project.data, 'beneficiary', {});
		}

		Vue.set(state.project.data.beneficiary, field.prop, field.value);
	},

	updateGoals(state, field) {
		if (typeof state.project.data.goals != 'object') {
			Vue.set(state.project.data, 'goals', {});
		}

		Vue.set(state.project.data.goals, field.prop, field.value);
	},

	addService(state, service) {
		if ( ! Array.isArray(state.project.data.services)) {
			Vue.set(state.project.data, 'services', []);
		}
		delete service.isNew;
		state.project.data.services.push(service);
	},

	deleteService(state, service) {
		state.project.data.services.splice(state.project.data.services.indexOf(service), 1)
	},

	addSocial(state, social) {
		if ( ! Array.isArray(state.project.data.social)) {
			Vue.set(state.project.data, 'social', []);
		}
		state.project.data.social.push(social);
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
