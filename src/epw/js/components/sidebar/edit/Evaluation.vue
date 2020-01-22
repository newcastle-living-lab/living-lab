<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Evaluator" />

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="label">Label</label>
				<input
					:value="evaluation.label"
					@input="updateEvaluation({ prop: 'label', value: $event.target.value })"
					class="form-input"
					id="label"
					maxlength="255"
				>
			</div>

			<div class="form-group">
				<label class="form-label" for="type">Type</label>
				<select
					class="form-select"
					:value="evaluation.type"
					@change="updateEvaluation({ prop: 'type', value: $event.target.value })"
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
					:value="evaluation.colour"
					@change="updateEvaluation({ prop: 'colour', value: $event.target.value })"
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
			panelName: 'evaluation',
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
		...mapGetters('project', ['evaluation']),
	},

	methods: {
		...mapMutations('project', [
			'updateEvaluation',
		]),
		next() {
			this.$store.dispatch('app/doEditNext', this.panelName);
		}
	}

}
</script>
