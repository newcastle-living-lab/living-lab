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
				y: 400,
				width: 110,
				height: 50,
				cornerRadius: 25,
				stroke: colours.black,
				strokeWidth: 1,
			},

			text: {
				x: 95 - 55,
				width: 110,
				y: (400 + 25) - 6,
				text: 'LAW',
				fontStyle: 'bold',
				fontSize: 12,
				align: 'center'
			},

		}

	}

}
</script>
