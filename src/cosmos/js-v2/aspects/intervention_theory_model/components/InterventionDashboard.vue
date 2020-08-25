<template>

	<v-group>

		<CosmosTitle :aspectId="aspectId" :options="options" />
<!--
		<CosmosImage :config="{
			x: 0,
			y: 90,
			filename: 'intervention-theory/dashboard.png',
			opacity: 0,
		}" /> -->

		<CosmosImage :config="bgConfig.star" />
		<CosmosImage :config="bgConfig.change" />
		<CosmosImage :config="bgConfig.intervention" />
		<CosmosImage :config="bgConfig.environmentArrows" />
		<CosmosImage :config="bgConfig.wellbeingArrows" />
		<CosmosImage :config="bgConfig.learning" />

		<v-text
			v-for="(config, name) in wellbeingConfig"
			:key="name"
			:config="config"
		/>

		<v-text
			v-for="(config, name) in interventionConfig"
			:key="name"
			:config="config"
		/>

		<v-text :config="learningConfig" />

		<v-text :config="innovationConfig" />

	</v-group>

</template>

<script>

import { get } from 'vuex-pathify';
import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';

const defaultTextConfig = {
	fontSize: 24,
	fontStyle: 'bold',
	fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
	lineHeight: 1.2,
	align: 'center'
};

export default {

	name: 'InterventionDashboard',

	props: {
		aspectId: [Boolean, String],
		options: Object,
		definitions: [Object, Array],
	},

	computed: {

		...get(['userGuide']),

		dataPath() {
			if (this.userGuide.isOpen) {
				return `userGuide@project.data.${this.aspectId}`;
			} else {
				return `project@data.${this.aspectId}`;
			}
		},

		aspectData: get(':dataPath'),

		bgConfig() {

			var data = {};

			var defaults = {
				x: 0,
				y: 90,
			};

			data.star = {
				...defaults,
				filename: 'intervention-theory/dashboard-wellbeing-star.png',
				opacity: 1,
			};

			data.intervention = {
				...defaults,
				filename: 'intervention-theory/dashboard-intervention.png',
				opacity: 1,
			};

			data.wellbeingArrows = {
				...defaults,
				filename: 'intervention-theory/dashboard-wellbeing-arrows.png',
				opacity: 1,
			};

			data.environmentArrows = {
				...defaults,
				filename: 'intervention-theory/dashboard-environment-arrows.png',
				opacity: 1,
			};

			data.learning = {
				...defaults,
				filename: 'intervention-theory/dashboard-learning.png',
				opacity: 1,
			};

			data.change = {
				...defaults,
				filename: 'intervention-theory/dashboard-change.png',
				opacity: 1,
			};

			if (this.userGuide.isOpen) {
				data.star.opacity = this.userGuide.currentStep >= 0 ? 1 : 0;
				data.intervention.opacity = this.userGuide.currentStep >= 12 ? 1 : 0;
				data.wellbeingArrows.opacity = this.userGuide.currentStep >= 8 ? 1 : 0;
				data.environmentArrows.opacity = this.userGuide.currentStep >= 10 ? 1 : 0;
				data.learning.opacity = this.userGuide.currentStep >= 12 ? 1 : 0;
				data.change.opacity = this.userGuide.currentStep >= 11 ? 1 : 0;
			}

			return data;
		},

		wellbeingConfig() {

			var items = [
				{ key: 'physical_env', text: 'Physical Environment', fill: '#6161EA', x: 90, y: 160, width: 175 },
				{ key: 'socio_cultural_env', text: 'Socio-cultural Environment', fill: '#6161EA', x: 530, y: 160, width: 175 },

				{ key: 'faculties_skills', text: 'Faculties and Skills', x: 130, y: 300, width: 175 },
				{ key: 'mental_psych', text: 'Mental and Psychological', x: 490, y: 305, width: 220 },
				{ key: 'socio_economic', text: 'Socio-Economic', x: 25, y: 545, width: 280 },
				{ key: 'physiological', text: 'Physiological', x: 510, y: 545, width: 220 },
			];

			var config = {},
				itemConfig = {},
				isVisible = false;

			items.forEach((item) => {

				isVisible = false;

				if (this.userGuide.isOpen) {
					switch (item.key) {
						case 'faculties_skills':
						case 'mental_psych':
						case 'socio_economic':
						case 'physiological':
							isVisible = this.userGuide.currentStep >= 8;
						break;
						case 'physical_env':
						case 'socio_cultural_env':
							isVisible = this.userGuide.currentStep >= 10;
						break;
					}
				} else {
					isVisible = this.inArray(this.aspectData.wellbeing.items, item.key);
				}

				itemConfig = {
					fontSize: 22,
					visible: isVisible,
					text: item.text,
					fill: item.fill ? item.fill : '#1818AA',
					x: item.x,
					y: item.y,
					width: item.width,
				};

				config[item.key] = {...defaultTextConfig, ...itemConfig};

			});

			var headingConfig = {
				fontSize: 30,
				text: 'Well Being',
				fill: '#1818AA',
				x: 290,
				y: 450,
				width: 220,
			};

			config.heading = {...defaultTextConfig, ...headingConfig};

			return config;
		},

		interventionConfig() {

			var items = [
				{ key: 'identification', text: 'Identification & Planning', x: 20, y: 630, width: 220 },
				{ key: 'coordination_delivery', text: 'Coordination & Delivery', x: 155, y: 700, width: 220 },
				{ key: 'management', text: 'Management', x: 350, y: 740, width: 210 },
				{ key: 'governance', text: 'Governance', x: 510, y: 700, width: 200 },
				{ key: 'learning', text: 'Learning', x: 600, y: 630, width: 160 },
			];

			var config = {},
				itemConfig = {},
				isVisible = false;

			items.forEach((item) => {

				isVisible = false;

				if (this.userGuide.isOpen) {
					isVisible = this.userGuide.currentStep >= 12;
				} else {
					isVisible = this.inArray(this.aspectData.intervention.items, item.key);
				}

				itemConfig = {
					fontSize: 22,
					visible: isVisible,
					text: item.text,
					fill: item.fill ? item.fill : '#D3332A',
					x: item.x,
					y: item.y,
					width: item.width,
				};

				config[item.key] = {...defaultTextConfig, ...itemConfig};

			});

			return config;
		},

		learningConfig() {

			var definition = find(this.definitions, { id: 'learning' });
			var options = find(definition.children, { id: 'items' }).componentProps.options;

			var isVisible = false;

			if (this.userGuide.isOpen) {
				var lines = options;
				isVisible = this.userGuide.currentStep >= 12;
			} else {
				var lines = filter(options, (option) => this.inArray(this.aspectData.learning.items, option.value));
				isVisible = true;
			}

			lines = map(lines, (line) => line.label);

			var itemConfig = {
				x: 800,
				y: 665,
				width: 310,
				height: 110,
				visible: isVisible,
				align: 'left',
				verticalAlign: 'middle',
				lineHeight: 1.5,
				fontSize: 22,
				text: lines.join("\n"),
				fill: '#D3332A',
			};

			return {...defaultTextConfig, ...itemConfig};
		},

		innovationConfig() {

			var definition = find(this.definitions, { id: 'innovation' });
			var options = find(definition.children, { id: 'items' }).componentProps.options;

			var isVisible = false;

			if (this.userGuide.isOpen) {
				var lines = options;
				isVisible = this.userGuide.currentStep >= 11;
			} else {
				var lines = filter(options, (option) => this.inArray(this.aspectData.innovation.items, option.value));
				isVisible = true;
			}

			lines = map(lines, (line) => line.label);

			var itemConfig = {
				visible: isVisible,
				align: 'left',
				verticalAlign: 'middle',
				lineHeight: 1.5,
				fontSize: 30,
				text: lines.join("\n"),
				fill: '#410141',
				x: 955,
				y: 255,
				width: 310,
				height: 420,
			};

			return {...defaultTextConfig, ...itemConfig};
		},

	},

	methods: {
		inArray(arr, item) {
			return (arr.indexOf(item) !== -1);
		}
	}

}
</script>
