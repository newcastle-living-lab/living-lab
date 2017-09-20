var path = require('path');

module.exports = {
	entry: './app/present.js',
	output: {
		filename: 'present.js',
		path: path.resolve(__dirname, 'build')
	},
	module: {
		rules: [
			{ test: /\.html$/, loader: "underscore-template-loader" }
		]
	},
};