<template>

	<div>

		<button
			class="btn btn-sm btn-secondary mb-4"
			@click="addNewItem()"
			:disabled="!canAddNewItem"
		><i class="icon icon-plus"></i> Add new actor</button>

		<SortableList
			lockAxis="y"
			v-model="val"
			v-if="val.length > 0"
			:useDragHandle="true"
			:lockToContainerEdges="true"
			:transitionDuration="0"
			class="mb-4"
		>
			<StakeholderMultiEditorItem
				v-for="(item, index) in val"
				:key="index"
				:index="index"
				:item="item"
				:definition="definition"
				:editingItem="editingItem"
				:showHandle="true"
				@edit-item="setEditItem"
				@delete-item="deleteItem"
			/>

		</SortableList>

		<span class="form-input-hint" v-if="limit">Maximum {{ limit }} items.</span>

	</div>

</template>

<script>

import { ContainerMixin, ElementMixin } from 'vue-slicksort';

import StakeholderMultiEditorItem from './StakeholderMultiEditorItem.vue';

const SortableList = {
	mixins: [ContainerMixin],
	template: `<div class="sortable-bg"><slot /></div>`
};

export default {

	name: "StakeholderMultiEditor",

	components: {
		SortableList,
		StakeholderMultiEditorItem,
	},

	props: {
		definition: Object,
		value: Array,
	},

	data() {
		return {
			newItemLabel: '',
			editingItem: null
		}
	},

	computed: {

		val: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			}
		},

		limit() {
			if (this.definition && typeof(this.definition.limit) == 'number') {
				return this.definition.limit;
			}
			return false;
		},

		canAddNewItem() {
			if ( ! this.limit) {
				return true;
			}
			if (this.val.length < this.limit) {
				return true;
			}
			return false;
		}
	},

	methods: {

		inputId(forInput) {
			return `${this.definition.id}_${forInput}`;
		},

		addNewItem() {
			var actorNum = this.val.length + 1;
			var newItem = {
				label: `Actor ${actorNum}`,
				type: 'user',
				colour: '#cccccc',
				url: null,
			};
			this.newItemLabel = '';
			this.val.push(newItem);
			this.editingItem = newItem;
		},

		setEditItem(item) {
			this.editingItem = item;
		},

		deleteItem(item) {
			console.log("Deleting...");
			console.log({...item});
			let items = this.val;
			if (items.indexOf(item) > -1) {
				items.splice(items.indexOf(item), 1);
				this.val.items = items;
			}
		}

	},

	mounted() {
		this.val = this.value;
	},

}
</script>
