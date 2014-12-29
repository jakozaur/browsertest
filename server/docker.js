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
    Cmd: ['bash', '-c', 'cat > ' + filePath]
  });

  var stream = Meteor.wrapAsync(execCmd.start, execCmd)({
    stdin: true
  });
  stream.write(fileContent);
  stream.end();
};

var execCommand = function (containerId, cmd) {
  var container = docker.getContainer(containerId);

  var execCmd = Meteor.wrapAsync(container.exec, container)({
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    Cmd: cmd
  });

  var stream = Meteor.wrapAsync(execCmd.start, execCmd)();
  stream.pipe(process.stdout);
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

    var containers = Meteor.wrapAsync(docker.listContainers, docker)();
    console.log("Running containers", containers);
    if (containers.length == 0) {
      console.log("ERROR: need one container");
      return;
    }
    var containerId = containers[0].Id;

    console.log("Creating dir");
    execCommand(containerId, ['mkdir', '-p', '/home/tests/examples/tests']);
    console.log("Writing test");
    createFile(containerId, '/home/tests/examples/tests/test.js', code);
    console.log("Running test");
    execCommand(containerId, ['bash', '-c', 'cd /home/tests; nightwatch .']);
    console.log("DONE");
  }
})