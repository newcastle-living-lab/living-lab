<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Details" />

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="name">Name</label>
				<input class="form-input" id="name" v-model="name" maxlength="255">
			</div>

			<div class="form-group">
				<label class="form-label" for="projectCreatedBy">Created by</label>
				<input class="form-input" id="projectCreatedBy" v-model="created_by" type="text" maxlength="255"></textarea>
			</div>

		</div>

		<div class="sidebar-footer" v-show="visible">
			<button
				type="button"
				class="btn btn-success"
				@click="save()"
			>Save</button>
		</div>

	</div>

</template>

<script>

import { mapState, mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';

export default {

	data() {
		return {
			panelName: 'details'
		};
	},

	computed: {
		...mapState('app', {
			visible(state) {
				return state.editPanel == this.panelName
			},
		}),
		...mapState('projects', ['currentProject']),
		...mapFields('projects', [
			'currentProject.name',
			'currentProject.created_by',
		]),
	},

	methods: {
		save() {
			this.$store.dispatch('projects/saveCurrentProject');
		}
	}

}
</script>
