<template>
	<div>
		<label
			class="form-checkbox"
			v-for="option in options"
			:key="option.value"
		>
			<input
				type="checkbox"
				:value="option.value"
				v-model="val"
			>
			<i class="form-icon"></i> {{ option.label }}
		</label>
	</div>
</template>

<script>

export default {

	name: "VCheckList",

	props: {
		definition: Object,
		options: Array,
		name: String,
		value: Array,
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
/*
	methods: {
		onChange() {
			if (this.value !== this.val) {
				this.$emit("input", this.val);
				this.$emit("changed", this.val);
			}
		}
	}*/
}

</script>
