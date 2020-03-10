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
					ref="newInput"
					:id="panelName + '_new'"
					@keyup.enter="addItem({ event: $event })"
					class="form-input"
					autocomplete="off"
				>
			</div>

			<SortableList
				lockAxis="y"
				v-model="filteredItems"
				:useDragHandle="true"
				:lockToContainerEdges="true"
				:transitionDuration="0"
			>

				<external-item
					v-for="(item, index) in filteredItems"
					:key="index"
					:index="index"
					:item="item"
					:type="type"
					:images="images"
					:editingItem="editingItem"
					:storeProperty="storeProperty"
					:showHandle="true"
					@edit-item="setEditItem"
					@delete-item="deleteItem"
				/>

			</SortableList>
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
import { ContainerMixin, ElementMixin } from 'vue-slicksort';

import ExternalItem from './ExternalItem.vue';

const SortableList = {
	mixins: [ContainerMixin],
	template: `<div class="sortable-bg"><slot /></div>`
};

export default {

	components: {
		ExternalItem,
		SortableList
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
		storeProperty: String,
		images: Boolean,
		hintMain: String,
	},

	watch: {
		'visible': 'onVisibleChange',
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

		...mapGetters('project', [
			'communityReporting',
			'theoryOfChange',
			'livingLabModels',
		]),

		filteredItems: {
			get() {
				return this[this.storeProperty];
			},
			set(value) {
				let mut = `project/${this.storeProperty}`;
				this.$store.commit(mut, value);
			}
		}

	},

	methods: {

		addItem({ event }) {
			let items = this.filteredItems;
			let label = event.target.value;
			if (label.trim()) {
				let newItem = this.getBlankItem();
				newItem.label = label;
				items.push(newItem);
				this.filteredItems = items;
				// this[this.storeProperty] = items;
			}
			event.target.value = '';
		},

		deleteItem(item) {
			let items = this.filteredItems;	//[this.storeProperty];
			if (items.indexOf(item) > -1) {
				items.splice(items.indexOf(item), 1);
				this.filteredItems = items;
			}
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

		onVisibleChange() {
			if (this.visible) {
				this.$nextTick(() => {
					this.$refs.newInput.focus();
				});
			}
		},

		next() {
			this.$store.dispatch('app/doEditNext', this.panelName);
		}
	},

}
</script>
