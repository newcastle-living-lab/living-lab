<template>

	<v-group :config="groupConfig">

		<v-rect ref="border" :config="borderConfig" />
		<v-text ref="title" :config="titleConfig" />

		<v-group :config="itemsGroupConfig">
			<CosmosExternalsItem
				v-for="(item, index) in mappedItems"
				:key="index"
				:data="item.data"
				:config="item.config"
				:options="options"
			/>
		</v-group>

	</v-group>

</template>

<script>

import { get } from 'vuex-pathify';
import colours from 'colors.css';
import sum from 'lodash/sum';
import map from 'lodash/map';
import throttle from 'lodash/throttle';

const defaultModel = {
	label: false,
	items: []
};

const dimensions = {
	item: {
		width: 110,
		height: 70,
	},
	padding: 10,
	spacing: 10
};

export default {

	name: 'CosmosExternals',

	data() {
		return {
			dimensions: dimensions,
			titleFontSize: 14,
			titleLineHeight: 1.4,
		}
	},

	props: {
		aspectId: String,
		options: Object,
		definitionName: String,
		config: Object,
	},

	computed: {

		// projectData: get('project@data'),

		dataPath() {
			return `project@data.${this.aspectId}`;
		},

		aspectData: get(':dataPath'),

		model() {
			return this.aspectData && this.aspectData[this.definitionName]
				? this.aspectData[this.definitionName]
				: Object.assign({}, defaultModel);
		},

		mappedItems() {

			var items = map(this.model.items, (item, index) => {

				var pos = { x: 0, y: 0 };

				var row = Math.floor(index / this.numCols),
					col = (index % this.numCols);

				pos.x += col * (this.dimensions.item.width + this.dimensions.spacing);
				pos.y += row * (this.dimensions.item.height + this.dimensions.spacing);

				return {
					// index: index,
					// row: row,
					// col: col,
					data: {
						label: item.label,
						url: item.url
					},
					config: {
						colour: this.config.itemColour ? this.config.itemColour : colours.black,
						width: this.dimensions.item.width,
						height: this.dimensions.item.height,
						x: pos.x,
						y: pos.y,
					}
				}
			});

			return items;
		},

		numRows() {
			return this.config.rows ? this.config.rows : 2;
		},

		numCols() {
			return this.config.cols ? this.config.cols : 4
		},

		isVisible() {
			var hasLabel = this.model.label && this.model.label.length > 0;
			var hasItems = this.model.items && this.model.items.length > 0;
			return hasLabel && hasItems ? true : false;
		},

		groupConfig() {

			var width = sum([
				this.dimensions.padding * 2,
				(this.dimensions.item.width + this.dimensions.spacing) * this.numCols
			]);

			var height = sum([
				this.dimensions.padding * 2,	// top + bottom
				(this.titleFontSize * this.titleLineHeight),		// title
				this.dimensions.padding,		// after title
				(this.dimensions.item.height + this.dimensions.spacing) * this.numRows,
				this.dimensions.spacing
			]);

			return {
				x: this.config.x ? this.config.x : 0,
				y: this.config.y ? this.config.y : 0,
				width: Math.ceil(width),
				height: Math.ceil(height),
				visible: this.isVisible,
			};
		},

		titleConfig() {
			var groupConfig = this.groupConfig;
			return {
				x: 0,
				y: 0,
				width: groupConfig.width,
				text: this.model.label ? this.model.label : false,
				fontSize: this.titleFontSize,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: this.titleLineHeight,
				padding: this.dimensions.padding,
				align: 'left',
			}
		},

		borderConfig() {
			var groupConfig = this.groupConfig;
			return {
				x: 0,
				y: 0,
				width: groupConfig.width,
				height: groupConfig.height,
				stroke: colours.black,
				strokeWidth: 1
			}
		},

		itemsGroupConfig() {

			var groupConfig = this.groupConfig;

			var y = sum([
				this.dimensions.padding * 2,
				(this.titleFontSize * this.titleLineHeight),		// title
			]);

			return {
				x: this.dimensions.padding,
				y: Math.ceil(y),
			}
		}

	},


}
</script>
