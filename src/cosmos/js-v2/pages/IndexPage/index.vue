<template>
	<div class="cosmos-index">

		<div class="container grid-lg mb-16">
			<div class="columns">

				<div class="column col-8">
					<div class="card card-min card-projects">
						<div class="card-header">
							<div class="card-title">Open project</div>
						</div>
						<div class="card-filter">
							<div class="columns">
								<div class="column col-6">
									<div class="has-icon-left">
										<VInput
											type="search"
											class="input-sm"
											:value="filter.query"
											@input="updateFilterQuery"
											maxlength="100"
											placeholder="Search..."
											autofocus="true"
										/>
										<i class="form-icon icon icon-search"></i>
									</div>
								</div>
								<div class="column col-6">
									<VSelect v-model="filter.template" class="select-sm" placeholder="Template...">
										<option value="">(All)</option>
										<option v-for="(tpl, idx) in searchTemplates" :value="tpl.value">{{ tpl.label }}</option>
									</VSelect>
								</div>
							</div>
						</div>
						<div class="card-body">

							<template v-if="filteredProjects.length > 0">

								<router-link
									v-for="project in filteredProjects"
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

				</div>

			</div>
		</div>
	</div>
</template>

<script>

import { get, sync, call } from 'vuex-pathify';
import debounce from 'lodash/debounce';
import filter from 'lodash/filter';

import AlertCircleIcon from 'vue-feather-icons/icons/AlertCircleIcon';

import Network from "@/services/Network";
import NewProject from './NewProject';
import ProjectTemplateChip from '@/components/ProjectTemplateChip';

import Templates from '@/templates';

const searchTemplates = [
	{'value': 'service-model', 'label': 'Co-Creation of Service Model'},
	{'value': 'analytic-model', 'label': 'Analytic Model'},
];

export default {

	components: {
		AlertCircleIcon,
		NewProject,
		ProjectTemplateChip,
	},

	data() {
		return {
			filter: {
				query: '',
				template: null,
			},
			searchTemplates: searchTemplates,
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
		},

		filteredProjects() {

			if (this.filter.query == 0 && this.filter.template == 0) {
				return this.projects;
			}

			var items = this.projects;

			var query = this.filter.query;
			if (query && query.length > 0) {
				query = query.trim().toLowerCase();
				items = filter(items, (project) => {
					var nameMatch = project.name && project.name.toLowerCase().indexOf(query) !== -1;
					var authorMatch = project.created_by && project.created_by.toLowerCase().indexOf(query) !== -1;
					return nameMatch || authorMatch;
				});
			}

			var tpl = this.filter.template;
			if (tpl && tpl.length > 0) {
				items = filter(items, { template: tpl });
			}

			return items;
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
		},

		updateFilterQuery: debounce(function(e) {
			this.filter.query = e;
		}, 100),

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
