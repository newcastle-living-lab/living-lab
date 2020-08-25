<template>

	<v-group>
		<v-image :config="imageConfig"/>
	</v-group>

</template>

<script>

import { get } from 'vuex-pathify';

export default {

	name: 'CosmosImage',

	props: {
		options: Object,
		definitionName: String,
		config: Object,
	},

	data() {
		return {
			image: null,
		}
	},

	computed: {
		imageConfig() {
			return {
				x: this.config.x ? this.config.x : 0,
				y: this.config.y ? this.config.y : 0,
				image: this.image,
				scale: this.config.scale ? this.config.scale : { x: 1, y: 1 },
				rotation: this.config.rotation ? this.config.rotation : 0,
				visible: typeof(this.config.visible) !== 'undefined' ? this.config.visible : true,
				opacity: typeof(this.config.opacity) !== 'undefined' ? this.config.opacity : 1,
			}
		},
	},

	created() {
		const image = new window.Image();
		image.src = `/cosmos-images/${this.config.filename}`;
		image.onload = () => {
			this.image = image;
		};
	}

}
</script>
