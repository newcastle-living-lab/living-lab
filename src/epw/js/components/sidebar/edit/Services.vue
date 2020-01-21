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
				>
			</div>

			<div class="form-group">
				<label class="form-label">Services</label>
				<button class="btn btn-primary btn-sm" @click="newService"><plus-icon size="18"/> Add new service</button>
			</div>

			<div class="tile-list tile-list-services">
				<div class="tile tile-centered" v-for="service in services">
					<div class="tile-content">
						<div class="tile-title">{{ service.label }}</div>
						<a class="tile-subtitle" :href="service.url" target="_blank" v-if="service.url">{{ service.url }}</a>
					</div>
					<div class="tile-action">
						<button class="btn btn-link btn-action tooltip text-dark" data-tooltip="Edit" @click="editService(service)"><edit-icon size="18" /></button>
						<button class="btn btn-link btn-action tooltip text-error" data-tooltip="Delete" @click="deleteService(service)"><trash-2-icon size="18" /></button>
					</div>
				</div>
			</div>

		</div>

		<div class="sidebar-footer" v-show="visible">
			<button
				type="button"
				class="btn btn-success"
				@click="next()"
			>Next</button>
		</div>

		<div class="modal modal-sm" :class="mode == 'edit' || mode == 'add' ? 'active' : ''">
			<div class="modal-overlay" aria-label="Close" @click="closeModal"></div>
			<div class="modal-container">
				<div class="modal-header">
					<button @click="closeModal" class="btn btn-clear float-right" aria-label="Close"></button>
					<div class="modal-title h5">
						<span v-show="mode == 'edit'">Edit Service</span>
						<span v-show="mode == 'add'">Add New Service</span>
					</div>
				</div>
				<div class="modal-body">
					<div class="content">
						<div class="form-group">
							<label class="form-label" for="label">Label</label>
							<input
								v-model="service.label"
								type="text"
								class="form-input"
								id="label"
								maxlength="255"
							>
						</div>
						<div class="form-group">
							<label class="form-label" for="url">Web address</label>
							<input
								v-model="service.url"
								placeholder="https://"
								type="url"
								class="form-input"
								id="url"
								maxlength="255"
							>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-primary" v-show="mode == 'add'" @click="saveService">Add</button>
					<button class="btn btn-primary" v-show="mode == 'edit'" @click="saveService">Save</button>
				</div>
			</div>
		</div>

	</div>

</template>

<script>

import { mapState, mapGetters, mapMutations } from 'vuex';

import PlusIcon from 'vue-feather-icons/icons/PlusIcon';
import EditIcon from 'vue-feather-icons/icons/EditIcon';
import Trash2Icon from 'vue-feather-icons/icons/Trash2Icon';

export default {

	components: {
		PlusIcon,
		EditIcon,
		Trash2Icon,
	},

	data() {
		return {
			panelName: 'services',
			mode: false,
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
			projectData: state => state.project.data,
			services: state => state.project.data.services,
		}),
		// ...mapGetters('project', ['services']),
	},

	methods: {

		// For 'serviceLabel'
		...mapMutations('project', [
			'updateValue',
			// 'updateServices',
		]),


		getBlankService() {
			return {
				isNew: true,
				id: Date.now(),
				label: '',
				url: '',
			};
		},

		deleteService(service) {
			if (confirm('Are you sure you want to delete this service?')) {
				this.$store.commit('project/deleteService', service);
				this.closeModal();
			}
		},

		editService(service) {
			this.service = service;
			this.mode = 'edit';
		},

		newService() {
			this.service = this.getBlankService();
			this.mode = 'add';
		},

		closeModal() {
			this.service = this.getBlankService();
			this.mode = false;
		},

		saveService() {
			if (this.service.isNew) {
				this.$store.commit('project/addService', this.service);
			} else {
				this.$store.commit('project/updateService', this.service);
			}
			this.closeModal();
		},

		next() {
			this.$store.dispatch('app/doEditNext', this.panelName);
		}
	}

}
</script>
