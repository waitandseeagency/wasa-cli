#!/usr/bin/env node

'use strict';

const chalk       = require('chalk');
const clear       = require('clear');
const CLI         = require('clui');
const Spinner     = CLI.Spinner;
const figlet      = require('figlet');
const inquirer    = require('inquirer');
//const Preferences = require('preferences');
//const GitHubApi   = require('github');
const _           = require('lodash');
const git         = require('simple-git')();
const touch       = require('touch');
const fs          = require('fs');
const files       = require('./lib/files');
const questions   = require('./lib/questions');

// Clear terminal
clear();

// Init cli head
console.log(chalk.yellow(figlet.textSync('|WASA-Builder|', { horizontalLayout: 'full' })));
console.log(chalk.cyan("Welcome to the Wasa Builder. Let's initiliaze together your boilerplate !"));

//  Check if already in git repo
if (files.directoryExists('.git')) {
  questions.gitDetected(function() {
    const gitDetected = arguments[0].gitDetected;
    if (gitDetected == "yes") {
      console.log('yes');
    } else {
      process.exit();
    }
  });
};

// questions.projectName(() => {
//  const projectName = arguments[0].projectName.toLowerCase();
//  questions.projectLocation(projectName, () => {
//    console.log(arguments);
//  });
// });
