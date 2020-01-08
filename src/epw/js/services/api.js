import Vue from 'vue';
import axios from 'axios';

import {appStore} from '../store/app';

var baseURL = '/epw/';

const http = axios.create({
	baseURL: baseURL
});

var apiEnabled = (window.location.protocol !== 'file:');

const api = {

	getProjects() {

		var endpoint = 'projects';

		return axios.get(endpoint).then(res => {
			return res.data
		});
	},

	getProject(id) {

		var endpoint = `project/${id}`;

		return axios.get(endpoint).then(res => {
			return res.data
		});
	},

	saveProject() {
		return http.post('event', data)
			.then((res) => {
				if (res && res.data && res.data.session_key) {
					appStore.setSessionKey(res.data.session_key);
				}
			})
			.catch((e) => {
				console.error(e);
			});
	}

}

Vue.prototype.$api = api;

export default api;
