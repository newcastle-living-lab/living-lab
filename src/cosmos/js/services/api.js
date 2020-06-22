import Vue from 'vue';
import axios from 'axios';
import reject from 'lodash/reject';

var baseURL = '/cosmos-api/';

const http = axios.create({
	baseURL: baseURL
});

const api = {

	getProjects() {

		var endpoint = 'projects';

		return http.get(endpoint)
			.then(res => res.data.projects)
			.then(projects => {
				return reject(projects, (project) => project.template != 'service-model');
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
	},

	uploadImage(formData) {
		return http.post('upload-image', formData)
			.then(res => res.data);
	}

}

Vue.prototype.$api = api;

export default api;
