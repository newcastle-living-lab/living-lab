<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Beneficiary" />

		<edit-hint v-show="visible">
			<template v-slot:main>Are there beneficiaries other than the direct user/participants? If so, who are they?</template>
			<template v-slot:details></template>
		</edit-hint>

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="label">Label</label>
				<input
					:value="beneficiary.label"
					@input="updateBeneficiary({ prop: 'label', value: $event.target.value })"
					class="form-input"
					id="label"
					maxlength="255"
				>
			</div>

			<div class="form-group">
				<label class="form-label" for="type">Type</label>
				<select
					class="form-select"
					:value="beneficiary.type"
					@change="updateBeneficiary({ prop: 'type', value: $event.target.value })"
				>
					<option v-for="type in activityTypes"
						:key="type.value"
						:value="type.value">{{ type.label }}
					</option>
				</select>
			</div>

			<div class="form-group">
				<label class="form-label" for="colour">Colour</label>
				<select
					class="form-select"
					:value="beneficiary.colour"
					@change="updateBeneficiary({ prop: 'colour', value: $event.target.value })"
				>
					<option v-for="colour in filteredColours"
						:key="colour.name"
						:value="colour.value">{{ colour.name }}
					</option>
				</select>
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
			panelName: 'beneficiary',
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
		...mapGetters('project', ['beneficiary']),
	},

	methods: {
		...mapMutations('project', [
			'updateBeneficiary',
		]),
		next() {
			this.$store.dispatch('app/doEditNext', this.panelName);
		}
	}

}
</script>
