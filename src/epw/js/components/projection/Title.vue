<template>

	<v-group>
		<v-text ref="title" :config="config"/>
	</v-group>

</template>

<script>

import { mapState } from 'vuex';

export default {

	computed: {
		...mapState('app', ['options']),
		...mapState('project', {
			projectData: state => state.project.data
		}),

		config() {
			return {
				text: this.projectData.title,
				fontSize: 20,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				x: 20,
				y: 20,
				width: 400,
			}
		}

	}

}
</script>
