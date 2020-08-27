<template>
	<textarea
		class="form-input"
		v-model="val"
		:rows="rows"
		@input="onInput"
		@keyup.enter="onEnter"
		@keyup.esc="onEsc"
	></textarea>
</template>

<script>

export default {
	name: "VTextarea",
	props: {
		rows: [String, Number],
		value: [String, Number],
	},
	computed: {
		val: {
			get() {
				return this.value;
			},
			set(content) {
				this.$emit("input", content);
			}
		}
	},
	methods: {
		onInput() {
			if (this.value !== this.val) this.$emit("input", this.val);
		},
		onEnter() {
			this.$emit("enter");
		},
		onEsc() {
			this.$emit("esc");
		}
	}
}

</script>
