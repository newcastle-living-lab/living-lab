<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Beneficiary" />

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
				<label class="form-label" for="shape">Shape</label>
				<select
					class="form-select"
					:value="beneficiary.shape"
					@change="updateBeneficiary({ prop: 'shape', value: $event.target.value })"
				>
					<option v-for="shape in shapes"
						:key="shape.value"
						:value="shape.value">{{ shape.label }}
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

			<div class="form-group">
				<label class="form-label" for="comment">Comment</label>
				<textarea
					:value="beneficiary.comment"
					@input="updateBeneficiary({ prop: 'comment', value: $event.target.value })"
					class="form-input"
					id="comment"
					rows="3"
				></textarea>
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

export default {

	data() {
		return {
			none: 'none',
			panelName: 'beneficiary',
			filteredColours: filteredColours,
			shapes: [
				{value: 'male', label: 'Male'},
				{value: 'female', label: 'Female'},
			]
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
			this.$store.dispatch('app/setEdit', 'services');
		}
	}

}
</script>
