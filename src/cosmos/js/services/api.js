// import Vue from 'vue';
import axios from 'axios';

var baseURL = '/cosmos/';

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
				var proj = res.data.project;
				if (proj && proj.data && proj.data.goals === undefined) {
					proj.data.goals = '';
				}
				if (proj && proj.data && typeof proj.data.goals == 'string') {
					proj.data.goals = {
						label: '',
						body: proj.data.goals
					}
				}
				return proj;
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
			.then(res => {
				return res.data;
			})
			.catch(e => {
				return e && e.response && e.response.data ? e.response.data : false;
			});
	}

}

// Vue.prototype.$api = api;

export default api;
