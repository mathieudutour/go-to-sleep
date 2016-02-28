#!/usr/bin/env node

var spawn = require('child_process').spawn;
var join = require('path').join;

var sleep = join(__dirname, 'sleep.scpt');

return spawn('osascript', [sleep], {
	cwd: process.cwd()
});
