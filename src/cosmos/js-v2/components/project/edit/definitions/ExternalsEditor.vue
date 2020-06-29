<template>

	<div class="sidebar-content">

		<VGroup :name="definition.id + '_new'" label="Add new item">
			<span class="form-input-hint">Type the name below and press enter.</span>
			<VInput
				type="text"
				:id="definition.id + '_new'"
				v-model="newItemLabel"
				maxlength="255"
				@enter="addNewItem()"
				autocomplete="off"
				ref="new_item_label"
			/>
		</VGroup>

		<SortableList
			lockAxis="y"
			v-model="val"
			:useDragHandle="true"
			:lockToContainerEdges="true"
			:transitionDuration="0"
		>

			<ExternalsEditorItem
				v-for="(item, index) in val"
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

	components: {
		ExternalsEditorItem,
		SortableList
	},

	props: {
		definition: Object,
		value: Array,
		isVisible: Boolean,
	},

	data() {
		return {
			newItemLabel: '',
			editingItem: null
		}
	},

	watch: {
		'isVisible': 'onVisibleChange',
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
		}
	},

	methods: {

		addNewItem() {
			var newItem = {
				label: this.newItemLabel,
				url: null,
				image: false,
			};
			this.newItemLabel = '';
			this.val.push({...newItem});
			this.focusInput();
		},

		setEditItem(item) {
			this.editingItem = item;
		},

		deleteItem(item) {
			let items = this.val;
			if (items.indexOf(item) > -1) {
				items.splice(items.indexOf(item), 1);
				this.val = items;
			}
		},

		focusInput() {
			if ( ! this.$refs.new_item_label) {
				return;
			}
			this.$nextTick(() => {
				this.$refs.new_item_label.$el.focus();
			});
		},

		onVisibleChange() {
			if (this.isVisible) {
				this.focusInput();
			}
		}

	},

	mounted() {
		this.val = this.value;
	},

}
</script>
