<template>

	<v-group>

		<CosmosTitle :aspectId="aspectId" :options="options" />

		<CosmosNodeBracket
			v-for="(config, name) in bracketsConfig"
			:key="name"
			:config="config"
			:options="options"
		/>

		<v-line
			v-for="(config, name) in horizontalLinesConfig"
			:key="name"
			:config="config"
		/>

		<CosmosStakeholder
			v-for="(config, name) in stakeholdersConfig"
			:key="name"
			:aspectId="aspectId"
			:options="options"
			v-bind="config"
		/>

		<v-group :config="{
			x: 870,
			y: 30,
		}">

			<v-line
				v-for="(config, name) in agencyLinesConfig"
				:key="name"
				:config="config"
			/>

			<CosmosStakeholder
				v-for="(config, name) in agencyStakeholdersConfig"
				:key="name"
				:aspectId="aspectId"
				:options="options"
				v-bind="config"
			/>

		</v-group>

	</v-group>

</template>

<script>

import { get, sync } from 'vuex-pathify';
import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';
import random from 'lodash/random';
import forEach from 'lodash/forEach';

import filteredColours from '@/data/filteredColours.js';

const defaultTextConfig = {
	fontSize: 32,
	// fontStyle: 'bold',
	fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
	lineHeight: 1.2,
	align: 'left'
};

export default {

	name: 'AnalyticDashboard',

	props: {
		aspectId: [Boolean, String],
		options: Object,
		definitions: [Object, Array],
	},

	computed: {

		...sync([
			'userGuide',
		]),

		dataPath() {
			if (this.userGuide.isOpen) {
				return `userGuide@project.data.${this.aspectId}`;
			} else {
				return `project@data.${this.aspectId}`;
			}
		},

		aspectData: get(':dataPath'),

		bracketsConfig() {

			var config = {};

			config.meso = {
				position: "above",
				label: "Meso",
				labelColour: "#3d9970",
				lineColour: "#0074d9",
				description: "There may be a number of stages at this level.",
				x: 242,
				y: 215,
				width: 310,
			};

			config.macro = {
				position: "below",
				label: "Macro",
				labelColour: "#3d9970",
				lineColour: "#85144b",
				x: 85,
				y: 400,
				width: 300,
			};

			config.micro = {
				position: "below",
				label: "Micro",
				labelColour: "#3d9970",
				lineColour: "#0074d9",
				x: 400,
				y: 400,
				width: 300,
			};

			if (this.userGuide.isOpen) {
				config.micro.visible = this.userGuide.currentStep >= 1;
				config.meso.visible = this.userGuide.currentStep >= 3;
				config.macro.visible = this.userGuide.currentStep >= 4;
			}

			return config;
		},

		horizontalLinesConfig() {

			var config = {};

			var defaultConfig = {
				points: [0, 0, 45, 0],
				stroke: "#ff4136",
				strokeWidth: 6,
				lineCap: "round",
				lineJoin: "round"
			};

			if (this.userGuide.isOpen) {
				defaultConfig.visible = this.userGuide.currentStep >= 4;
			}

			config.spmToSom = {
				...defaultConfig,
				x: 140,
				y: 270,
			};

			config.somToSdm = {
				...defaultConfig,
				x: 295,
				y: 270,
			};

			config.sdmToFlsd = {
				...defaultConfig,
				x: 450,
				y: 270,
			};

			config.flsdToU = {
				...defaultConfig,
				x: 605,
				y: 270,
			};

			return config;
		},

		agencyLinesConfig() {

			var config = {};

			var defaultConfig = {
				x: 100,
				y: 315,
				points: [0, 0, 190, 0],
				stroke: "#ff4136",
				strokeWidth: 3,
				dash: [15, 5]
			};

			config.iToCm = {
				...defaultConfig,
				x: 100,
				y: 315,
			};

			config.iToBr = {
				...defaultConfig,
				x: 100,
				y: 270,
				points: [0, 0, 45, -45],
			};

			config.brToCt = {
				...defaultConfig,
				x: 245,
				y: 135,
				points: [0, 0, 45, -45],
			};

			config.iToS = {
				...defaultConfig,
				x: 100,
				y: 360,
				points: [0, 0, 45, 45],
			};

			config.vToS = {
				...defaultConfig,
				x: 100,
				y: 540,
				points: [0, 0, 45, -45],
			};

			config.sToCm = {
				...defaultConfig,
				x: 245,
				y: 405,
				points: [0, 0, 45, -45],
			};

			config.sToBe = {
				...defaultConfig,
				x: 245,
				y: 495,
				points: [0, 0, 45, 45],
			};

			config.brToCm = {
				...defaultConfig,
				x: 245,
				y: 225,
				points: [0, 0, 45, 45],
			};

			if (this.userGuide.isOpen) {
				forEach(config, (item, key) => {
					item.visible = this.userGuide.currentStep >= 10;
				});
			}

			return config;

		},

		stakeholdersConfig() {

			var config = {};

			config.sdm = {
				definitionName: 'serviceDeliveryManager',
				config: {
					group: {
						x: 345,
						y: 225,
					}
				}
			};

			config.flsd = {
				definitionName: 'frontLineServiceDeliverer',
				config: {
					group: {
						x: 500,
						y: 225,
					}
				}
			};

			config.user = {
				definitionName: 'user',
				config: {
					group: {
						x: 655,
						y: 225,
					}
				}
			};

			config.som = {
				definitionName: 'serviceOrganisationManager',
				config: {
					group: {
						x: 190,
						y: 225,
					}
				}
			};

			config.spm = {
				definitionName: 'servicePolicyMaker',
				config: {
					group: {
						x: 35,
						y: 225,
					}
				}
			};

			if (this.userGuide.isOpen) {

				config.sdm.config.group.visible = this.userGuide.currentStep >= 1;
				config.flsd.config.group.visible = this.userGuide.currentStep >= 3;
				config.user.config.group.visible = this.userGuide.currentStep >= 1;
				config.som.config.group.visible = this.userGuide.currentStep >= 3;
				config.spm.config.group.visible = this.userGuide.currentStep >= 4;

			}

			// Note: <CosmosStakeholder> handles its own visibility when group.visible isn't present (based on model's label' value)

			return config;
		},

		agencyStakeholdersConfig() {

			var config = {};

			config.ioc = {
				definitionName: 'instigatorsOfChange',
				config: {
					group: {
						x: 0,
						y: 270,
					}
				}
			};

			config.cm = {
				definitionName: 'changeMakers',
				config: {
					group: {
						x: 290,
						y: 270,
					}
				}
			};

			config.soc = {
				definitionName: 'subjectsOfChange',
				config: {
					group: {
						x: 145,
						y: 405,
					}
				}
			};

			config.br = {
				definitionName: 'broker',
				config: {
					group: {
						x: 145,
						y: 135,
					}
				}
			};

			config.ct = {
				definitionName: 'changeTheorists',
				config: {
					group: {
						x: 290,
						y: 0,
					}
				}
			};

			config.be = {
				definitionName: 'beneficiaries',
				config: {
					group: {
						x: 290,
						y: 540,
					}
				}
			};

			config.v = {
				definitionName: 'victims',
				config: {
					group: {
						x: 0,
						y: 540,
					}
				}
			};

			if (this.userGuide.isOpen) {

				config.ioc.config.group.visible = this.userGuide.currentStep >= 11;
				config.cm.config.group.visible = this.userGuide.currentStep >= 11;

				config.soc.config.group.visible = this.userGuide.currentStep >= 12;

				config.br.config.group.visible = this.userGuide.currentStep >= 13;
				config.ct.config.group.visible = this.userGuide.currentStep >= 13;

				config.be.config.group.visible = this.userGuide.currentStep >= 14;

				config.v.config.group.visible = this.userGuide.currentStep >= 15;

			}

			// Note: <CosmosStakeholder> handles its own visibility when group.visible isn't present (based on model's label' value)

			return config;
		},


	},

	methods: {

		getRandomColour() {
			const len = filteredColours.length;
			const idx = Math.floor(Math.random() * len);
			return filteredColours[idx].value;
		}
	},

	mounted() {

		var ugData = this.userGuide.project.data[this.aspectId];

		var items = filter(this.definitions, (def) => def.type === 'stakeholder');

		forEach(items, (def) => {

			ugData[def.id] = {
				label: def.title,
				type: 'user',
				colour: this.getRandomColour(),
			};

		});

		return;
	}

}
</script>
