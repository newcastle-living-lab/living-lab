<template>

	<div class="sidebar-content">

		<VGroup
			v-for="(child, idx) in definition.children"
			:key="idx"
			:val="val"
			:label="child.label"
		>

			<component
				v-bind:is="child.componentName"
				v-model="val[child.id]"
				v-bind="child.componentProps"
				:definition="child"
			></component>

		</VGroup>

	</div>

</template>

<script>

export default {

	name: "GroupEditor",

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
