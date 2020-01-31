<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" :title="title" />

		<edit-hint v-show="visible && hintMain">
			<template v-slot:main>{{ hintMain }}</template>
			<template v-slot:details></template>
		</edit-hint>

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" :for="panelName + '_new'">Add new item</label>
				<span class="form-input-hint">Type the name below and press enter.</span>
				<input
					:id="panelName + '_new'"
					@keyup.enter="addItem({ event: $event })"
					class="form-input"
					autocomplete="off"
					v-focus="visible"
				>
			</div>

			<external-item
				v-for="(item, index) in filteredItems"
				:key="index"
				:index="index"
				:item="item"
				:type="type"
				:images="images"
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

import ExternalItem from './ExternalItem.vue';

export default {

	components: {
		ExternalItem,
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
		images: Boolean,
		hintMain: String,
	},

	data() {
		return {
			editingItem: null,
		};
	},

	computed: {

		panelName() {
			return `externals-${this.type}`;
		},

		...mapState('app', {
			visible(state) {
				return state.editPanel == this.panelName
			},
		}),

		...mapState('project', {
			projectData: state => state.project.data
		}),

		...mapGetters('project', ['externals']),

		filteredItems() {
			return this.externals.filter(item => item.type == this.type);
		}

	},

	methods: {

		addItem({ event }) {
			let label = event.target.value;
			if (label.trim()) {
				let item = this.getBlankItem();
				item.label = label;
				this.$store.commit('project/addExternal', item);
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
				image: false,
			};
		},

		next() {
			this.$store.dispatch('app/doEditNext', this.panelName);
		}
	}

}
</script>
