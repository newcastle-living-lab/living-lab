<template>

	<v-group ref="ethos">
		<v-line :config="lineOuter"/>
		<v-line :config="lineInner"/>
		<v-text :config="text"/>
	</v-group>

</template>

<script>

import colours from 'colors.css';

export default {

	data() {

		return {

			lineOuter: {
				points: [325, 535, 930, 885],
				stroke: colours.orange,
				strokeWidth: 3,
				lineCap: "square",
				lineJoin: "square"
			},

			lineInner: {
				points: [330, 530, 935, 880],
				stroke: colours.orange,
				strokeWidth: 3,
				lineCap: "square",
				lineJoin: "square"
			},

			text: {
				x: 570,
				y: 685,
				rotation: 30,
				text: "INFRASTRUCTURAL",
				fontStyle: "bold",
				fontSize: 12,
			},

		}
	}

}
</script>
