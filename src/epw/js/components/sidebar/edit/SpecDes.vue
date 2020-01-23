<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Specifier and Designer" />

		<edit-hint v-show="visible">
			<template v-slot:main>Who specifies / specified and designs / designed the service delivery processes and resources?</template>
			<template v-slot:details></template>
		</edit-hint>

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="label">Label</label>
				<input
					:value="specDes.label"
					@input="updateSpecDes({ prop: 'label', value: $event.target.value })"
					class="form-input"
					id="label"
					maxlength="255"
				>
			</div>

			<div class="form-group">
				<label class="form-label" for="type">Type</label>
				<button-group :options="activityTypes" :value="specDes.type" @change="updateSpecDes({ prop: 'type', value: arguments[0] })" />
			</div>

			<div class="form-group">
				<label class="form-label" for="colour">Colour</label>
				<colour-picker
					name="specDes"
					:colours="filteredColours"
					:value="specDes.colour"
					@change="updateSpecDes({ prop: 'colour', value: arguments[0] })"
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
			none: 'none',
			panelName: 'specdes',
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
		...mapGetters('project', ['specDes']),
	},

	methods: {
		...mapMutations('project', [
			'updateSpecDes',
		]),
		next() {
			this.$store.dispatch('app/doEditNext', this.panelName);
		}
	}

}
</script>
