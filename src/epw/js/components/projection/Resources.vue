<template>

	<v-group ref="ethos">
		<v-regular-polygon :config="shape"/>
		<v-text :config="text"/>
	</v-group>

</template>

<script>

import colours from 'colors.css';

export default {

	data() {

		return {

			shape: {
				x: 160,
				y: 320,
				rotation: -30,
				sides: 6,
				radius: 55,
				stroke: colours.black,
				strokeWidth: 1,
			},

			text: {
				x: 160 - 55,
				width: 110,
				y: 320 - 6,
				text: 'Resources',
				fontStyle: 'bold',
				fontSize: 12,
				align: 'center'
			},

		}

	}

}
</script>
