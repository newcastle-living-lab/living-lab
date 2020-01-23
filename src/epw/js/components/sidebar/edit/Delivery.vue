<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Deliverer" />

		<edit-hint v-show="visible">
			<template v-slot:main>Who is responsible for the delivery mechanism(s), channels and roles in your pilot?</template>
			<template v-slot:details></template>
		</edit-hint>

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="label">Label</label>
				<input
					:value="delivery.label"
					@input="updateDelivery({ prop: 'label', value: $event.target.value })"
					class="form-input"
					id="label"
					maxlength="255"
				>
			</div>

			<div class="form-group">
				<label class="form-label" for="type">Type</label>
				<button-group :options="activityTypes" :value="delivery.type" @change="updateDelivery({ prop: 'type', value: arguments[0] })" />
			</div>

			<div class="form-group">
				<label class="form-label" for="colour">Colour</label>
				<colour-picker
					name="delivery"
					:colours="filteredColours"
					:value="delivery.colour"
					@change="updateDelivery({ prop: 'colour', value: arguments[0] })"
				/>
			</div>

			<div class="form-group">
				<label class="form-label" for="url">Web address</label>
				<input
					:value="delivery.url"
					@input="updateDelivery({ prop: 'url', value: $event.target.value })"
					class="form-input"
					id="url"
					maxlength="255"
					placeholder="https://"
				>
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
			panelName: 'delivery',
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
		...mapGetters('project', ['delivery']),
	},

	methods: {
		...mapMutations('project', [
			'updateDelivery',
		]),
		next() {
			this.$store.dispatch('app/doEditNext', this.panelName);
		}
	}

}
</script>
