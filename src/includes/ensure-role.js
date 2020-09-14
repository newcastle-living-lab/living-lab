/**
 * Ensure that a user has the required "role" membership before proceeding to next route middleware.
 *
 * This middleware ensures that a user has the correct role.  If a request is received
 * where the user does NOT the specified role, an error page will be displayed with the
 * provided message, along with a 403 HTTP status.
 *
 * Options:
 *   - `message`   The error message to display to the user when they don't have
 *   	the required role.
 *
 * Examples:
 *
 *     app.get('/profile',
 *       ensureRole("user"),
 *       function(req, res) { ... });
 *
 *     app.get('/profile',
 *       ensureRole({ role: "user", "message": "You need to log in to edit your profile"}),
 *       function(req, res) { ... });
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */
module.exports = function ensureRole(options) {
	if (typeof options == 'string') {
		options = { role: options }
	}
	options = options || {};

	var message = options.message || "Not authorised to view this page.";
	var roleName = options.role || null;

	return function(req, res, next) {

		var hasRoles = (req.user && req.user.roles && req.user.roles.length > 0);
		var hasMatchingRole = (hasRoles && req.user.roles.indexOf(roleName) !== -1);

		if ( ! hasRoles || ! hasMatchingRole) {

			res.status(403);

			if (req.accepts('json')) {
				return res.send({
					'success': false,
					'reason': message,
				});
			} else {
				return res.render('_error.html', { message: message });
			}
		}

		next();
	}
}
