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
								<div class="column col-6" v-show="hasAdminRole || !requireAuth">
									<label class="form-radio form-inline input-sm">
										<input type="radio" value="" v-model="filter.owner"><i class="form-icon"></i> All
									</label>
									<label class="form-radio form-inline input-sm">
										<input type="radio" value="mine" v-model="filter.owner"><i class="form-icon"></i> Just mine
									</label>
								</div>
							</div>
						</div>
						<div class="card-body">

							<template v-if="filteredProjects.length > 0">

								<router-link
									v-for="project in filteredProjects"
									:key="project.id"
									:to="'/' + project.id + '/' + (project.slug ? project.slug : 'untitled')"
									class="tile tile-project"
								>
									<div class="tile-content">
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
					<NewProject :loginUrl="loginUrl" class="mb-8" />
					<!-- <ImportProject :loginUrl="loginUrl" /> -->
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
import ImportProject from './ImportProject';

export default {

	components: {
		AlertCircleIcon,
		NewProject,
		ImportProject,
	},

	data() {
		return {
			filter: {
				query: '',
				owner: '',
			},
		}
	},

	computed: {

		...sync([
			'projects',
		]),

		...get([
			'appName',
			'user',
			'hasAdminRole',
			'requireAuth',
		]),

		loginUrl() {
			let currentRoute = this.$route.path;
			let path = top.location.pathname.replace(currentRoute, '');
			let uri = path + currentRoute;
			uri = uri.replace('//', '/');
			return '/admin/account/login?ref=' + encodeURIComponent(uri);
		},

		filteredProjects() {

			if (this.filter.query.length == 0 && this.filter.owner.length == 0) {
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

			if (this.filter.owner == 'mine') {
				items = filter(items, { created_by: this.user.email  });
			}

			return items;
		}

	},

	methods: {

		fetchProjects: call('fetchProjects'),
		clearProject: call('clearProject'),


		setTitle() {
			document.title = `${this.appName} [Living Lab]`;
		},

		updateFilterQuery: debounce(function(e) {
			this.filter.query = e;
		}, 100),

	},

	mounted() {
		if (this.requireAuth && ! this.hasAdminRole) {
			this.filter.owner = 'mine';
		}
		this.clearProject();
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
