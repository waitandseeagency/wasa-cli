#!/usr/bin/env node

'use strict';

// Packages
const chalk = require('chalk');
const clear = require('clear');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const figlet = require('figlet');
const inquirer = require('inquirer');
const _ = require('lodash');
const git = require('simple-git')();
const touch = require('touch');
const fs = require('fs');
const download = require('download-git-repo')
const shell = require('shelljs')

// Files imports
const files = require('./lib/files');
const questions = require('./lib/questions');

// Declaring global variables
let gitDetected;
let projectName;
let projectDirectory;

// Clear terminal
clear();

// Init cli head
console.log(chalk.yellow(figlet.textSync('|| WASA-CLI ||', {horizontalLayout: 'full'})));
console.log(chalk.cyan('Welcome to the Wasa Builder. Let\'s initiliaze together your boilerplate !'));

// Check if there is this already a git repo
const wasaInit = () => {
  if (files.directoryExists('.git')) {
    gitDetected = true;
    askContinue();
  } else {
    askProjectName();
  }
}

// Ask continue (git repository detected)
const askContinue = () => {
  questions.gitContinue(function() {
    if (arguments[0].gitContinue) {
      askProjectName();
    } else {
      console.log(chalk.red.bold('Process aborted,') + ' we advise you to move to a new directory.');
      process.exit();
    }
  })
}

// Ask project name
const askProjectName = () => {
  questions.projectName(function() {
    projectName = arguments[0].projectName.toLowerCase();
    console.log(`Your project will be named ${chalk.blue.bold(projectName)}.`);
    askProjectDirectory();
  });
}

// Ask project location
const askProjectDirectory = () => {
  questions.projectDirectory(projectName, function() {
    if (arguments[0].projectDirectory.length == 0) {
      projectDirectory = projectName;
    } else {
      projectDirectory = arguments[0].projectDirectory;
    }
    console.log('You project will be installed in the directory ' + chalk.blue.bold('./') + chalk.blue.bold(projectDirectory));
    if (gitDetected) {
      // if git detected skip add repo
      dlBoilerplate();
    } else {
      askProjectGit();
    }
  })
}

// Ask project git
const askProjectGit = () => {
  questions.projectGit(function() {
    if (arguments[0].projectGit == 1) {
      askGitRepo();
    } else {
      fs.mkdirSync(projectDirectory);
      dlBoilerplate();
    }
  })
}

// Ask git repository
const askGitRepo = () => {
  questions.gitRepo(function() {
    const gitRepo = arguments[0].gitRepo;
    // clone desired repository
    const status = new Spinner(chalk.white('Cloning repository, please wait...'));
    status.start();
    git.clone(gitRepo, projectDirectory).exec(function() {
      status.stop();
      console.log('Repository successfully cloned.');
      dlBoilerplate();
    });
  })
}

// W&S Agency Boilerplate Download
const dlBoilerplate = () => {
  console.log(chalk.blue.bold('We will now download the WASA Boilerplate.'));
  setTimeout(() => {
    const status = new Spinner(chalk.white('Downloading boilerplate, please wait...'));
    status.start();
    download('waitandseeagency/wasa-boilerplate', `${projectDirectory}/`, function(err) {
      status.stop();
      if (err) {
        console.log('An error occured.');
      } else {
        console.log('We successfully downloaded the WASA Boilerplate.');
        initDependencies();
      }
    });
  }, 2000)
}

const initDependencies = () => {
  const current = process.cwd();
  try {
    process.chdir(current+'/'+projectDirectory);
  }
  catch (err) {
    console.log('chdir: ' + err);
  }
  console.log(chalk.blue.bold('We will know install the dependencies'));
  setTimeout(() => {
    if (shell.exec('npm install').code !== 0) {
      shell.echo('Error: npm install failed :/ !');
      shell.exit(1);
    } else {
      console.log('Dependencies successfully installed.');
      updateProject();
    }
  })
}

const updateProject = () => {
  console.log(chalk.blue.bold('We are now making the final touches!'));
  fs.readFile('package.json', 'utf-8', function(err, data){
    if (err) throw err;

    const newValue = data.replace(/"name": "wasa-boilerplate"/g, `"name": "${projectName}"`);

    fs.writeFile('package.json', newValue, 'utf-8', function (err) {
      if (err) throw err;
      console.log('filelistAsync complete');
    });
  });
}

// Start wasa-cli
wasaInit();
