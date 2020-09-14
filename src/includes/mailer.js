const nodemailer = require("nodemailer");
const nunjucks = require("nunjucks");

var settings = require("./settings");

var Mailer = function() {}


Mailer.prototype.init = function() {
}


Mailer.prototype.send = function(mailParams) {

	return this.loadSettings()
		.then((settings) => ({ settings, transport: null }))
		.then(this.getTransport)
		.then((params) => {

			// console.log(params.settings);

			const fromStr = `"${params.settings['smtp.from_name']}" <${params.settings['smtp.from_email']}>`;

			const html = nunjucks.render(`mail/${mailParams.template}.html`, mailParams.vars);

			return params.transport.sendMail({
				from: fromStr,
				to: mailParams.to,
				subject: mailParams.subject,
				// text: "Hello world?", // plain text body
				html: html,
			});

		})
		.catch((err) => {
			console.error("API: Mailer: send() " + err);
		});
}


Mailer.prototype.getTransport = function(params) {

	const settings = params.settings;

	return new Promise(function(resolve, reject) {

		var smtpConfig = {
			host: settings['smtp.host'],
			port: settings['smtp.port'],
			secure: settings['smtp.secure'],
		};

		if (settings['smtp.auth_user']) {
			smtpConfig.auth = {
				user: settings['smtp.auth_user'],
				pass: settings['smtp.auth_pass'],
			};
		}

		params.transport = nodemailer.createTransport(smtpConfig);

		resolve(params);

	});

}


Mailer.prototype.loadSettings = function() {

	var keys = [
		"smtp.host",
		"smtp.port",
		"smtp.secure",
		"smtp.auth_user",
		"smtp.auth_pass",
		"smtp.from_email",
		"smtp.from_name",
	];

	return new Promise((resolve, reject) => {
		resolve(settings.get(keys));
	});

}



module.exports = (new Mailer());
