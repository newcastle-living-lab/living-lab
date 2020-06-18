<template>
	<input class="form-input" :type="type" v-model="val" @input="onInput" />
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
		}
	}
}

</script>
