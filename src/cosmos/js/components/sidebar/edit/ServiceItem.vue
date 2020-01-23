<template>

	<div class="accordion accordion-service" :open="editing">
		<label class="accordion-header" @click="doEdit"><i class="icon icon-arrow-right"></i>{{ item.label }}</label>
		<div class="accordion-body" >
			<div class="card">
				<div class="card-body">
					<div class="form-group">
						<label class="form-label label-sm" :for="'label' + type + index">Label</label>
						<input
							ref="label"
							:id="'label' + type + index"
							:value="item.label"
							v-focus="editing"
							@keyup.enter="doneEdit"
							@keyup.esc="cancelEdit"
							type="text"
							class="form-input input-sm"
							maxlength="255"
						>
					</div>
					<div class="form-group">
						<label class="form-label label-sm" :for="'url' + type + index">Web address</label>
						<input
							ref="url"
							:id="'url' + type + index"
							:value="item.url"
							@keyup.enter="doneEdit"
							@keyup.esc="cancelEdit"
							type="text"
							class="form-input input-sm"
							maxlength="255"
							placeholder="https://"
						>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script>

import { mapActions } from 'vuex';

export default {

	directives: {
		focus (el, { value }, { context }) {
			if (value) {
				context.$nextTick(() => {
					el.focus()
				})
			}
		}
	},

	props: [
		'index',
		'item',
		'type',
		'editingItem',
	],

	computed: {

		editing() {
			return this.item == this.editingItem
		},

	},

	methods: {

		...mapActions('project', [
			'editService',
			'removeService'
		]),

		doEdit() {
			if (this.editingItem == this.item) {
				this.$emit('edit-item', null);
				return;
			}

			this.$emit('edit-item', this.item);
		},

		doneEdit() {

			const label = this.$refs.label.value.trim();
			const url = this.$refs.url.value.trim();
			const { item } = this;

			if ( ! label) {
				this.removeService(item);
			} else {
				this.editService({
					item,
					label,
					url
				});
				this.$emit('edit-item', null);
			}
		},

		cancelEdit(e) {
			this.$refs.label.value = this.item.label;
			this.$refs.url.value = this.item.url;
			this.$emit('edit-item', null);
		}
	}

}
</script>
