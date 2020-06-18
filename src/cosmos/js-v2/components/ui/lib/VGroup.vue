<template>
	<div class="form-group">
		<label class="form-label" :for="name">{{ label }}</label>
		<slot />
	</div>
</template>

<script>
export default {
	name: "VGroup",
	props: {
		'name': String,
		'label': String,
	}
};
</script>
