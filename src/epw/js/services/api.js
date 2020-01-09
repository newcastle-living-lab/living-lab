// import Vue from 'vue';
import axios from 'axios';

var baseURL = '/epw/';

const http = axios.create({
	baseURL: baseURL
});

const api = {

	getProjects() {

		var endpoint = 'projects';

		return http.get(endpoint)
			.then(res => {
				return res.data.projects
			});
	},

	getProject(id) {

		var endpoint = `projects/${id}`;

		return http.get(endpoint)
			.then((res) => {
				return res.data.project
			});
	},

	createProject(params) {
		return http.post('projects', params)
			.then((res) => {
				return res.data.id;
			});
	},

	saveProject(id, params) {
		return http.put(`projects/${id}`, params)
			.then((res) => {
				return res.success;
			})
			.catch((e) => {
				console.error(e);
			});
	}

}

// Vue.prototype.$api = api;

export default api;
