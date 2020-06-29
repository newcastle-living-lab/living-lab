<template>

	<div class="sidebar-content">

		<VGroup name="label" label="Label">
			<VInput type="text" id="label" v-model="val.label" maxlength="255" />
		</VGroup>

		<VGroup name="type" label="Type">
			<VRadioList name="type" :options="typeOptions" v-model="val.type" />
		</VGroup>

		<VGroup name="colour" label="Colour">
			<VColourPicker v-model="val.colour" />
		</VGroup>

		<VGroup name="url" label="Web address">
			<VInput type="text" id="url" v-model="val.url" maxlength="255" />
		</VGroup>

	</div>

</template>

<script>

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
			typeOptions: activityTypes,
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
	}

}
</script>
