<template>
	<div>
		<VRadio
			v-for="option in options"
			:key="option.value"
			:value="option.value"
			:label="option.label"
			v-model="val"
		/>
		<!-- <div
			v-for="option in options"
			:key="option.value"
		>
			<label class="form-radio">
				<input
					type="radio"
					:value="option.value"
					v-model="val"
				>
				<i class="form-icon"></i> {{ option.label }}
			</label>
		</div> -->
	</div>
</template>

<script>

export default {

	name: "VRadioList",

	props: {
		options: Array,
		name: String,
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
