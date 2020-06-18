<template>
	<div class="cosmos-project">

		<ProjectToolbar />

		<section class="app-main">

			<ProjectSidebar />

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
			if (this.project && this.project.name) {
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
