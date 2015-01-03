'use strict';

var	hcPassword = require('../hc/hcpassword.js'),


(function(module) {
	var fork = require('child_process').fork;

	module.hash = function(rounds, password, callback) {
		password = hcPassword.encode(password);
		forkChild({type: 'hash', rounds: rounds, password: password}, callback);
	};

	module.compare = function(password, hash, callback) {
		password = hcPassword.encode(password);
		forkChild({type: 'compare', password: password, hash: hash}, callback);
	};

	function forkChild(message, callback) {
		var child = fork('./bcrypt', {
				silent: true
			});

		child.on('message', function(msg) {
			if (msg.err) {
				return callback(new Error(msg.err));
			}

			callback(null, msg.result);
		});

		child.send(message);
	}

	return module;
})(exports);