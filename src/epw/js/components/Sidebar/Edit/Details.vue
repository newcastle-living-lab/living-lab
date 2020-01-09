<template>

	<div class="sidebar-item">

		<h3 class="sidebar-heading">Project Details</h3>

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="name">Name</label>
				<textarea class="form-input" id="name" placeholder="" rows="2" v-model="currentProject.name" maxlength="255"></textarea>
			</div>

			<div class="form-group">
				<label class="form-label" for="projectCreatedBy">Created by</label>
				<input class="form-input" id="projectCreatedBy" placeholder="" v-model="currentProject.created_by" type="text" maxlength="255"></textarea>
			</div>


			<div class="form-actions">
				<button
					type="button"
					class="btn btn-block btn-primary"
					@click="save()"
				>Save</button>
			</div>

		</div>

	</div>

</template>

<script>

import { mapState, mapActions } from 'vuex';
const panelName = 'details';

export default {

	computed: {
		...mapState('app', {
			visible(state) {
				return state.editPanel == panelName;
			}
		}),
		...mapState('projects', ['currentProject']),
	},

	methods: {
		save() {
			this.$api.saveProject(this.app.currentProject.id, this.app.currentProject.project).then(success => {

			});
		}
	}

}
</script>
