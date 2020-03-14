const { exec } = require("child_process");
const fs = require('fs');

let command = getDeployCommand();

exec(command, (error, stdout, stderr) => {
  if (error) {
      console.error('error:' + error.message);
      return;
  }
  if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
  }
  console.log(stdout);

  const matcher = /[\w-]{30,}/g;
  const result = stdout.match(matcher);

  if (result.length !== 1) {
    console.error('deploy.js could not find deploymentId in clasp output');
  }

  let [deploymentId] = result;
  console.log(`Saving deploymentId: ${deploymentId}`);
  console.log(`API available at: https://script.google.com/macros/s/${deploymentId}/exec`)
  writeDeploymentId(deploymentId);
});

function getDeployCommand() {
  let command = "clasp deploy";

  let deploymentId = readDeploymentId()
  if (deploymentId) {
    command += ' --deploymentId ' + deploymentId;
  }
  return command;
}

function readDeploymentId() {
  const filename = getDeploymentIdFilename();
  return fs.existsSync(filename) ? 
    fs.readFileSync(filename, 'utf8'):
    undefined;
}

function writeDeploymentId(deploymentId) {
  fs.writeFileSync(getDeploymentIdFilename(), deploymentId);
}

function getDeploymentIdFilename() {
  return './.deploymentId';
}