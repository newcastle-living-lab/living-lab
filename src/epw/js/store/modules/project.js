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

	policyDef(state) {

		let propName = 'policyDef';

		let value = {
			label: '',
			colour: '',
			type: '',
		};

		if (state.project && typeof state.project.data[propName] === 'object') {
			value = Object.assign({}, value, state.project.data[propName]);
		}

		return value;
	},

	specDes(state) {

		let propName = 'specDes';

		let value = {
			label: '',
			colour: '',
			type: '',
		};

		if (state.project && typeof state.project.data[propName] === 'object') {
			value = Object.assign({}, value, state.project.data[propName]);
		}

		return value;
	},

	deployment(state) {

		let propName = 'deployment';

		let value = {
			label: '',
			colour: '',
			type: '',
		};

		if (state.project && typeof state.project.data[propName] === 'object') {
			value = Object.assign({}, value, state.project.data[propName]);
		}

		return value;
	},

	delivery(state) {

		let propName = 'delivery';

		let value = {
			label: '',
			colour: '',
			type: '',
		};

		if (state.project && typeof state.project.data[propName] === 'object') {
			value = Object.assign({}, value, state.project.data[propName]);
		}

		return value;
	},

	evaluation(state) {

		let propName = 'evaluation';

		let value = {
			label: '',
			colour: '',
			type: '',
		};

		if (state.project && typeof state.project.data[propName] === 'object') {
			value = Object.assign({}, value, state.project.data[propName]);
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
	},

	removeSocial({ commit }, item) {
		commit('removeSocial', item);
	},

	editSocial({ commit }, { item, value }) {
		commit('editSocial', { item, value: value });
	},

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

	updatePolicyDef(state, field) {
		let propName = 'policyDef';
		if (typeof state.project.data[propName] != 'object') {
			Vue.set(state.project.data, propName, {});
		}

		Vue.set(state.project.data[propName], field.prop, field.value);
	},

	updateSpecDes(state, field) {
		let propName = 'specDes';
		if (typeof state.project.data[propName] != 'object') {
			Vue.set(state.project.data, propName, {});
		}

		Vue.set(state.project.data[propName], field.prop, field.value);
	},

	updateDeployment(state, field) {
		let propName = 'deployment';
		if (typeof state.project.data[propName] != 'object') {
			Vue.set(state.project.data, propName, {});
		}

		Vue.set(state.project.data[propName], field.prop, field.value);
	},

	updateDelivery(state, field) {
		let propName = 'delivery';
		if (typeof state.project.data[propName] != 'object') {
			Vue.set(state.project.data, propName, {});
		}

		Vue.set(state.project.data[propName], field.prop, field.value);
	},

	updateEvaluation(state, field) {
		let propName = 'evaluation';
		if (typeof state.project.data[propName] != 'object') {
			Vue.set(state.project.data, propName, {});
		}

		Vue.set(state.project.data[propName], field.prop, field.value);
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

	addSocial(state, item) {
		if ( ! Array.isArray(state.project.data.social)) {
			Vue.set(state.project.data, 'social', []);
		}
		state.project.data.social.push(item);
	},

	editSocial(state, { item, value = social.value }) {
		item.value = value;
	},

	removeSocial(state, item) {
		if (state.project.data.social.indexOf(item) > -1) {
			state.project.data.social.splice(state.project.data.social.indexOf(item), 1);
		}
		return;
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
