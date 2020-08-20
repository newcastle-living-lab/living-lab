import axios from 'axios';

import Aspects from '@/aspects';

var baseURL = '/cosmos-api/';

const http = axios.create({
	baseURL: baseURL
});

export default {

	getProjects() {
		var endpoint = 'projects';
		return http.get(endpoint)
			.then(res => res.data.projects);
	},

	getProject(id) {
		var endpoint = `projects/${id}`;
		return http.request(endpoint)
			.then(res => res.data.project)
			.then(project => Aspects.populateProject(project));
	},

	createProject(params) {
		var endpoint = 'projects';
		return http.post('projects', params)
			.then(res => res.data.id);
	},

	saveProject(id, params) {
		var endpoint = `projects/${id}`;
		return http.put(`projects/${id}`, params)
			.then(res => res.data)
			.catch(e => {
				return e && e.response && e.response.data ? e.response.data : false;
			});
	},

	uploadImage(formData) {
		var endpoint = 'upload-image';
		return http.post(endpoint, formData)
			.then(res => res.data);
	}

}
