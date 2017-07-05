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

// call : question.projectName

// Clear terminal
clear();

// Init cli head
console.log(
  chalk.yellow(
    figlet.textSync('|WASA-Builder|', { horizontalLayout: 'full' })
  ),
  chalk.cyan(
    "Welcome to the Wasa Builder. Let's initiliaze together your boilerplate :) !"
  )
);

//  Check if already in git repo
if (files.directoryExists('.git')) {
  console.log(chalk.red('You are already inside a git repository. Do you wish to proceed ?'));
  //process.exit();
};

// Call questions
console.log(questions);
questions.projectName(function(){
  const projectName = arguments[0].projectName;
  questions.projectLocation(projectName, () => {
    console.log(arguments);
  });
});
