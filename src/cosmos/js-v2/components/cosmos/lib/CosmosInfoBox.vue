<template>

	<v-group :config="groupConfig">
		<v-text ref="title" :config="titleConfig" />
		<v-text ref="body" :config="bodyConfig" />
		<v-rect ref="border" :config="borderConfig" />
	</v-group>

</template>

<script>

import { get } from 'vuex-pathify';
import throttle from 'lodash/throttle';
import colours from 'colors.css';

const defaultModel = {
	title: false,
	body: false,
};

export default {

	name: 'CosmosInfoBox',

	data() {
		return {
			height: 0,
		}
	},

	props: {
		aspectId: String,
		options: Object,
		definitionName: String,
		config: Object,
	},

	watch: {
		'model': {
			handler: throttle(function(newVal, oldVal) {
				this.refreshPositions();
			}, 250),
			deep: true,
		}
	},

	computed: {

		dataPath() {
			return `project@data.${this.aspectId}`;
		},

		aspectData: get(':dataPath'),

		model() {
			return this.aspectData && this.aspectData[this.definitionName]
				? this.aspectData[this.definitionName]
				: Object.assign({}, defaultModel);
		},

		isVisible() {
			return this.model.title && this.model.title.length > 0 ? true : false;
		},

		groupConfig() {
			return {
				x: this.config.x ? this.config.x : 0,
				y: this.config.y ? this.config.y : 0,
				width: this.config.width ? this.config.width : 400,
				height: 0,
				visible: this.isVisible
			};
		},

		titleConfig() {
			return {
				x: 0,
				y: 0,
				width: 400,
				text: this.model.title,
				fontSize: 14,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				padding: 10,
				align: 'left',
			}
		},

		bodyConfig() {
			return {
				x: 0,
				y: 20,
				width: 400,
				text: this.model.body,
				fontFamily: this.options.fontFamily,
				fontSize: 12,
				lineHeight: 1.3,
				padding: 10,
			}
		},

		borderConfig() {
			return {
				x: 0,
				y: 0,
				width: 400,
				height: this.height,
				stroke: colours.black,
				strokeWidth: 1
			}
		}

	},

	methods: {

		refreshPositions() {

			if ( ! this.isVisible) {
				return;
			}

			var refs = {
				title: this.$refs.title,
				body: this.$refs.body,
			};

			if ( ! refs.body || ! refs.title) {
				return;
			}

			this.$nextTick(() => {
				this.height =
					refs.body.getNode().getClientRect().height
					+ refs.title.getNode().getClientRect().height
					- 20;
			});
		}

	},

	mounted() {
		this.refreshPositions();
	}


}
</script>
