<template>
	<div class="cosmos-project">

		<!-- <ProjectToolbar /> -->

		<section class="app-main">

			<ProjectSidebar :aspectId="aspectId" />

			<div class="app-body">
				<UserGuide :projectId="project.id" :aspectId="aspectId" v-if="project && project.id" />
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</div>

		</section>

	</div>
</template>

<script>

import { get, set, sync, call, dispatch } from 'vuex-pathify';

import Aspects from '@/aspects';

import ProjectSidebar from "./ProjectSidebar";
import UserGuide from '@/components/UserGuide';

export default {

	components: {
		ProjectSidebar,
		UserGuide,
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
			'aspectEditId',
			'userGuide',
		]),
		...sync([
			'project',
		]),

	},

	watch: {
		'project.name': 'projectChanged',
		'project.data': 'projectChanged',
		'aspectEditId': 'aspectEditIdChanged',
		'aspectId': 'aspectIdChanged',
	},

	methods: {

		fetchProject: call('fetchProject'),

		projectChanged() {
			if (this.project.id && this.project.name) {
				document.title = `${this.project.name} | ${this.appName} [Living Lab]`;
				dispatch('checkUserGuideStatus', { projectId: this.project.id, aspectId: this.aspectId });
			}
		},

		aspectIdChanged() {
			dispatch('checkUserGuideStatus', { projectId: this.project.id, aspectId: this.aspectId });
		},

		// When the editing aspect changes - check it matches the current 'viewing' aspect.
		// If it's different, trigger a route change to 'view' the chosen edit aspect.
		aspectEditIdChanged() {
			if (this.aspectEditId && this.aspectEditId != this.aspectId) {
				const aspect = Aspects.get(this.aspectEditId);
				const params = {...this.$route.params, aspectId: this.aspectEditId }
				this.$router.push({ name: aspect.CONFIG.routeName, params: params });
			}
		},

	},

	mounted() {
		if (this.id) {
			this.fetchProject(this.id);
		}
	}

}

</script>
