<template>

	<div class="sidebar-content">

		<VGroup name="title" label="Title">
			<VTextarea rows="4" id="title" v-model="val.title" />
		</VGroup>

	</div>

</template>

<script>

import clone from 'lodash/clone';

export default {

	name: "ModelEditor",

	props: {
		definition: Object,
		value: Object,
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
	}

}
</script>
