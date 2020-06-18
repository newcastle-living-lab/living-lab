import Vue from 'vue';

import templates from '@/data/templates.json';
import find from 'lodash/find';
import indexOf from 'lodash/indexOf';

export default {

	// Determine if a given template has a certain feature
	hasFeature(templateName, featureName) {
		var tpl = find(templates, { name: templateName });
		if ( ! tpl) {
			return false;
		}

		return (indexOf(tpl.features, featureName) >= 0);
	}

}
