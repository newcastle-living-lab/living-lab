<template>

	<div class="sidebar-content">

		<VGroup name="title" label="Title">
			<VInput type="text" id="title" v-model="local.title" maxlength="255" />
		</VGroup>

	</div>

</template>

<script>

import clone from 'lodash/clone';

const defaultValue = {
	title: null,
};

export default {

	props: {
		definition: Object,
		value: Object,
	},

	data() {
		return {
			local: clone(defaultValue),
			previousValue: clone(defaultValue),
		}
	},

	watch: {
		local: {
			handler: function(value) {
				if (JSON.stringify(value) === JSON.stringify(this.previousValue)) {
					return;
				}
				this.previousValue = JSON.parse(JSON.stringify(value));
				this.$emit('input', this.filterValue(value));
			},
			deep: true
		},
	},

	methods: {
		filterValue(value) {
			var data = clone(value);
			if (typeof(data.title) === 'string' && data.title.length === 0) data.title = null;
			return data;
		}
	},

	mounted() {
		if (this.value) {
			this.local = this.filterValue(this.value);
		}

		this.$emit('input', this.filterValue(this.local));
	},

}
</script>
