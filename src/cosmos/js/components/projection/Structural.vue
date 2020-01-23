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
				points: [325, 365, 930, 25],
				stroke: colours.blue,
				strokeWidth: 3,
				lineCap: "square",
				lineJoin: "square"
			},

			lineInner: {
				points: [330, 370, 935, 30],
				stroke: colours.blue,
				strokeWidth: 3,
				lineCap: "square",
				lineJoin: "square"
			},

			text: {
				x: 570,
				y: 245,
				rotation: -30,
				text: "STRUCTURAL",
				fontStyle: "bold",
				fontSize: 12,
			},

		}

	}

}
</script>
