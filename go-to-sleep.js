#!/usr/bin/env node

const path = require("path");
const os = require("os");
const fs = require("fs");
const program = require("commander");
const packageJSON = require("./package.json");

let getVolume;
let goToSleep;
let APPS;
let defaultApplication;

try {
  const platformImplementation = require(`./platforms/${process.platform}`);
  getVolume = platformImplementation.getVolume;
  goToSleep = platformImplementation.goToSleep;
  APPS = platformImplementation.APPS;
  defaultApplication = platformImplementation.defaultApplication;
} catch (err) {
  console.error(
    `Very sorry but ${
      packageJSON.name
    } does not work on your platform for the moment.`
  );
  console.error(
    `If you would like to implement it, feel free to head over ${
      packageJSON.repository
    } and send a PR :)`
  );
  process.exit(1);
}

function getArgumentsWithDefaults(argv, callback) {
  const dotFilePath = path.join(os.homedir(), ".go-to-sleep");

  const result = {
    application: defaultApplication,
    minutes: 30,
    playlist: "Sleep",
    dry: false
  };

  if (fs.existsSync(dotFilePath)) {
    const dotFile = require("toml").parse(fs.readFileSync(dotFilePath));

    if (dotFile.application) {
      result.application = APPS[dotFile.application.toLowerCase()];
    }
    if (dotFile.minutes) {
      result.minutes = dotFile.minutes;
    }
    if (dotFile.playlist) {
      result.playlist = dotFile.playlist;
    }
    if (dotFile.volumeAtTheBeginning) {
      result.volumeAtTheBeginning = dotFile.volumeAtTheBeginning;
    }
  }

  if (argv.application) {
    result.application = APPS[argv.application.toLowerCase()];
  }
  if (argv.minutes) {
    result.minutes = argv.minutes;
  }
  if (argv.playlistName) {
    result.playlist = argv.playlistName;
  }
  if (argv.volumeAtTheBeginning) {
    result.volumeAtTheBeginning = argv.volumeAtTheBeginning;
  }
  if (argv.dry) {
    result.dry = argv.dry;
  }

  if (!result.application) {
    callback(new Error("Unknown player application"));
    return;
  }

  if (result.application === APPS.itunes) {
    result.playlist = `the playlist named "${result.playlist}"`;
  } else if (result.application === APPS.spotify) {
    result.playlist = `track "${
      result.playlist.indexOf("spotify:") === 0
        ? result.playlist
        : `spotify:playlist:${result.playlist}`
    }"`;
  }

  if (result.volumeAtTheBeginning) {
    callback(null, result);
    return;
  }

  getVolume((err, volumeAtTheBeginning) => {
    if (err) {
      callback(err);
      return;
    }

    result.volumeAtTheBeginning = parseInt(volumeAtTheBeginning);

    if (!result.volumeAtTheBeginning) {
      callback(
        new Error(
          `Set your volume to something audible 😁 ${
            packageJSON.name
          } will then slowly tune down the volume so you can peacefully go to sleep 😴`
        )
      );
      return;
    }

    callback(null, result);
  });
}

program
  .version(packageJSON.version)
  .name(`npx ${packageJSON.name}`)
  .description(packageJSON.description)
  .option(
    "-a, --application [application]",
    "name of the music player. Only iTunes, Music (on macOS 10.15), and Spotify are supported for the moment."
  )
  .option(
    "-m, --minutes [number]",
    "how long before you'd like to sleep?",
    parseInt
  )
  .option(
    "-p, --playlist [playlistName]",
    "name (or Spotify URI) of the playlist"
  )
  .option(
    "-d, --dry",
    "print what it is going to do but do not run the script"
  );

program.on("--help", () => {
  console.log("");
  console.log("Examples:");
  console.log("");
  console.log(`$ npx ${packageJSON.name} --minutes=30 --playlist=Sleep`);
  console.log(
    `$ npx ${
      packageJSON.name
    } --application=Spotify --playlist=spotify:playlist:5aPHtZ3JXijkkCqYm6QoR1`
  );
  console.log("");
  console.log(`For more information, head over ${packageJSON.repository}.`);
  console.log("");
});

program.parse(process.argv);

getArgumentsWithDefaults(program, (err, argv) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Have a good night 😴");
  console.log("");
  console.log(
    "PS: you can stop the script at any moment by pressing `control + C`"
  );

  if (argv.dry) {
    // useful for debugging options
    console.log(`
tell application "${argv.application}" to play ${argv.playlist}
repeat ${
      argv.volumeAtTheBeginning
    } times to lower the volume by 1 with ${(argv.minutes * 60) /
      argv.volumeAtTheBeginning}s in between
and then stop the application and put the computer to sleep
`);
    process.exit(0);
  }

  goToSleep(argv, err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
