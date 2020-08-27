<template>

	<div class="accordion accordion-external" :open="editing" :class="editing ? 'is-open' : ''">

		<label class="accordion-header" @click="doEdit">
			<div class="tile tile-centered">
				<div class="tile-content">
					<div class="tile-title"><strong>{{ item.label }}</strong></div>
				</div>
				<div class="tile-icon">
					<i class="icon icon-menu c-move" v-handle v-if="showHandle"></i>
				</div>
			</div>
		</label>

		<div class="accordion-body">
			<div class="card card-edit">
				<div class="card-body">
					<StakeholderEditor
						v-model="item"
						:groupName="this.definition.id + this.index"
						@enter="doFinish"
					/>
				</div>
				<div class="card-footer">
					<button
						type="button"
						class="btn btn-sm btn-primary"
						@click="doFinish"
					><i class="icon icon-check"></i> OK</button>
					<button
						type="button"
						class="btn btn-sm btn-negative btn-action float-right"
						@click="deleteItem"
					><i class="icon icon-delete"></i></button>
				</div>
			</div>
		</div>

	</div>

</template>

<script>

import { ElementMixin, HandleDirective  } from 'vue-slicksort';

export default {

	name: "StakeholderMultiEditorItem",

	mixins: [ElementMixin],

	directives: {
		handle: HandleDirective
	},

	props: {
		index: Number,
		item: Object,
		editingItem: Object,
		definition: Object,
		showHandle: Boolean,
	},

	computed: {

		editing() {
			return this.item == this.editingItem
		},

	},

	methods: {

		/**
		 * Generate an input ID for label+input combo
		 *
		 */
		inputId(forInput) {
			return `${this.definition.id}_${this.index}_${forInput}`;
		},

		/**
		 * Finish editing.
		 *
		 * If label is empty, delete item.
		 * Otherwise, set editingItem to nothing, to close the panel.
		 *
		 */
		doFinish() {
			var labelLength = 0;
			if (this.item && this.item.label) {
				labelLength = this.item.label.trim().length;
			}

			if (labelLength > 1) {
				this.$emit('edit-item', null);
			} else {
				this.deleteItem();
			}
		},

		/**
		 * Send event which will set the 'editingItem' to this item
		 *
		 */
		doEdit() {
			if (this.editingItem == this.item) {
				this.$emit('edit-item', null);
				return;
			}

			this.$emit('edit-item', this.item);
		},

		deleteItem() {
			this.$emit('delete-item', this.item);
		},

	},

}
</script>
