<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Drivers and Motivations" />

		<edit-hint v-show="visible">
			<template v-slot:main>What were / are the drivers and motivations of the project? Was it a statutory requirement, recognition of a need or demand, seizing an opportunity, addressing an inequality?</template>
			<template v-slot:details></template>
		</edit-hint>

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="goalsLabel">Label</label>
				<input
					:value="projectData.goals.label"
					@input="updateGoals({ prop: 'label', value: $event.target.value })"
					class="form-input"
					id="goalsLabel"
					maxlength="255
				"></textarea>
			</div>

			<div class="form-group">
				<label class="form-label" for="goalsBody">Drivers and Motivations</label>
				<p class="form-input-hint">What are the drivers and motivations involved?</p>
				<textarea
					:value="projectData.goals.body"
					@input="updateGoals({ prop: 'body', value: $event.target.value })"
					class="form-input"
					id="goalsBody"
					rows="6"
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

import { mapState, mapMutations } from 'vuex';

export default {

	data() {
		return {
			panelName: 'drivers'
		};
	},

	computed: {
		...mapState('app', {
			visible(state) {
				return state.editPanel == this.panelName
			},
		}),
		...mapState('project', {
			projectData: state => state.project.data
		}),
	},

	methods: {
		...mapMutations('project', [
			'updateGoals',
		]),
		next() {
			this.$store.dispatch('app/doEditNext', this.panelName);
		}
	}

}
</script>
