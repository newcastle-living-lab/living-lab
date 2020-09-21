<template>

	<div class="card card-min card-new-project">
		<div class="card-header">
			<div class="card-title">Create new project</div>
		</div>
		<template v-if="userCanCreate">
			<div class="card-body">
				<div class="card-content">
					<div class="form-group">
						<label class="form-label" for="name">Name</label>
						<VInput type="text" id="name" v-model="newProject.name" />
					</div>
				</div>
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

</template>

<script>

import { get } from 'vuex-pathify';

import Network from '@/services/Network';

export default {

	props: {
		loginUrl: String,
	},

	data() {
		return {
			newProject: {
				name: null,
				created_at: null,
			},
		}
	},

	computed: {
		...get([
			'userCanCreate',
		]),

		canCreateNewProject() {
			return (this.newProject.name && this.newProject.name.length > 0)
		},
	},

	methods: {

		reset() {
			this.newProject = {
				name: null,
				created_at: null
			};
		},

		createProject() {
			this.newProject.created_at = (new Date()).toLocaleDateString();
			Network.createProject(this.newProject)
				.then(id => { this.$router.push('/' + id + '/dashboard'); })
				.then(() => this.reset());
		},

	},

	mounted() {
		this.reset();
	}

};
</script>

