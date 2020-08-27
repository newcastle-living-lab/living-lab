<template>
	<div class="form-group">
		<label class="form-label" :class="labelClass" :for="name">{{ label }}</label>
		<slot />
	</div>
</template>

<script>
export default {
	name: "VGroup",
	props: {
		'val': [String,Object,Array],
		'name': String,
		'label': String,
		'labelClass': String,
	}
};
</script>
