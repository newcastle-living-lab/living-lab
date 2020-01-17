<template>

	<v-group>
		<v-text ref="label" :config="label"/>
		<v-text ref="comment" :config="comment"/>
		<!-- <v-line ref="bubble" :config="bubble"/> -->
		<v-path ref="bubble" :config="bubble"/>
		<shape-figure ref="figure" v-bind="figure"/>
	</v-group>

</template>

<script>

import { mapState } from 'vuex';
import ShapeFigure from './Figure.vue';

export default {

	components: {
		ShapeFigure
	},

	computed: {

		...mapState('project', {
			projectData: state => state.project.data
		}),

		label() {
			return {
				text: typeof this.projectData.beneficiary == 'object' ? this.projectData.beneficiary.label : '',
				fontSize: 12,
				fontStyle: 'bold',
				lineHeight: 1.3,
				x: 735,
				y: 310,
				width: 70,
				padding: 5,
				align: 'center',
			}
		},

		comment() {
			return {
				text: typeof this.projectData.beneficiary == 'object' ? this.projectData.beneficiary.comment : '',
				fontSize: 12,
				lineHeight: 1.3,
				x: 780,
				y: 170,
				width: 110,
				height: 60,
				align: 'center',
				verticalAlign: 'middle',
			}
		},

		figure() {
			return {
				x: 770,
				y: 250,
				colour: typeof this.projectData.beneficiary == 'object' ? this.projectData.beneficiary.colour : '#cccccc',
				shape: typeof this.projectData.beneficiary == 'object' ? this.projectData.beneficiary.shape : 'male',
				size: 0.6
			};
		},

		bubble() {
			return {
				x: 770,
				y: 165,
				data: 'M 97 41.897 C 97 45.477 94.098 48.379 90.517 48.379 L 15.966 48.379 L 3 61.345 L 3 9.483 C 3 5.902 5.902 3 9.483 3 L 90.517 3 C 94.098 3 97 5.902 97 9.483 L 97 41.897 Z ',
				strokeWidth: 1,
				stroke: '#000000',
				scale: {
					x: 1.3,
					y: 1.3,
				}
			}
		}

	}

}
</script>
