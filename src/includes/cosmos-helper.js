/**
 * Living Lab server-side helper functions for CoSMoS
 *
 */

var slugify = require('slugify');

module.exports = {

	transformProject(dbRow) {

		if (dbRow.slug == undefined || dbRow.slug == null || (dbRow.slug && dbRow.slug.length === 0)) {
			dbRow.slug = slugify(dbRow.name && dbRow.name.length > 0 ? dbRow.name : '', {
				replacement: '-',
				lower: false,
				strict: true,
			});
		}

		if (dbRow.template == undefined || dbRow.template == null || (dbRow.template && dbRow.template.length === 0)) {
			dbRow.template = 'service-model';
		}

		if (typeof(dbRow.data) == 'undefined' || dbRow.data == null) {
			dbRow.data = {};
		} else {
			dbRow.data = JSON.parse(dbRow.data);
		}

		return dbRow;
	}

}
