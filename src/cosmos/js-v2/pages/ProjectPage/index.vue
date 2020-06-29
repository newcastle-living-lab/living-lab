<template>
	<div class="cosmos-project">

		<ProjectToolbar />

		<section class="app-main">

			<ProjectSidebar v-if="project.id && isEditing" />

			<keep-alive>
				<router-view></router-view>
			</keep-alive>

		</section>

	</div>
</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

import Network from "@/services/Network";
import ProjectToolbar from "./ProjectToolbar";
import ProjectSidebar from "./ProjectSidebar";

export default {

	components: {
		ProjectToolbar,
		ProjectSidebar,
	},

	computed: {
		...get([
			'appName',
		]),
		...sync([
			'project',
			'isEditing',
		]),
	},

	watch: {
		'project.name': 'projectChanged',
		'project.data': 'projectChanged',
	},

	methods: {

		fetchProject: call('fetchProject'),

		projectChanged() {
			if (this.project.id && this.project.name) {
				// @TODO Temporary redirect until service-model is editable in COSMOS v2
				// if (this.project.template === 'service-model') {
				// 	top.location.href = top.location.href.replace(/\/cosmos\//, '/cosmos-1/');
				// 	return;
				// }
				document.title = `${this.project.name} | ${this.appName} [Living Lab]`;
			}
		}

	},

	mounted() {
		this.isEditing = false;
		if (this.$route.params.id) {
			this.fetchProject(this.$route.params.id);
		}
	}

}

</script>
