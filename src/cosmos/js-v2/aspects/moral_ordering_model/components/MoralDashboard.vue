<template>

	<v-group>

		<CosmosTitle :aspectId="aspectId" :options="options" />

		<!-- rectangles -->
		<v-group :config="{
			'x': 75,
			'y': 130
		}">
			<v-rect
				v-for="(config, name) in rectsConfig"
				:key="name"
				:config="config"
			/>
		</v-group>

		<!-- text -->
		<v-group>
			<v-text
				v-for="(config, name) in textsConfig"
				:key="name"
				:config="config"
			/>
		</v-group>

		<!-- images (looped arrows) -->
		<v-group
			v-for="(config, name) in imagesConfig"
			:key="name"
			:config="config.group"
		>
			<CosmosImage :config="config.arrow" />
			<CosmosImage :config="config.loop" />
		</v-group>

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

	name: 'MoralDashboard',

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

		userValues() {

			var data = {
				hasGovern: false,
				hasDeliver: false,
				hasEthos: false,
				hasPlanManage: false,
			};

			if (this.aspectData.govern.actions
				&& this.aspectData.govern.actors.length > 0
				&& this.aspectData.govern.outcomes
				&& this.aspectData.govern.evolution
				&& this.aspectData.govern.improvements
			) {
				data.hasGovern = true;
			}

			if (this.aspectData.deliver.method
				&& this.aspectData.deliver.actors.length > 0
				&& this.aspectData.deliver.evidenceUrl
			) {
				data.hasDeliver = true;
			}

			if (this.aspectData.defineEthos.values
				&& this.aspectData.defineEthos.definedBy
				&& this.aspectData.defineEthos.evidenceUrl
			) {
				data.hasEthos = true;
			}

			var hasPlanManagePrior = this.aspectData.planManagePrior.actions
				&& this.aspectData.planManagePrior.actors.length > 0
				&& this.aspectData.planManagePrior.evidenceUrl;
			var hasPlanManageCurrent = this.aspectData.planManageCurrent.actions
				&& this.aspectData.planManageCurrent.actors.length > 0
				&& this.aspectData.planManageCurrent.evidenceUrl;

			data.hasPlanManage = (hasPlanManagePrior && hasPlanManageCurrent);

			return data;
		},

		/**
		 * Blue rectangles.
		 * r1-r5: bottom to top.
		 *
		 */
		rectsConfig() {

			var data = {};

			var defaults = {
				width: 760,
				height: 490,
				x: 0,
				y: 0,
				fill: "#ffffff",
				stroke: "#1FA3E3",
				strokeWidth: 3,
				cornerRadius: 45,
				visible: (this.userGuide.isOpen ? false : true),
			};

			data.r1 = {
				...defaults,
				x: 0,
				y: 105,
			};

			data.r2 = {
				...defaults,
				x: 15,
				y: 95,
				opacity: 0.7,
			};

			data.r3 = {
				...defaults,
				x: 30,
				y: 85,
				opacity: 0.7,
			};

			data.r4 = {
				...defaults,
				x: 45,
				y: 75,
				opacity: 0.7,
			};

			data.r5 = {
				...defaults,
				x: 60,
				y: 60,
				fill: "#ffffff",
				stroke: "#99D5F2",
				strokeWidth: 6,
				opacity: 0.7,
			};

			/*
			data.red = {
				...defaults,
				width: 630,
				height: 365,
				x: 95,
				y: 0,
				fill: "#FCEDEF",
				stroke: "#E75168",
				strokeWidth: 3,
				cornerRadius: 45,
				opacity: 0.8,
				visible: false,
			};
			*/

			if (this.userGuide.isOpen) {
				if (this.userGuide.currentStep >= 7) {
					data.r5.visible = true;
				}

				if (this.userGuide.currentStep >= 8) {
					data.r1.visible = true;
					data.r2.visible = true;
					data.r3.visible = true;
					data.r4.visible = true;
				}

			}

			return data;
		},

		textsConfig() {

			var data = {};

			var defaults = {
				...defaultTextConfig,
				fontSize: 25,
				align: "center",
				fill: "#2e7354",
				visible: false,
			};

			data.govern = {
				...defaults,
				x: 570,
				y: 415,
				text: "Govern",
			};

			data.deliver = {
				...defaults,
				x: 420,
				y: 620,
				text: "Deliver",
			};

			data.ethosLabel = {
				...defaults,
				x: 630,
				y: 150,
				text: "Define Ethos",
			};

			data.ethosItems = {
				...defaults,
				x: 640,
				y: 200,
				text: "Values\nPrinciples\nIntentions\nPolicies",
				fontSize: 20,
				align: "left",
				lineHeight: 1.3,
			};

			data.planLabel = {
				...defaults,
				x: 200,
				y: 275,
				width: 200,
				text: "Plan & Manage",
			};

			data.planItems = {
				...defaults,
				x: 170,
				y: 310,
				width: 200,
				text: "Rules\nResources\nProcesses\nAccounts",
				fontSize: 20,
				align: "right",
				lineHeight: 1.3,
			};

			data.experience = {
				...defaults,
				x: 745,
				y: 570,
				text: "Experience",
			};

			data.individualCases = {
				...defaults,
				x: 835,
				y: 210,
				text: "Individual Cases",
				fontSize: 40,
				opacity: 0.6,
			};

			data.serviceLevel = {
				...defaults,
				x: 835,
				y: 270,
				text: "The Service Level",
				fontSize: 40,
			};

			if (this.userGuide.isOpen) {

				if (this.userGuide.currentStep >= 0) {
					data.ethosLabel.visible = true;
					data.ethosItems.visible = true;
				}

				if (this.userGuide.currentStep >= 1) {
					data.planLabel.visible = true;
					data.planItems.visible = true;
				}

				if (this.userGuide.currentStep >= 3) {
					data.deliver.visible = true;
					data.experience.visible = true;
				}

				if (this.userGuide.currentStep >= 5) {
					data.govern.visible = true;
				}

				if (this.userGuide.currentStep >= 7) {
					data.individualCases.visible = true;
					data.individualCases.opacity = 1;
				}

				if (this.userGuide.currentStep >= 8) {
					data.serviceLevel.visible = true;
				}

			} else {

				data.individualCases.visible = true;
				data.serviceLevel.visible = true;

				data.govern.visible = this.userValues.hasGovern;
				data.deliver.visible = this.userValues.hasDeliver;
				data.experience.visible = this.userValues.hasDeliver;
				data.ethosLabel.visible = this.userValues.hasEthos;
				data.ethosItems.visible = this.userValues.hasEthos;
				data.planLabel.visible = this.userValues.hasPlanManage;
				data.planItems.visible = this.userValues.hasPlanManage;

			}

			return data;
		},

		imagesConfig() {

			var data = {};

			var groupDefaults = {
				x: 0,
				y: 0
			};

			var imageDefaults = {
				x: 0,
				y: 0,
				scale: { x: 0.55, y: 0.55 },
				visible: false,
			};

			data.deliverAndExperience = {
				group: {
					...groupDefaults,
					x: 520,
					y: 455,
				},
				arrow: {
					...imageDefaults,
					filename: 'moral-ordering/arrow.png',
				},
				loop: {
					...imageDefaults,
					filename: 'moral-ordering/loop.png',
				},
			};

			data.planAndDeliver = {
				group: {
					...groupDefaults,
					x: 500,
					y: 350,
				},
				arrow: {
					...imageDefaults,
					filename: 'moral-ordering/arrow.png',
					rotation: 65,
				},
				loop: {
					...imageDefaults,
					filename: 'moral-ordering/loop.png',
					rotation: 65,
				},
			};

			data.planAndEthos = {
				group: {
					...groupDefaults,
					x: 550,
					y: 480,
				},
				arrow: {
					...imageDefaults,
					filename: 'moral-ordering/arrow.png',
					rotation: 135,
					scale: { x: -0.55, y: 0.55 },
				},
				loop: {
					...imageDefaults,
					filename: 'moral-ordering/loop.png',
					rotation: 135,
					scale: { x: -0.55, y: 0.55 },
				},
			};

			if (this.userGuide.isOpen) {

				if (this.userGuide.currentStep >= 2) {
					data.planAndEthos.arrow.visible = true;
				}
				if (this.userGuide.currentStep >= 3) {
					data.deliverAndExperience.arrow.visible = true;
					data.planAndDeliver.arrow.visible = true;
				}
				if (this.userGuide.currentStep >= 5) {
					data.planAndEthos.loop.visible = true;
					data.planAndDeliver.loop.visible = true;
					data.deliverAndExperience.loop.visible = true;
				}

			} else {

				if (this.userValues.hasEthos && this.userValues.hasPlanManage) {
					data.planAndEthos.arrow.visible = true;
					if (this.userValues.hasGovern) {
						data.planAndEthos.loop.visible = true;
					}
				}
				if (this.userValues.hasDeliver && this.userValues.hasPlanManage) {
					data.planAndDeliver.arrow.visible = true;
					if (this.userValues.hasGovern) {
						data.planAndDeliver.loop.visible = true;
					}
				}
				if (this.userValues.hasDeliver) {
					data.deliverAndExperience.arrow.visible = true;
					if (this.userValues.hasGovern) {
						data.deliverAndExperience.loop.visible = true;
					}
				}
			}



			// data.planAndDeliver = {
			// 	...defaults,
			// 	x: 500,
			// 	y: 350,
			// 	rotation: 65,
			// };

			// data.planAndEthos = {
			// 	...defaults,
			// 	x: 550,
			// 	y: 480,
			// 	rotation: 135,
			// 	scale: { x: -0.42, y: 0.42 },
			// };

			// if (this.userGuide.isOpen) {
			// 	if (this.userGuide.currentStep >= 2) {
			// 		data.planAndEthos.visible = true;
			// 	}
			// }

			return data;

		}


	},

	methods: {
		inArray(arr, item) {
			return (arr.indexOf(item) !== -1);
		}
	}

}
</script>
