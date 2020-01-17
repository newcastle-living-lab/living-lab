<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Services" />

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="servicesLabel">Services label</label>
				<input
					:value="projectData.servicesLabel"
					@input="updateValue({ prop: 'servicesLabel', value: $event.target.value })"
					class="form-input"
					id="servicesLabel"
					maxlength="255"
				></textarea>
			</div>

			<div class="form-group">
				<label class="form-label">Services</label>
				<button class="btn btn-dark btn-sm" @click="newService">+ Add new service...</button>
			</div>

		</div>

		<div class="sidebar-footer" v-show="visible">
			<button
				type="button"
				class="btn btn-success"
				@click="next()"
			>Next</button>
		</div>

		<div class="modal" :class="modalActive ? 'active' : ''">
			<div class="modal-overlay" aria-label="Close" @click="closeModal"></div>
			<div class="modal-container">
				<div class="modal-header">
					<button @click="closeModal" class="btn btn-clear float-right" aria-label="Close"></button>
					<div class="modal-title h5">Add New Service</div>
				</div>
				<div class="modal-body">
					<div class="content">

					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-primary">Add</button>
				</div>
			</div>
		</div>

	</div>

</template>

<script>

import { mapState, mapMutations } from 'vuex';

export default {

	data() {
		return {
			panelName: 'services',
			modalActive: false,
			service: {}
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
			// 'updateServices',
		]),
		getBlankService() {
			return {
				label: '',
				url: '',
			};
		},
		newService() {
			this.service = this.getBlankService();
			this.modalActive = true;
		},
		closeModal() {
			this.service = this.getBlankService();
			this.modalActive = false;
		},
		next() {
			// this.$store.dispatch('app/setEdit', 'beneficiary');
		}
	}

}
</script>
