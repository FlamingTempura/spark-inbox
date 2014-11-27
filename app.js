// spark-inbox
//
// Visualises the number of emails in your inbox
// https://github.com/FlamingTempura/spark-inbox
// Written by Peter West 

/* jshint node: true */
'use strict';

var config = require('./config.json'),
	_ = require('lodash'),
	clc = require('colors'),
	Backbone = require('backbone'),
	Imap = require('imap'),
	sp = require('spark');

var DEBUG = process.argv.indexOf('--debug') > -1;

var error = function (num, msg, err) {
	console.error(clc.bold.bgRed('error'), msg, '(code ' + num + ')');
	console.error(DEBUG ? err : 'Use --debug for debugging output.');
	process.exit(1);
};

var Spark = Backbone.Model.extend({
	connect: function (callback) {
		this.log('logging in...');
		sp.login({
			accessToken: this.get('accessToken')
		}).then(function () {
			var name = this.get('deviceName');
			this.log('logged in. finding spark named ' + name + '...');
			sp.listDevices().then(function (devices) {
				this.device = _.findWhere(devices, { name: name });
				if (!this.device) { error('s2', 'no spark named ' + name); }
				this.log('connected to ' + name);
				callback();
			}.bind(this), function (err) {
				error('s4', 'failed to get a list of devices', err);
			});
		}.bind(this), function (err) {
			error('s1', 'failed to login to spark', err);
		});
	},
	command: function (name, params) {
		this.log('running command ' + name + '(' + params + ')...');
		return this.device.callFunction(name, params, function (err) {
			if (err) { error('s3', 'could not run command', err); }
			this.log('function called successfully');
		}.bind(this));	
	},
	setLEDs: function (value, max) {
		this.log('setting lights ' + value + '/' + max + '...');
		return this.command('setLEDs', Math.ceil((value / max) * 11));
	},
	log: function (msg) {
		console.log(clc.cyan('spark'), msg);
	}
});

var Inbox = Backbone.Model.extend({
	connect: function () {
		this.log('connecting...');
		this.imap = new Imap(config);
		this.imap.on('ready', function () {
			this.log('connected');
			this.checkInbox();
		}.bind(this)).on('error', function (err) {
			error('i1', 'inbox log in failed', err);
		}).connect();
		return this;
	},
	checkInbox: function () {
		this.log('checking inbox...');
		this.imap.openBox('INBOX', true, function (err, box) {
			if (err) { error('i2', 'could not retrieve inbox', err); }
			this.log('counted ' + box.messages.total + ' emails');
			this.set({ emailCount: box.messages.total });
			setTimeout(function () {
				this.checkInbox();
			}.bind(this), config.checkEvery * 1000);
			this.log('checking again in ' + config.checkEvery + ' seconds');
		}.bind(this));
	},
	log: function (msg) {
		console.log(clc.green('inbox'), msg);
	}
});

var spark = new Spark(config),
	inbox = new Inbox(config);

console.log('spark-inbox v0.1.');

spark.connect(function () {
	inbox.connect().on('change:emailCount', function () {
		spark.setLEDs(inbox.get('emailCount'), inbox.get('emailCountMax'));
	});
});
