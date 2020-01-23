<template>

	<div class='colour-picker'>
		<label class='colour-picker-item'
			v-for="item in colours"
			:key="item.value"
		>
			<input
				type="radio"
				:name="name"
				:value="value"
				:checked="value == item.value"
				@change="$emit('change', item.value)"
			>
			<div class='colour-picker-icon' :style="{backgroundColor: item.value}"><span></span></div>
		</label>
	</div>

</template>

<script>

export default {

	props: [
		'name',
		'colours',
		'value',
	],

}

</script>
