#!/usr/bin/env node

var spawn = require('child_process').spawn;
var join = require('path').join;

var sleep = join(__dirname, 'sleep.scpt');

var program = require('commander');

program
  .version(require('./package.json').version)
  .option('-m, --minutes [number]', 'How long before you\'d like to go to sleep?', parseInt)
  .option('-p, --playlist [playlistName]', 'Name of the playlist');

program.on('--help', function() {
  console.log('  Example:');
  console.log('');
  console.log('    $ go-to-sleep --minutes=30 --playlist=Sleep');
  console.log('');
});

program.parse(process.argv);

return spawn('osascript', [sleep, program.minutes || 30, program.playlist || 'Sleep'], {
	cwd: process.cwd()
});
