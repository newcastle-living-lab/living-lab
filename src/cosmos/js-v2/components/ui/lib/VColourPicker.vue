<template>

	<div class="colour-picker">
		<label class="colour-picker-item"
			v-for="item in colours"
			:key="item.value"
		>
			<input
				type="radio"
				:value="item.value"
				v-model="val"
			>
			<div class='colour-picker-icon' :style="{backgroundColor: item.value}">
				<span></span>
			</div>
		</label>
	</div>

</template>

<script>

import filteredColours from '@/data/filteredColours.js';

export default {

	name: "VColourPicker",

	props: {
		value: String,
	},

	data() {
		return {
			colours: filteredColours
		}
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

}

</script>
