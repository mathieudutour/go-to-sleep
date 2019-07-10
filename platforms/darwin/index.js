const applescript = require("./applescript");

module.exports.APPS = {
  itunes: "iTunes",
  spotify: "Spotify",
  music: "Music" // replaces iTunes on macOS 10.15
};

module.exports.defaultApplication = module.exports.APPS.itunes;

module.exports.getVolume = function getVolume(callback) {
  applescript("get output volume of (get volume settings)", callback);
};

module.exports.goToSleep = function goToSleep(argv, callback) {
  applescript(
    `
tell application "${argv.application}"
  play ${argv.playlist}
end tell

set i to ${argv.volumeAtTheBeginning}
set loopDelay to (${argv.minutes} * 60 / ${argv.volumeAtTheBeginning})

repeat while i > 0
  set volume output volume i
  delay loopDelay
  set i to i - 1
end repeat

tell application "${argv.application}"
  pause
end tell

tell application "Finder"
  sleep
end tell
`,
    callback
  );
};
