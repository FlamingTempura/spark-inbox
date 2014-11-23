/* jshint node: true */
'use strict';

var spark = require('spark'),
	_ = require('lodash'),
	BBPromise = require('bluebird'),
	Backbone = require('backbone'),
	config = require('./config.json'),
	Imap = require('imap');

// inbox monitor
// visualises number of unread emails

var Inbox = Backbone.Model.extend({
	initialize: function () {
		var that = this;
		this.imap = new Imap(_.extend(config, {
			host: 'imap.gmail.com',
			port: 993,
			tls: true
		}));
		this.imap.on('ready', function () {
			console.log('ready');
			setInterval(function () { that.checkInbox(); }, 5000);
		});
		this.imap.connect();
	},
	checkInbox: function () {
		var that = this;
		//this.set({ unread: Math.floor(Math.random() * this.get('unreadMax')) });
		that.imap.openBox('INBOX', true, function (err, box) {
			if (err) { throw err; }
			console.log('BOX', box);
			that.set({ unread: box.messages.total });
		});
	}
});

var Device = Backbone.Model.extend({
	connect: function () {
		var that = this;
		return new BBPromise(function (resolve, reject) {
			spark.login({
				accessToken: that.get('accessToken')
			}).then(function () {
				console.log('Login successful');
				spark.listDevices().then(function (devices) {
					var device = _.findWhere(devices, { name: that.get('deviceName') });
					if (device) {
						console.log('Connected to ' + that.get('deviceName'));
						that.dev = device;
						resolve();
					} else {
						console.log('Could to find ' + that.get('deviceName'));
						reject();
					}
				});
			}, function (err) {
				console.error('Failed to login', err);
				reject();
			});
		});
	},
	command: function (name, params) {
		console.log('command', name, params);
		return this.dev.callFunction(name, params, function (err, data) {
			if (err) {
				console.log('An error occurred:', err);
			} else {
				console.log('Function called succesfully:', data);
			}
		});	
	},
	setProgress: function (value, max) {
		console.log('setProgress', value, max);
		return this.command('setProgress', Math.ceil((value / max) * 11));
	}
});

var inbox = new Inbox({
	unreadMax: 11
});

var device = new Device(config);

device.connect().then(function () {
	inbox.on('change:unread', function () {
		device.setProgress(inbox.get('unread'), inbox.get('unreadMax'));
	});
});
