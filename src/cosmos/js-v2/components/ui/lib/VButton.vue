<template>
	<button @click="onClick" class="btn"><slot /></button>
</template>

<script>
export default {
	name: "VButton",
	methods: {
		onClick() {
			this.$emit("click");
		}
	}
};
</script>
