<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Projection" />

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="title">Title</label>
				<textarea class="form-input" id="title" rows="3" v-model="title" maxlength="255"></textarea>
			</div>

			<div class="form-group">
				<label class="form-label" for="goalsLabel">Goals and targets label</label>
				<input class="form-input" id="goalsLabel" v-model="goalsLabel" maxlength="255"></textarea>
			</div>

			<div class="form-group">
				<label class="form-label" for="goalsBody">Goals and targets</label>
				<textarea class="form-input" id="goalsBody" rows="6" v-model="goalsBody"></textarea>
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

import { createHelpers } from 'vuex-map-fields';
const { mapFields } = createHelpers({
	getterType: 'projects/getCurrentProjectDataField',
	mutationType: 'projects/updateCurrentProjectDataField',
});

export default {

	data() {
		return {
			panelName: 'projection'
		};
	},

	computed: {
		...mapState('app', {
			visible(state) {
				return state.editPanel == this.panelName
			},
		}),
		...mapFields({
			title: 'title',
			goalsLabel: 'goals.label',
			goalsBody: 'goals.body',
		}),
	},

	methods: {
		save() {
			this.$store.dispatch('projects/saveCurrentProject');
		}
	}

}
</script>
