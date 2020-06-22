import clone from 'lodash/clone';

export default {

	populate(project) {

		const defaultTypes = {
			'model': {
				'title': null,
			},
			'stakeholder': {
				'title': null,
				'type': null,
				'colour': null,
				'url': null,
			},
		};

		var objectsList = {
			'model': defaultTypes.model,
			'serviceDeliveryManager': defaultTypes.stakeholder,
			'serviceDeliveryManager': defaultTypes.stakeholder,
		};

		for (let key in objectsList) {
			if (typeof(project.data[key]) == 'undefined') {
				project.data[key] = {};
			}
		}

		return project;
	},


}
