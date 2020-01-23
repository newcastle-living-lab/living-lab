<template>

	<div class="btn-group btn-group-block">
		<button class="btn btn-sm"
			v-for="option in options"
			:key="option.value"
			:class="option.value == value ? 'active' : ''"
			@click="$emit('change', option.value)"
		>{{ option.label }}</button>
	</div>

</template>

<script>

export default {

	props: [
		'options',
		'value',
	],

}

</script>
