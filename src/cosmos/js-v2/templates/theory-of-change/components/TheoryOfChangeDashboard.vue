<template>

	<v-group>
		<CosmosTitle :options="options" />

		<v-group :config="{
			x: 0,
			y: 80,
		}">

			<CosmosImage :config="{
				x: 0,
				y: 0,
				filename: 'theory-of-change/dashboard.png'
			}" />

			<v-text :config="zeroOrderConfig" />
			<v-text :config="fourthOrderConfig" />

			<v-text
				v-for="(config, name) in firstOrderConfigs"
				:key="name"
				:config="config"
			/>

			<v-text
				v-for="(config, name) in secondOrderConfigs"
				:key="name"
				:config="config"
			/>

			<v-text
				v-for="(config, name) in thirdOrderConfigs"
				:key="name"
				:config="config"
			/>

		</v-group>

<!--
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

		<v-text :config="innovationConfig" /> -->

	</v-group>

</template>

<script>

import { get } from 'vuex-pathify';
import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';

import Templates from '@/templates';

const defaultTextConfig = {
	fontSize: 32,
	// fontStyle: 'bold',
	fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
	lineHeight: 1.2,
	align: 'left'
};

export default {

	name: 'TheoryOfChangeDashboard',

	props: {
		options: Object,
		definitions: [Object, Array],
	},

	computed: {

		projectData: get('project@data'),

		zeroOrderConfig() {
			var config = {
				text: 'Zero Order',
				fill: '#2d2d68',
				x: 890,
				y: 645,
			};

			return {...defaultTextConfig, ...config};
		},

		firstOrderConfigs() {

			var configs = {};

			var hasVision = this.projectData.first_order.vision.length > 0;
			var hasPlan = this.projectData.first_order.plan.length > 0;
			var hasExecute = this.projectData.first_order.execute.length > 0;
			var hasMeasure = this.projectData.first_order.measure.length > 0;

			configs.label = {
				...defaultTextConfig,
				text: 'First Order',
				fill: '#947194',
				x: 480,
				y: 435,
				visible: (hasVision && hasPlan && hasExecute && hasMeasure),
			};

			configs.risk = {
				...defaultTextConfig,
				text: 'Risk',
				fill: '#d317a4',
				x: 345,
				y: 600,
				visible: (hasVision && hasPlan && hasExecute && hasMeasure),
			};

			configs.vision = {
				...defaultTextConfig,
				text: 'Vision',
				fill: '#255d4d',
				x: 440,
				y: 375,
				visible: (hasVision),
			};

			configs.plan = {
				...defaultTextConfig,
				text: 'Plan',
				fill: '#255d4d',
				x: 705,
				y: 515,
				visible: (hasPlan),
			};

			configs.execute = {
				...defaultTextConfig,
				text: 'Execute',
				fill: '#255d4d',
				x: 435,
				y: 670,
				visible: (hasExecute),
			};

			configs.measure = {
				...defaultTextConfig,
				text: 'Measure',
				fill: '#255d4d',
				x: 155,
				y: 515,
				visible: (hasMeasure),
			};

			return configs;
		},

		secondOrderConfigs() {

			var configs = {};

			var hasSenseMaking = this.projectData.second_order.sense_making.length > 0;
			var hasLanguaging = this.projectData.second_order.languaging.length > 0;
			var hasCommitting = this.projectData.second_order.committing.length > 0;

			configs.label = {
				...defaultTextConfig,
				text: 'Second Order',
				fill: '#cab5ca',
				x: 390,
				y: 165,
				visible: (hasSenseMaking && hasLanguaging && hasCommitting),
			};

			configs.ambiguity = {
				...defaultTextConfig,
				text: 'Ambiguity',
				fill: '#d317a4',
				x: 270,
				y: 115,
				visible: (hasSenseMaking && hasLanguaging && hasCommitting),
			};

			configs.sense_making = {
				...defaultTextConfig,
				text: 'Sense-Making',
				fill: '#a8bdb7',
				x: 100,
				y: 215,
				visible: (hasSenseMaking),
			};

			configs.plan = {
				...defaultTextConfig,
				text: '"Languaging"',
				fill: '#a8bdb7',
				x: 350,
				y: 65,
				visible: (hasLanguaging),
			};

			configs.committing = {
				...defaultTextConfig,
				text: 'Committing',
				fill: '#a8bdb7',
				x: 610,
				y: 215,
				visible: (hasCommitting),
			};

			return configs;
		},

		thirdOrderConfigs() {

			var configs = {};

			var hasProcesses = this.projectData.third_order.processes.length > 0;

			configs.label = {
				...defaultTextConfig,
				text: 'Third Order',
				fill: '#3c003c',
				x: 45,
				y: 295,
				width: 100,
				align: 'center',
				visible: (hasProcesses),
			};

			configs.ambivalence = {
				...defaultTextConfig,
				text: 'Ambivalence',
				fill: '#d317a4',
				x: 340,
				y: 295,
				visible: (hasProcesses),
				rotation: -4,
			};

			return configs;
		},

		fourthOrderConfig() {
			var config = {
				text: 'Fourth Order!',
				fill: '#947194',
				x: 850,
				y: 35,
			};

			return {...defaultTextConfig, ...config};
		},

	}

}
</script>
