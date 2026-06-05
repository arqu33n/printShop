const path = require('path');

module.exports = {
	resolve: {
		alias: {
			'@css': path.resolve(__dirname, 'src/css'),
			'@application': path.resolve(__dirname, 'src/application'),
			'@layout': path.resolve(__dirname, 'src/layout'),
			'@component': path.resolve(__dirname, 'src/component'),
			'@const': path.resolve(__dirname, 'src/const'),
			'@lib': path.resolve(__dirname, 'src/lib'),
			'@model': path.resolve(__dirname, 'src/model'),
			'@provider': path.resolve(__dirname, 'src/provider'),
			'@service': path.resolve(__dirname, 'src/provider/service'),
			'@pull': path.resolve(__dirname, 'src/provider/pull'),
		},
	},
};