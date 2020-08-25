import find from 'lodash/find';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import cloneDeep from 'lodash/cloneDeep';

import Welcome from './welcome';
import ServiceModel from './service_model';
import AnalyticModel from './analytic_model';
import InterventionTheoryModel from './intervention_theory_model';
import ChangeModel from './change_model';
import MoralOrderingModel from './moral_ordering_model';
import TheoryOfChange from './theory_of_change';
import CommunityReporting from './community_reporting';
import SocialMedia from './social_media';
import Documents from './documents';

const allAspects = [
	Welcome,
	ServiceModel,
	AnalyticModel,
	InterventionTheoryModel,
	ChangeModel,
	MoralOrderingModel,
	TheoryOfChange,
	CommunityReporting,
	SocialMedia,
	Documents,
];


export default {

	all() {
		return map(allAspects, (t) => t.CONFIG);
	},

	get(id) {
		return find(allAspects, (t) => t.CONFIG.id === id);
	},

	getBlankItem(id) {
		var aspect = this.get(id);
		var data = {};
		return setObjectKeys(data, aspect.DEFINITIONS);
	},

	// Populate the project data with empty objects for each aspect.
	// Helps with reactivity if objects/keys exist first.
	populateProject(project) {

		var aspectConfig = {};
		forEach(allAspects, (aspect) => {
			aspectConfig = aspect.CONFIG;
			// Ensure all aspects have a key within `data`
			if (typeof(project.data[aspectConfig.id]) === 'undefined') {
				project.data[aspectConfig.id] = {};
			}
			// ensure all aspect definitions have a key
			if (typeof(aspect.DEFINITIONS) !== 'undefined') {
				console.debug(`Setting object keys for ${aspect.CONFIG.id}...`);
				project.data[aspectConfig.id] = setObjectKeys(project.data[aspectConfig.id], aspect.DEFINITIONS);
			}
		});

		project = this.convertFromTemplate(project);

		console.log(JSON.parse(JSON.stringify(project)));

		return project;
	},

	convertFromTemplate(project) {

		// Skip projects without templates
		if ( ! project.template || project.template.length == 0) {
			return project;
		}

		if (project.template === 'service-model') {

			// Special treatment of service_model due to extracting some definitions.
			//

			var newId = 'co_creation_of_service_model';

			// Move the "main" definitions that remain with this aspect into the new object.
			//

			var serviceDefinitions = [
				'model',
				'drivers',
				'policyDef',
				'specDes',
				'deployment',
				'delivery',
				'evaluation',
				'user',
				'beneficiary',
				'initiator',
				'extsvc',
				'extorg',
				'infsvc',
			];

			forEach(serviceDefinitions, (definition) => {
				if (typeof(project.data[definition]) !== 'undefined') {
					project.data[newId][definition] = cloneDeep(project.data[definition]);
					delete project.data[definition];
				}
			});

			// Move the other definitions that have their own aspects into the respective objects.
			//

			var otherDefinitions = [
				{'source': 'theoryOfChange', 'destination': 'theory_of_change'},
				{'source': 'communityReporting', 'destination': 'community_reporting'},
				{'source': 'social', 'destination': 'social_media'},
				{'source': 'livingLabModels', 'destination': 'documents'},
			];

			forEach(otherDefinitions, (definition) => {
				if (typeof(project.data[definition.source]) !== 'undefined') {
					project.data[definition.destination] = { 'data': cloneDeep(project.data[definition.source]) };
					delete project.data[definition.source];
					console.debug(`Moving data.${definition.source} --> data.${definition.destination}`);
				}
			});

		}

		if (project.template && project.template.length > 0 && project.template != 'service-model') {

			// Just move the old definitions to the new relevant property.

			const lookup = {
				'analytic-model': 'analytic_model',
				'intervention-theory': 'intervention_theory_model',
				'moral-ordering': 'moral_ordering_model',
				'theory-of-change': 'change_model',
			};

			const newProp = lookup[project.template];
			const aspect = this.get(newProp);
			const definitions = aspect.DEFINITIONS;
			var definitionId;
			forEach(definitions, (definition) => {
				definitionId = definition.id;
				if (typeof(project.data[definitionId]) !== 'undefined') {
					project.data[newProp][definitionId] = cloneDeep(project.data[definitionId]);
					console.debug(`Moving data.${definitionId} --> data.${newProp}.${definitionId}`);
					delete project.data[definitionId];
				}
			});

		}

		delete project.template;
		return project;
	},

	Components: {
		install(Vue) {
			for (let aspect in allAspects) {
				if ( ! allAspects[aspect].Components) {
					continue;
				}
				for (let key in allAspects[aspect].Components) {
					const component = allAspects[aspect].Components[key];
					console.debug(`Registering component ${component.name} from aspect ${allAspects[aspect].CONFIG.id}.`);
					Vue.component(component.name, component);
				}
			}
		}
	}

}



function setObjectKeys(onObject, fromArray) {
	forEach(fromArray, (item) => {
		if (item.id && typeof(onObject[item.id]) === 'undefined') {
			switch (item.dataType) {
				case "string":
					onObject[item.id] = "";
				break;
				case "array":
					onObject[item.id] = [];
				break;
				case "object":
				default:
					item.dataType = 'object';
					onObject[item.id] = {};
				break;
			}

			switch (item.type) {
				case 'externals':
					onObject[item.id] = {
						label: '',
						items: [],
					};
				break;
				case 'stakeholder':
					onObject[item.id] = {
						label: null,
						type: null,
						colour: null,
						url: null,
					};
				break;
			}
			console.debug(`setObjectKeys(): ${item.id}: Set to ${item.dataType}.`);
		}
		if (Array.isArray(item.children)) {
			console.debug(`setObjectKeys(): ${item.id}: Processing children!`);
			onObject[item.id] = setObjectKeys(onObject[item.id], item.children);
		}
	});
	return onObject;
}
