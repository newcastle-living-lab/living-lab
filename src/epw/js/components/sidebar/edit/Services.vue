<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" :title="title" />

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" :for="panelName + '_label'">Label</label>
				<input
					:id="panelName + '_label'"
					:value="labelValue"
					@input="updateValue({ prop: labelProp, value: $event.target.value })"
					class="form-input"
					maxlength="255"
				>
			</div>

			<div class="form-group">
				<label class="form-label" :for="panelName + '_new'">Add new item</label>
				<span class="form-input-hint">Type the name below and press enter.</span>
				<input
					:id="panelName + '_new'"
					@keyup.enter="addItem({ event: $event })"
					class="form-input"
					autocomplete="off"
				>
			</div>

			<service-item
				v-for="(item, index) in filteredServices"
				:key="index"
				:index="index"
				:item="item"
				:type="type"
				:editingItem="editingItem"
				@edit-item="setEditItem"
			/>

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

import ServiceItem from './ServiceItem.vue';

export default {

	components: {
		ServiceItem,
	},

	directives: {
		focus (el, { value }, { context }) {
			if (value) {
				context.$nextTick(() => {
					el.focus()
				})
			}
		}
	},

	props: {
		title: String,
		type: String,
		labelProp: String,
	},

	data() {
		return {
			editingItem: null,
		};
	},

	computed: {

		panelName() {
			return `services-${this.type}`;
		},

		...mapState('app', {
			visible(state) {
				return state.editPanel == this.panelName
			},
		}),

		...mapState('project', {
			projectData: state => state.project.data
		}),

		...mapGetters('project', ['services']),

		filteredServices() {
			return this.services.filter(item => item.type == this.type);
		},

		labelValue() {
			return this.projectData[this.labelProp];
		},

	},

	methods: {

		// For 'label'
		...mapMutations('project', [
			'updateValue',
		]),

		addItem({ event }) {
			let label = event.target.value;
			if (label.trim()) {
				let item = this.getBlankItem();
				item.label = label;
				this.$store.commit('project/addService', item);
			}
			event.target.value = '';
		},

		setEditItem(item) {
			this.editingItem = item;
		},

		getBlankItem() {
			return {
				isNew: true,
				id: Date.now(),
				type: this.type,
				label: '',
				url: '',
			};
		},

		next() {
			this.$store.dispatch('app/doEditNext', this.panelName);
		}
	}

}
</script>
