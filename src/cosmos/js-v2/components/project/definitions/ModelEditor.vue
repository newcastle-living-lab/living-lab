<template>

	<div class="sidebar-content">

		<VGroup name="title" label="Title">
			<VInput type="text" id="title" v-model="val.title" maxlength="255" />
		</VGroup>

	</div>

</template>

<script>

import clone from 'lodash/clone';

export default {

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
