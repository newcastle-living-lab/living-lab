<template>

	<v-group ref="ethos">
		<v-rect :config="shape"/>
		<v-text :config="text"/>
	</v-group>

</template>

<script>

import colours from 'colors.css';

export default {

	data() {

		return {
			shape: {
				x: 95 - 55,
				y: 480,
				width: 110,
				height: 75,
				stroke: colours.black,
				strokeWidth: 1,
			},
			text: {
				x: 95 - 55,
				width: 110,
				y: (480 + 37.5) - 6,
				text: 'ETHOS',
				fontStyle: 'bold',
				fontSize: 12,
				align: 'center'
			},
		}
	}

}
</script>
