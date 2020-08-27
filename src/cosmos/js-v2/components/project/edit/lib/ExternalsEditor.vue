<template>

	<div class="sidebar-content">

		<VGroup :name="inputId('label')" label="Label" v-if="useLabel">
			<VInput
				ref="label"
				:id="inputId('label')"
				v-model="val.label"
				type="text"
				maxlength="255"
			/>
		</VGroup>

		<VGroup :name="inputId('new')" label="Add new item" class="mb-8">
			<span class="form-input-hint">Type the name below and press enter.</span>
			<VInput
				ref="new_item_label"
				:id="inputId('new')"
				v-model="newItemLabel"
				@enter="addNewItem()"
				:disabled="!canAddNewItem"
				type="text"
				maxlength="255"
				autocomplete="off"
			/>
		</VGroup>

		<SortableList
			lockAxis="y"
			v-model="val.items"
			v-if="val.items"
			:useDragHandle="true"
			:lockToContainerEdges="true"
			:transitionDuration="0"
			class="mb-4"
		>
			<ExternalsEditorItem
				v-for="(item, index) in val.items"
				:key="index"
				:index="index"
				:item="item"
				:definition="definition"
				:useImages="useImages"
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

import ExternalsEditorItem from './ExternalsEditorItem.vue';

const SortableList = {
	mixins: [ContainerMixin],
	template: `<div class="sortable-bg"><slot /></div>`
};

export default {

	name: "ExternalsEditor",

	components: {
		ExternalsEditorItem,
		SortableList
	},

	props: {
		definition: Object,
		value: Object,
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

		useImages() {
			if (this.definition && typeof(this.definition.useImages) == 'boolean') {
				return this.definition.useImages;
			}
			return false;
		},

		useLabel() {
			if (this.definition && typeof(this.definition.useLabel) == 'boolean') {
				return this.definition.useLabel;
			}
			return false;
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
			if (this.val.items.length < this.limit) {
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
			var newItem = {
				label: this.newItemLabel,
				url: null,
				image: false,
			};
			this.newItemLabel = '';
			this.val.items.push({...newItem});
			this.focusNewInput();
		},

		setEditItem(item) {
			this.editingItem = item;
		},

		deleteItem(item) {
			let items = this.val.items;
			if (items.indexOf(item) > -1) {
				items.splice(items.indexOf(item), 1);
				this.val.items = items;
			}
		},

		focusLabelInput() {
			if ( ! this.$refs.label) {
				return;
			}
			this.$nextTick(() => {
				this.$refs.label.$el.focus();
			});
		},

		focusNewInput() {
			if ( ! this.$refs.new_item_label) {
				return;
			}
			this.$nextTick(() => {
				this.$refs.new_item_label.$el.focus();
			});
		},

	},

	mounted() {
		this.val = this.value;
		if (this.useLabel && this.val.label == null) {
			this.focusLabelInput();
		} else {
			this.focusNewInput();
		}
	},

}
</script>
