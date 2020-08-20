<template>
	<div class="cosmos-project">

		<!-- <ProjectToolbar /> -->

		<section class="app-main">

			<ProjectSidebar :aspectId="aspectId" />

			<keep-alive>
				<router-view></router-view>
			</keep-alive>

		</section>

	</div>
</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

// import ProjectToolbar from "./ProjectToolbar";
import ProjectSidebar from "./ProjectSidebar";

export default {

	components: {
		// ProjectToolbar,
		ProjectSidebar,
		// EditSidebar,
	},

	props: {
		'aspectId': {
			type: String,
			default: 'welcome',
		},
		'id': {
			type: [String, Number],
			coerce: function (val) {
				return parseInt(val, 10);
			}
		}
	},

	computed: {
		...get([
			'appName',
		]),
		...sync([
			'project',
			// 'isEditing',
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
				document.title = `${this.project.name} | ${this.appName} [Living Lab]`;
			}
		}

	},

	mounted() {
		if (this.id) {
			this.fetchProject(this.id);
		}
	}

}

</script>
