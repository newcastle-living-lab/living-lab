<template>

	<div>

		<h3 class="sidebar-heading">Create New Project</h3>

		<div class="sidebar-content">

			<div class="form-group">
				<label class="form-label" for="projectName">Name</label>
				<textarea class="form-input" id="projectName" placeholder="" rows="2" v-model="newProject.name" maxlength="255"></textarea>
			</div>

			<div class="form-group">
				<label class="form-label" for="projectCreatedBy">Created by</label>
				<input class="form-input" id="projectCreatedBy" placeholder="" v-model="newProject.created_by" type="text" maxlength="255"></textarea>
			</div>

			<div class="form-actions">
				<button
					type="button"
					class="btn btn-block btn-primary"
					:disabled="(newProject.name) ? false : true"
					:class="(newProject.name) ? '' : 'disabled'"
					@click="createProject()"
				>Create</button>
			</div>

		</div>

	</div>

</template>

<script>

import { mapState } from 'vuex';

// @todo move things to store

export default {

	data() {
		return {
			newProject: {},
		}
	},

	methods: {

		createProject() {
			this.$store.dispatch('projects/createNewProject', this.newProject).then((id) => {
				this.newProject = this.getNewProject();
				this.$router.push(`/${id}/projection`);
			});
		},

		getNewProject() {
			return {
				name: '',
				created_at: (new Date()).toLocaleDateString(),
				modified_at: (new Date()).toLocaleDateString(),
				created_by: '',
			};
		}
	},

	created() {
		this.newProject = this.getNewProject();
	},

	activated() {
		this.$router.push('/').catch((e) => {});
	}

}
</script>
