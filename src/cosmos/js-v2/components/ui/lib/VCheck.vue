<template>
	<label class="form-checkbox">
		<input
			type="checkbox"
			:value="value"
			v-model="val"
			@change="onChange"
		>
		<i class="form-icon"></i> {{ label }}
	</label>
</template>

<script>

export default {

	name: "VCheck",

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
