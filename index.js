#!/usr/bin/env node

'use strict';

// Packages
const chalk = require('chalk');
const clear = require('clear');
const CLI = require('clui');
const figlet = require('figlet');
const git = require('simple-git')();
const fs = require('fs');
const download = require('download-git-repo');
const shell = require('shelljs');
const username = require('git-user-name');

// const _ = require('lodash');
// const touch = require('touch');

// Other packages
const Spinner = CLI.Spinner;

// Libs import
const files = require('./lib/files');
const questions = require('./lib/questions');

// Declaring global variables
let gitDetected;
let projectName;
let projectDirectory;

// Clear terminal
clear();

// @TODO : check git http not valid

// Init cli head
console.log(chalk.yellow(figlet.textSync('|| WASA-CLI ||', { horizontalLayout: 'full' })));
console.log(chalk.cyan('Welcome to the Wasa Builder. Let\'s initiliaze together your boilerplate !'));

// Update project (package.json, readme) with answers
const updateProject = () => {
  console.log(chalk.blue.bold('We are now making the final touches!'));
  const status = new Spinner(chalk.white('Please wait...'));
  status.start();
  setTimeout(() => {
    fs.readFile('package.json', 'utf-8', (err, data) => {
      if (err) throw err;

      const newValue = data
        .replace(/"name": "wasa-boilerplate"/g, `"name": "${projectName}"`)
        .replace(/"author": "Wait And See Agency"/g, `"author": "${username()}"`);

      fs.writeFile('package.json', newValue, 'utf-8', (error) => {
        if (error) {
          throw error;
        } else {
          status.stop();
          console.log('Project install complete, you\'re all set !');
        }
      });
    });
  }, 1000);
}

// Install dependencies
const initDependencies = () => {
  const current = process.cwd();
  try {
    process.chdir(`${current}/${projectDirectory}`);
  } catch (err) {
    console.log(`chdir: ${err}`);
  }
  console.log(chalk.blue.bold('We will now install the dependencies. This might take a moment, please wait.'));
  setTimeout(() => {
    if (shell.exec('npm install --silent').code !== 0) {
      shell.echo('Error: npm install failed :/ !');
      shell.exit(1);
    } else {
      console.log('Dependencies successfully installed.');
      updateProject();
    }
  })
}

// W&S Agency Boilerplate Download
const dlBoilerplate = () => {
  console.log(chalk.blue.bold('We will now download the WASA Boilerplate.'));
  setTimeout(() => {
    const status = new Spinner(chalk.white('Downloading boilerplate, please wait...'));
    status.start();
    download('waitandseeagency/wasa-boilerplate', `${projectDirectory}/`, (err) => {
      status.stop();
      if (err) {
        console.log(`${chalk.red('An internal error occured while downloading the boilerplate. Please contact us.')}`);
      } else {
        console.log('We successfully downloaded the WASA Boilerplate.');
        initDependencies();
      }
    });
  }, 1000)
}

// Ask git repository
const askGitRepo = () => {
  questions.gitRepo((...args) => {
    const gitRepo = args[0].gitRepo;
    // clone desired repository
    const status = new Spinner(chalk.white('Cloning repository, please wait...'));
    status.start();
    git.clone(gitRepo, projectDirectory).exec(() => {
      status.stop();
      console.log('Repository successfully cloned.');
      dlBoilerplate();
    });
  })
}

// Ask project git
const askProjectGit = () => {
  questions.projectGit((...args) => {
    if (args[0].projectGit === 1) {
      askGitRepo();
    } else {
      fs.mkdirSync(projectDirectory);
      dlBoilerplate();
    }
  })
}

// Ask project location
const askProjectDirectory = () => {
  questions.projectDirectory(projectName, (...args) => {
    if (args[0].projectDirectory.length === 0) {
      projectDirectory = projectName;
    } else {
      projectDirectory = args[0].projectDirectory.toLowerCase();
    }
    console.log(`You project will be installed in the directory ${chalk.blue.bold('./')}${chalk.blue.bold(projectDirectory)}`);
    if (gitDetected) {
      // if git detected skip add repo
      dlBoilerplate();
    } else {
      askProjectGit();
    }
  })
}

// Ask project name
const askProjectName = () => {
  questions.projectName((...args) => {
    projectName = args[0].projectName.toLowerCase();
    console.log(`Your project will be named ${chalk.blue.bold(projectName)}.`);
    askProjectDirectory();
  });
}

// Ask continue (git repository detected)
const askContinue = () => {
  questions.gitContinue((...args) => {
    if (args[0].gitContinue) {
      askProjectName();
    } else {
      console.log(`${chalk.red.bold('Process aborted')}, we advise you to move to a new directory.`);
      process.exit();
    }
  })
}

// Check if there is this already a git repo
const wasaInit = () => {
  if (files.directoryExists('.git')) {
    gitDetected = true;
    askContinue();
  } else {
    askProjectName();
  }
}

// Start wasa-cli
wasaInit();
