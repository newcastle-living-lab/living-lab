<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Projection" />

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="title">Title</label>
				<textarea
					:value="projectData.title"
					@input="updateValue({ prop: 'title', value: $event.target.value })"
					class="form-input"
					id="title"
					rows="3"
					maxlength="255"
				></textarea>
			</div>

			<div class="form-group">
				<label class="form-label" for="goalsLabel">Goals and targets label</label>
				<input
					:value="projectData.goals.label"
					@input="updateGoals({ prop: 'label', value: $event.target.value })"
					class="form-input"
					id="goalsLabel"
					maxlength="255
				"></textarea>
			</div>

			<div class="form-group">
				<label class="form-label" for="goalsBody">Goals and targets</label>
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
			panelName: 'projection'
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
			'updateValue',
			'updateGoals',
		]),
		next() {
			this.$store.dispatch('app/setEdit', 'beneficiary');
		}
	}

}
</script>
