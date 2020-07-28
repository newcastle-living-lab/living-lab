import find from 'lodash/find';
import map from 'lodash/map';
import forEach from 'lodash/forEach';

import AnalyticModel from './analytic-model';
import ServiceModel from './service-model';
import MoralOrdering from './moral-ordering';

const allTemplates = [
	AnalyticModel,
	ServiceModel,
	MoralOrdering,
];


export default {

	all() {
		return map(allTemplates, (t) => t.CONFIG);
	},

	get(name) {
		return find(allTemplates, (t) => t.CONFIG.name === name);
	},

	// Populate the project data with empty objects for each definition.
	// Helps with reactivity.
	populateProject(project) {
		var tpl = this.get(project.template);
		if ( ! tpl) {
			return project;
		}

		project.data = setObjectKeys(project.data, tpl.DEFINITIONS);

		if (typeof(tpl.Tools) == 'object') {
			if (typeof(tpl.Tools.populateProject) == 'function') {
				project = tpl.Tools.populateProject(project, tpl.DEFINITIONS);
			}
		}

		return project;
	},

	Components: {
		install(Vue) {
			for (let tpl in allTemplates) {
				if ( ! allTemplates[tpl].Components) {
					continue;
				}
				for (let key in allTemplates[tpl].Components) {
					const component = allTemplates[tpl].Components[key];
					console.log("Registering component " + component.name);
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
					onObject[item.id] = {};
				break;
			}
		}
		if (Array.isArray(item.children)) {
			setObjectKeys(onObject[item.id], item.children);
		}
	});
	return onObject;
}
