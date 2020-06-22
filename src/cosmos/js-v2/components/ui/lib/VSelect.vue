<template>

	<select class="form-select" v-model="val" :multiple="multiple" @change="onChange">
		<option class="placeholder" :value="null" disabled v-if="placeholder">
			{{ placeholder }}
		</option>
		<slot></slot>
	</select>

</template>

<script>
export default {
	name: "VSelect",
	props: {
		value: {
			type: [String, Number, Boolean, Object],
			default: null
		},
		multiple: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: ""
		}
	},
	mounted() {
		this.val = this.value;
	},
	computed: {
		val: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			}
		}
	},
	methods: {
		onChange() {
			if (this.value !== this.val) this.$emit("input", this.val);
		}
	}
}
</script>
