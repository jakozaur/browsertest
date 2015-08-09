var certPath = Meteor.settings.docker.certPath;
var fs = Npm.require('fs');

docker = new Docker({
  protocol: Meteor.settings.docker.protocol,
  host: Meteor.settings.docker.host,
  port: Meteor.settings.docker.port,
  ca: fs.readFileSync(certPath + 'ca.pem'),
  cert: fs.readFileSync(certPath + 'cert.pem'),
  key: fs.readFileSync(certPath + 'key.pem')
});

var writeFile = function (containerId, filePath, fileContent) {
  var container = docker.getContainer(containerId);

  var execCmd = Meteor.wrapAsync(container.exec, container)({
    AttachStdin: true,
    Tty: false,
    Cmd: ['su', '-', 'tests', '-c', 'cat > ' + filePath]
  });

  var stream = Meteor.wrapAsync(execCmd.start, execCmd)({
    stdin: true
  });
  stream.write(fileContent);
  stream.end();
};

var readFile = function (containerId, filePath) {
  // TODO: Handle non-existing files!
  var container = docker.getContainer(containerId);

  var execCmd = Meteor.wrapAsync(container.exec, container)({
    AttachStdout: true,
    Tty: false,
    Cmd: ['su', '-', 'tests', '-c', 'cat ' + filePath]
  });

  return Meteor.wrapAsync(function (callback) {
    var result = [];
    var stream = Meteor.wrapAsync(execCmd.start, execCmd)();

    // Docker mixes stdout and stderr:
    // https://docs.docker.com/reference/api/docker_remote_api_v1.14/#attach-to-a-container
    var header = null;
    stream.on('readable', Meteor.bindEnvironment(function() {
      header = header || stream.read(8);
      while (header !== null) {
        var type = header.readUInt8(0);
        var payload = stream.read(header.readUInt32BE(4));
        if (payload === null) break;
        if (type == 1) {
          result.push(payload);
        }
        header = stream.read(8);
      }
    }));

    stream.on('end', Meteor.bindEnvironment(function () {
      callback(null, Buffer.concat(result));
    }));
  })();
};

var execCommand = function (containerId, cmd, options) {
  options = options || {};
  var runId = options.runId;
  var callback = options.callback;

  var container = docker.getContainer(containerId);

  var execCmd = Meteor.wrapAsync(container.exec, container)({
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    Cmd: cmd
  });

  var stream = Meteor.wrapAsync(execCmd.start, execCmd)();
  if (runId) {
    // Docker mixes stdout and stderr:
    // https://docs.docker.com/reference/api/docker_remote_api_v1.14/#attach-to-a-container
    var header = null;
    stream.on('readable', Meteor.bindEnvironment(function () {
      header = header || stream.read(8);
      while (header !== null) {
        var type = header.readUInt8(0);
        var payload = stream.read(header.readUInt32BE(4));
        if (payload === null) break;
        Run.update(runId, {$push: {logs: payload.toString('utf-8')}});
        header = stream.read(8);
      }
    }));
  } else {
    stream.pipe(process.stdout);
  }

  if (callback) {
    stream.on('end', Meteor.bindEnvironment(callback));
  }
}

exampleExec = function () {
  var containers = Meteor.wrapAsync(docker.listContainers, docker)();
  console.log("Running containers", containers);
  if (containers.length == 0) {
    console.log("ERROR: need one container");
    return;
  }

  writeFile(containers[0].Id, 'meteor-g', "Hello Docker!");
};

var findScreenshots = function (code) {
  var screenshotRegex = new RegExp("\\.saveScreenshot\\('(.+?\\.png)'\\)", 'g');
  var matchResult;
  var result = [];
  while ((matchResult = screenshotRegex.exec(code)) !== null) {
    result.push(matchResult[1]);
  }
  return result;
}

Meteor.methods({
  runCode: function (code) {
    console.log("runCode", code);
    var runId = Run.insert({
      userId: Meteor.userId(),
      code: code,
      logs: []
    });

    var containers = Meteor.wrapAsync(docker.listContainers, docker)();
    console.log("Running containers", containers);
    if (containers.length == 0) {
      console.log("ERROR: need one container");
      return;
    }
    var containerId = containers[0].Id;

    var screenshots = findScreenshots(code);

    console.log("Make sure previous Chrome is closed");
    execCommand(containerId, ['killall', 'chrome', 'chromedriver', 'cat']);
    console.log("Creating dir");
    execCommand(containerId, ['su', '-', 'tests', '-c', 'mkdir -p /home/tests/examples/tests']);
    console.log("Writing test");
    writeFile(containerId, '/home/tests/examples/tests/test.js', code);
    console.log("Running test");
    execCommand(containerId, ['su', '-', 'tests', '-c', 'cd /home/tests; nightwatch .'], {
      runId: runId,
      callback: function () {
        _.each(screenshots, function (imageName) {
          console.log("Saving screenshot: " + imageName);
          var buffer = readFile(containerId, imageName);
          console.log(imageName + " buffer.length: " + buffer.length);
          var newFile = new FS.File();
          newFile.name(imageName);
          newFile.attachData(buffer, {type: 'image/png'});
          console.log("Data attached " + imageName);
          var image = Images.insert(newFile);
          console.log("Image inserted " + imageName);
          console.log(image);

          //Run.update(runId, {$push: {screenshots: {image: image, name: imageName}}});
          Run.update(runId, {$push: {screenshots: image._id}});


        });

        Run.update(runId, {$push: {logs: "Saving screenshots: " + screenshots}});
      }
    });
    console.log("DONE");

    return runId;
  },

  recordTest: function () {
    console.log("recordTest");

    var recordingId = Recording.insert({
      userId: Meteor.userId(),
      events: []
    });

    var containers = Meteor.wrapAsync(docker.listContainers, docker)();
    console.log("Running containers", containers);
    if (containers.length == 0) {
      console.log("ERROR: need one container");
      return;
    }
    var containerId = containers[0].Id;


    console.log("recordTest Make sure previous Chrome is closed");
    execCommand(containerId, ['killall', 'chrome', 'chromedriver', 'cat']);

    console.log("recordTest Copying chrome extension");
    execCommand(containerId, ['su', '-', 'tests', '-c',
      'mkdir -p /home/tests/record/extension']);
    _.each(['background.js', 'foreground.js', 'manifest.json'], function (el) {
      writeFile(containerId, '/home/tests/record/extension/' + el,
        Assets.getText('chrome-extension/' + el));
    });

    console.log("recordTest Copying chrome settings");
    var settings = "Settings = " + JSON.stringify({
      meteorUrl: Meteor.settings.meteor.localUrl,
      testId: recordingId
    }) + ";";
    writeFile(containerId, '/home/tests/record/extension/settings.js',
      settings);


    console.log("recordTest Starting Chrome");
    execCommand(containerId, ['su', '-', 'tests', '-c',
      'DISPLAY=:123 google-chrome --window-position=0,0 --window-size=1366,768 ' +
      '--no-first-run --no-default-browser-check --disable-infobars ' +
      '--disable-manager-for-sync-signin ' +
      '--disable-gpu ' +
      '--load-extension=/home/tests/record/extension ""']);
    execCommand(containerId, ['su', '-', 'tests', '-c',
      'sleep 1; DISPLAY=:123 xdotool search --onlyvisible --class chrome windowfocus']);
    console.log("recordTest DONE");

    return recordingId;
  },

  stopBrowser: function () {
    var containers = Meteor.wrapAsync(docker.listContainers, docker)();
    console.log("Running containers", containers);
    if (containers.length == 0) {
      console.log("ERROR: need one container");
      return;
    }
    var containerId = containers[0].Id;

    console.log("stopChrome Close Chrome");
    execCommand(containerId, ['killall', 'chrome', 'chromedriver', 'cat']);
  }
})
