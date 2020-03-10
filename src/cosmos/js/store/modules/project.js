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
			extSvcLabel: '',
			infSvcLabel: '',
			extOrgLabel: '',
			services: [],
			externals: [],
			initiators: [],
			theoryOfChange: [],
			communityReporting: [],
			livingLabModels: [],
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

	user(state) {

		let propName = 'user';

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

	beneficiary(state) {

		let propName = 'beneficiary';

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

	initiator(state) {

		let propName = 'initiator';

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
	},

	services(state) {
		if (state.project && Array.isArray(state.project.data.services)) {
			return state.project.data.services;
		}

		return [];
	},

	livingLabModels(state) {
		if (state.project && Array.isArray(state.project.data.livingLabModels)) {
			return state.project.data.livingLabModels;
		}

		return [];
	},

	communityReporting(state) {
		if (state.project && Array.isArray(state.project.data.communityReporting)) {
			return state.project.data.communityReporting;
		}

		return [];
	},

	theoryOfChange(state) {
		if (state.project && Array.isArray(state.project.data.theoryOfChange)) {
			return state.project.data.theoryOfChange;
		}

		return [];
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

	removeService({ commit }, item) {
		commit('removeService', item);
	},

	editService({ commit }, { item, label, url }) {
		commit('editService', { item, label: label, url: url });
	},

	editExternal({ commit }, { item, label, url, image }) {
		commit('editExternal', { item, label: label, url: url, image: image });
	},

};


/**
 * Mutations
 *
 */
const mutations = {

	updateField,

	setProject(state, project) {

		let hasExternals = Array.isArray(project.data.externals);
		let processComRep = ( ! Array.isArray(project.data.communityReporting) || project.data.communityReporting.length === 0);
		let processToc = ( ! Array.isArray(project.data.theoryOfChange) || project.data.theoryOfChange.length === 0);
		let processLivlabmod = ( ! Array.isArray(project.data.livingLabModels) || project.data.livingLabModels.length === 0);

		if (hasExternals) {
			if (processComRep) {
				project.data.communityReporting = project.data.externals.filter(item => item.type == 'comrep');
			}

			if (processToc) {
				project.data.theoryOfChange = project.data.externals.filter(item => item.type == 'toc');
			}

			if (processToc) {
				project.data.livingLabModels = project.data.externals.filter(item => item.type == 'livlabmod');
			}
		}

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

	updateUser(state, field) {
		let propName = 'user';
		if (typeof state.project.data[propName] != 'object') {
			Vue.set(state.project.data, propName, {});
		}

		Vue.set(state.project.data[propName], field.prop, field.value);
	},

	updateBeneficiary(state, field) {
		let propName = 'beneficiary';
		if (typeof state.project.data[propName] != 'object') {
			Vue.set(state.project.data, propName, {});
		}

		Vue.set(state.project.data[propName], field.prop, field.value);
	},

	updateInitiator(state, field) {
		let propName = 'initiator';
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
/*
	addService(state, service) {
		if ( ! Array.isArray(state.project.data.services)) {
			Vue.set(state.project.data, 'services', []);
		}
		delete service.isNew;
		state.project.data.services.push(service);
	},

	deleteService(state, service) {
		state.project.data.services.splice(state.project.data.services.indexOf(service), 1)
	},*/

	addSocial(state, item) {
		if ( ! Array.isArray(state.project.data.social)) {
			Vue.set(state.project.data, 'social', []);
		}
		state.project.data.social.push(item);
	},

	editSocial(state, { item, value = item.value }) {
		item.value = value;
	},

	removeSocial(state, item) {
		if (state.project.data.social.indexOf(item) > -1) {
			state.project.data.social.splice(state.project.data.social.indexOf(item), 1);
		}
		return;
	},

	addService(state, item) {
		if ( ! Array.isArray(state.project.data.services)) {
			Vue.set(state.project.data, 'services', []);
		}
		delete item.isNew;
		state.project.data.services.push(item);
	},

	editService(state, { item, label = item.label, url = item.url }) {
		item.label = label;
		item.url = url;
	},

	removeService(state, item) {
		if (state.project.data.services.indexOf(item) > -1) {
			state.project.data.services.splice(state.project.data.services.indexOf(item), 1);
		}
		return;
	},

	addExternal(state, item) {
		if ( ! Array.isArray(state.project.data.externals)) {
			Vue.set(state.project.data, 'externals', []);
		}
		delete item.isNew;
		state.project.data.externals.push(item);
	},

	editExternal(state, { item, label = item.label, url = item.url, image = item.image }) {
		item.label = label;
		item.url = url;
		item.image = image;
	},

	updateExternalItemIndex(state, { item, idx = item.idx }) {
		console.log("Setting " + item.label + " to index "+ idx);
		item.idx = idx;
	},

	livingLabModels(state, value) {
		state.project.data.livingLabModels = value;
	},

	theoryOfChange(state, value) {
		state.project.data.theoryOfChange = value;
	},

	communityReporting(state, value) {
		state.project.data.communityReporting = value;
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
