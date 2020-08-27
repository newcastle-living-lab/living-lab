<template>
	<input
		class="form-input"
		:type="type"
		v-model="val"
		@input="onInput"
		@keyup.enter="onEnter"
		@keyup.esc="onEsc"
	/>
</template>

<script>

export default {
	name: "VInput",
	props: {
		type: String,
		value: [String, Number]
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
		onEnter(event) {
			this.$emit("enter", event);
		},
		onEsc(event) {
			this.$emit("esc", event);
		}
	}
}

</script>
