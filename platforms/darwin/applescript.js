const { spawn } = require("child_process");

// Path to 'osascript'. By default search PATH.
const osascript = "osascript";

function bufferBody(stream) {
  stream.body = "";
  stream.setEncoding("utf8");
  stream.on("data", chunk => {
    stream.body += chunk;
  });
}

// Execute a String as AppleScript.
module.exports = function execAppleScript(str, callback) {
  const interpreter = spawn(osascript, ["-e", str]);

  bufferBody(interpreter.stdout);
  bufferBody(interpreter.stderr);

  interpreter.on("exit", code => {
    let err = null;
    if (code) {
      // If the exit code was something other than 0, we're gonna
      // return an Error object.
      err = new Error(interpreter.stderr.body);
      err.appleScript = str;
      err.exitCode = code;
    }
    callback(err, interpreter.stdout.body);
  });
};
