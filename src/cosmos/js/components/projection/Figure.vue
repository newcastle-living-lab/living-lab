<template>

	<v-line ref="figure" :config="config"/>

</template>

<script>

const figPoints = {
	male: [0, 0, -3.5, 1, -7, 5, -9, 10, -7, 16, -2, 19, -3, 22, -9, 22, -22, 54, -21, 55, -20, 57, -16, 57, -10, 40, -10, 90, -8, 92, -5, 93, -3, 90, -2, 60, 2, 60, 3, 90, 5, 93, 8, 92, 10, 90, 10, 40, 16, 57, 20, 57, 21, 55, 22, 54, 9, 22, 3, 22, 2, 19, 7, 16, 9, 10, 7, 5, 3.5, 1],
	female: [0, 0, -3.5, 1, -7.5, 5, -9, 10, -6.7, 16, -2, 19, -3, 22, -9, 22, -23, 54, -21, 55, -19, 57, -16, 56, -10, 40, -15, 70, -10, 70, -10, 90, -8, 93, -4.5, 93, -3, 90, -3, 70, 3, 70, 3, 90, 4.5, 93, 8, 93, 10, 90, 10, 70, 15, 70, 10, 40, 16, 56, 19, 57, 21, 55, 23, 54, 9, 22, 3, 22, 2, 19, 6.7, 16, 9, 10, 7.5, 5, 3.5, 1, 0, 0],
};

const scaleFigurePoints = function(srcPoints, scaleSize) {
	var scaledPoints = [];
	for (var i = 0; i < srcPoints.length; i++) {
		scaledPoints.push(Math.round(srcPoints[i] * scaleSize));
	}
	return scaledPoints;
}

export default {

	props: {
		colour: {
			type: String,
			default: '#cccccc',
		},
		shape: {
			type: String,
			default: 'male',
		},
		size: {
			type: Number,
			default: 1,
		},
		x: Number,
		y: Number,
	},

	computed: {

		config() {
			return {
				closed: true,
				x: this.x,
				y: this.y,
				fill: this.colour,
				strokeWidth: 0,
				dashEnabled: false,
				points: scaleFigurePoints(figPoints[this.shape], this.size),
			};
		}

	}

}
</script>
