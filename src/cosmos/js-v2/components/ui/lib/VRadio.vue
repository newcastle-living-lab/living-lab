<template>
	<label class="form-radio">
		<input
			type="radio"
			:value="value"
			v-model="val"
		>
		<i class="form-icon"></i> {{ label }}
	</label>
</template>

<script>

export default {

	name: "VRadio",

	model: {
		prop: 'selectedValue',
	},

	props: {
		label: String,
		value: [String, Number],
		selectedValue: [String, Number],
	},

	computed: {

		val: {
			get() {
				return this.selectedValue;
			},
			set(content) {
				this.$emit("input", content);
			}
		}
	},
}

</script>
