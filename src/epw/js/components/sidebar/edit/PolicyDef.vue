<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Policy Definer" />

		<edit-hint v-show="visible">
			<template v-slot:main>Who are, or were, the definers of the service policies and the principles under which the service operates?</template>
			<template v-slot:details></template>
		</edit-hint>

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="label">Label</label>
				<input
					:value="policyDef.label"
					@input="updatePolicyDef({ prop: 'label', value: $event.target.value })"
					class="form-input"
					id="label"
					maxlength="255"
				>
			</div>

			<div class="form-group">
				<label class="form-label" for="type">Type</label>
				<button-group :options="activityTypes" :value="policyDef.type" @change="updatePolicyDef({ prop: 'type', value: arguments[0] })" />
			</div>

			<div class="form-group">
				<label class="form-label" for="colour">Colour</label>
				<colour-picker
					name="policyDef"
					:colours="filteredColours"
					:value="policyDef.colour"
					@change="updatePolicyDef({ prop: 'colour', value: arguments[0] })"
				/>
			</div>

		</div>

		<div class="sidebar-footer" v-show="visible">
			<button
				type="button"
				class="btn btn-success"
				@click="next()"
			>Next</button>
		</div>

	</div>

</template>

<script>

import { mapState, mapGetters, mapMutations } from 'vuex';
import filteredColours from '../../../data/filteredColours.js';
import activityTypes from '../../../data/activityTypes.json';

export default {

	data() {
		return {
			panelName: 'policydef',
			filteredColours: filteredColours,
			activityTypes: activityTypes,
		};
	},

	computed: {
		...mapState('app', {
			visible(state) {
				return state.editPanel == this.panelName
			},
		}),
		...mapGetters('project', ['policyDef']),
	},

	methods: {
		...mapMutations('project', [
			'updatePolicyDef',
		]),
		next() {
			this.$store.dispatch('app/doEditNext', this.panelName);
		}
	}

}
</script>
