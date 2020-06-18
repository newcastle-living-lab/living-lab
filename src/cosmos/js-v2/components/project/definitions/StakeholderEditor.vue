<template>

	<div class="sidebar-content">

		<VGroup name="label" label="Label">
			<VInput type="text" id="label" v-model="local.label" maxlength="255" />
		</VGroup>

		<VGroup name="type" label="Type">
			<VRadioList name="type" :options="typeOptions" v-model="local.type" />
		</VGroup>

		<VGroup name="colour" label="Colour">
			<VColourPicker v-model="local.colour" />
		</VGroup>

		<VGroup name="url" label="Web address">
			<VInput type="text" id="url" v-model="local.url" maxlength="255" />
		</VGroup>

	</div>

</template>

<script>

import clone from 'lodash/clone';

import activityTypes from '@/data/activityTypes.json';

const defaultValue = {
	label: null,
	type: null,
	colour: null,
	url: null,
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
			typeOptions: activityTypes,
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
		}
	},

	methods: {
		filterValue(value) {
			var data = clone(value);
			if (typeof(data.label) === 'string' && data.label.length === 0) data.label = null;
			if (typeof(data.url) === 'string' && data.url.length === 0) data.url = null;
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
