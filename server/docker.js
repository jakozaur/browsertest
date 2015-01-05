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

var createFile = function (containerId, filePath, fileContent) {
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

var execCommand = function (containerId, cmd, runId) {
  var container = docker.getContainer(containerId);

  var execCmd = Meteor.wrapAsync(container.exec, container)({
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    Cmd: cmd
  });

  var stream = Meteor.wrapAsync(execCmd.start, execCmd)();
  if (runId) {
    stream.on('data', Meteor.bindEnvironment(function (msg) {
      Run.update(runId, {$push: {logs: msg.toString('utf-8')}});
    }));
  } else {
    stream.pipe(process.stdout);
  }
}

exampleExec = function () {
  var containers = Meteor.wrapAsync(docker.listContainers, docker)();
  console.log("Running containers", containers);
  if (containers.length == 0) {
    console.log("ERROR: need one container");
    return;
  }

  createFile(containers[0].Id, 'meteor-g', "Hello Docker!");
};

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

    console.log("Make sure previous Chrome is closed");
    execCommand(containerId, ['killall', 'chrome', 'chromedriver', 'cat']);
    console.log("Creating dir");
    execCommand(containerId, ['su', '-', 'tests', '-c', 'mkdir -p /home/tests/examples/tests']);
    console.log("Writing test");
    createFile(containerId, '/home/tests/examples/tests/test.js', code);
    console.log("Running test");
    execCommand(containerId, ['su', '-', 'tests', '-c', 'cd /home/tests; nightwatch .'], runId);
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
      createFile(containerId, '/home/tests/record/extension/' + el,
        Assets.getText('chrome-extension/' + el));
    });

    console.log("recordTest Copying chrome settings");
    var settings = "Settings = " + JSON.stringify({
      meteorUrl: Meteor.settings.meteor.localUrl,
      testId: recordingId
    }) + ";";
    createFile(containerId, '/home/tests/record/extension/settings.js',
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
