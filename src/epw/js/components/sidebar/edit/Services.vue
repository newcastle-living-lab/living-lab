<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Services" />

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="servicesLabel">Services label</label>
				<input class="form-input" id="servicesLabel" v-model="servicesLabel" maxlength="255"></textarea>
			</div>

			<div class="form-group">
				<label class="form-label">Services</label>
				<button class="btn btn-dark btn-sm">+ Add new service...</button>
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
			panelName: 'services'
		};
	},

	computed: {
		...mapState('app', {
			visible(state) {
				return state.editPanel == this.panelName
			},
		}),
		...mapFields({
			servicesLabel: 'servicesLabel',
		}),
	},

	methods: {
		save() {
			this.$store.dispatch('projects/saveCurrentProject');
		}
	}

}
</script>
