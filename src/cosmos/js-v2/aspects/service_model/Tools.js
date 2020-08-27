import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import filter from 'lodash/filter';
import pick from 'lodash/pick';
import map from 'lodash/map';

export default {

	populateProject(initialProject, definitions) {

		var project = cloneDeep(initialProject),
			def,
			items,
			newObj,
			keepKeys = [];

		// console.log(project);

		for (var i = 0; i < definitions.length; i++) {

			def = definitions[i];
			keepKeys.push(def.id);

			var currentValue = JSON.stringify(project.data[def.id]);
			var blank = JSON.stringify({});

			switch (def.type) {

				case 'externals':

					// Legacy: convert array format for external items into object
					if (isArray(project.data[def.id])) {
						items = [...project.data[def.id]];
						newObj = {
							label: null,
							items: items
						}
						project.data[def.id] = newObj;
					}

					// Ensure empty values have a proper object structure
					if (currentValue == blank) {
						project.data[def.id] = Object.assign({
							label: null,
							items: []
						});
					}

				break;

				case 'social':

					// Ensure object structure exists
					if (currentValue == blank) {
						project.data[def.id] = Object.assign({
							twitter: [],
							facebook: [],
							instagram: [],
							youtube: [],
						});
					}

				break;

			}

			switch (def.id) {

				case 'drivers':
					if (typeof(project.data[def.id]) != 'object' || Object.keys(project.data[def.id]).length === 0) {
						newObj = {
							title: project.data.goals ? project.data.goals.label : '',
							body: project.data.goals ? project.data.goals.body : '',
						};
						project.data[def.id] = newObj;
					}
				break;

				// Legacy: convert 'title' into the "Model" object
				case 'model':
					if (typeof(project.data[def.id]) != 'object' || Object.keys(project.data[def.id]).length === 0) {
						newObj = {
							title: project.data.title ? project.data.title : null,
						};
						project.data[def.id] = newObj
					}
				break;

				case 'extsvc':
					if (isArray(project.data.services)) {
						items = [...filter(project.data.services, item => item.type == 'extsvc')];
						project.data[def.id].items = items;
						project.data[def.id].label = project.data.extSvcLabel ? project.data.extSvcLabel : null;
					}
				break;

				case 'extorg':
					if (isArray(project.data.services)) {
						items = [...filter(project.data.services, item => item.type == 'extorg')];
						project.data[def.id].items = items;
						project.data[def.id].label = project.data.extOrgLabel ? project.data.extOrgLabel : null;
					}
				break;

				case 'infsvc':
					if (isArray(project.data.services)) {
						items = [...filter(project.data.services, item => item.type == 'infsvc')];
						project.data[def.id].items = items;
						project.data[def.id].label = project.data.infSvcLabel ? project.data.infSvcLabel : null;
					}
				break;

				case 'social':
					if (isArray(project.data.social)) {
						items = [...project.data.social];
						newObj = {
							twitter: filter(items, item => item.network == 'twitter'),
							facebook: filter(items, item => item.network == 'facebook'),
							instagram: filter(items, item => item.network == 'instagram'),
							youtube: filter(items, item => item.network == 'youtube'),
						};
						newObj.twitter = map(newObj.twitter, item => item.value);
						newObj.facebook = map(newObj.facebook, item => item.value);
						newObj.instagram = map(newObj.instagram, item => item.value);
						newObj.youtube = map(newObj.youtube, item => item.value);
						project.data[def.id] = newObj;
					}
				break;
			}

		}

		project.data = pick(project.data, keepKeys);

		// console.log(cloneDeep(project));

		return project;
	}

}
