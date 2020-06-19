<template>
	<div class="cosmos-index mb-16">

		<div class="container grid-lg">
			<div class="columns">

				<div class="column col-8">
					<div class="card card-min card-projects">
						<div class="card-header">
							<div class="card-title">Open project</div>
						</div>
						<div class="card-body">

							<template v-if="projects.length > 0">

								<router-link
									v-for="project in projects"
									:key="project.id"
									:to="'/' + project.id + '/' + project.slug + '/dashboard'"
									class="tile tile-project"
								>
									<div class="tile-content">
										<div class="float-right">
											<ProjectTemplateChip :project="project" />
										</div>
										<p class="tile-title"><span v-if="project.name">{{ project.name }}</span><span v-else>#{{ project.id }}</span></p>
										<p class="tile-subtitle" v-if="project.created_by">{{ project.created_by }}</p>
									</div>
								</router-link>

							</template>
							<template v-else>
								<div class="tile tile-empty">
									<div class="tile-content">
										<div><alert-circle-icon size="16" /></div>
										<div>No projects found.</div>
									</div>
								</div>
							</template>
						</div>
					</div>
				</div>

				<div class="column col-4">

					<div class="card card-min card-new-project">
						<div class="card-header">
							<div class="card-title">Create new project</div>
						</div>
						<template v-if="userCanEdit">
							<div class="card-body">
								<NewProject v-model="newProject" class="card-content" />
							</div>
							<div class="card-footer">
								<VButton
									class="btn-primary"
									@click="createProject"
									:disabled="(canCreateNewProject ? false : true)"
									:class="(canCreateNewProject ? '' : 'disabled')"
								>Create</VButton>
							</div>
						</template>
						<template v-else>
							<div class="card-body">
								<div class="tile tile-empty">
									<div class="tile-content">
										<div><alert-circle-icon size="16" /></div>
										<div><a :href="loginUrl">Log in</a> to create a project.</div>
									</div>
								</div>
							</div>
						</template>
					</div>

					<!-- <pre>{{ newProject }} </pre> -->

				</div>

			</div>
		</div>
	</div>
</template>

<script>

import { get, sync, call } from 'vuex-pathify';

import AlertCircleIcon from 'vue-feather-icons/icons/AlertCircleIcon';

// import {appStore} from '@/store/app';
// import { state } from '@/store/store.js';

import Network from "@/services/Network";
import NewProject from './NewProject';
import ProjectTemplateChip from '@/components/ProjectTemplateChip';


export default {

	components: {
		AlertCircleIcon,
		NewProject,
		ProjectTemplateChip,
	},

	data() {
		return {
			// state: state,
			// app: appStore.state,
			// query: null,
			// projects: [],
			newProject: {
				name: null,
				template: null,
				created_by: null,
			},
		}
	},

	computed: {

		...sync([
			'projects',
		]),

		...get([
			'appName',
			'userCanEdit',
			'hasUser',
			'requireAuth',
			'user',
		]),

		canCreateNewProject() {
			return (this.newProject.name && this.newProject.template)
		},

		loginUrl() {
			let currentRoute = this.$route.path;
			let path = top.location.pathname.replace(currentRoute, '');
			let uri = path + currentRoute;
			uri = uri.replace('//', '/');
			return '/login?ref=' + encodeURIComponent(uri);
		}

	},

	methods: {

		fetchProjects: call('fetchProjects'),

		createProject() {
			Network.createProject(this.newProject)
				.then(id => { this.$router.push('/' + id + '/dashboard'); });
		},

		setTitle() {
			document.title = `${this.appName} [Living Lab]`;
		}

	},

	mounted() {
		this.fetchProjects();
		this.setTitle();
	},

}

</script>

<style>
body {
	overflow-y: visible;
}
</style>
