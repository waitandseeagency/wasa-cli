#!/usr/bin/env node

'use strict';

// Packages
const chalk     = require('chalk');
const clear     = require('clear');
const CLI       = require('clui');
const Spinner   = CLI.Spinner;
const figlet    = require('figlet');
const inquirer  = require('inquirer');
//const Preferences = require('preferences');
//const GitHubApi   = require('github');
const _         = require('lodash');
const git       = require('simple-git')();
const touch     = require('touch');
const fs        = require('fs');
const download  = require('download-git-repo')

// Files imports
const files     = require('./lib/files');
const questions = require('./lib/questions');

// Declaring global variables
let projectName;
let projectLocation;

// Clear terminal
clear();

// Init cli head
console.log(chalk.yellow(figlet.textSync('|WASA-Builder|', {horizontalLayout: 'full'})));
console.log(chalk.cyan('Welcome to the Wasa Builder. Let\'s initiliaze together your boilerplate !'));

//  Check if already in git repo
if (files.directoryExists('.git')) {
  questions.gitContinue(function() {
    const gitContinue = arguments[0].gitContinue;
    if (gitContinue == true) {
      questions.projectName(function() {
        projectName = arguments[0].projectName.toLowerCase();
      });
    } else if (gitContinue == false) {
      console.log(chalk.red.bold('Process aborted'));
      process.exit();
    }
  })
} else {
  questions.projectName(function() {
    projectName = arguments[0].projectName.toLowerCase();
    questions.projectQuestions(function() {
      if (arguments[0].projectLocation.length == 0) {
        projectLocation = projectName;
      } else {
        projectLocation = arguments[0].projectLocation;
      }
      const repoExists = arguments[0].repoExists;
      console.log(`Location is ${projectLocation}`);
      console.log(`Git answer is ${repoExists}`);
      if (repoExists == 1) {
        questions.gitRepo(function(){
          const gitRepo = arguments[0].gitRepo;
          // clone desired repository
          git.clone(gitRepo, projectLocation);
          // download and extract boilerplate package
          download('nothaldir/Portfolio', `${projectLocation}/`, function (err) {
            console.log(err ? 'Error' : 'Success')
          })
        });
      } else {
        fs.mkdirSync(projectLocation);
      }
    })
  });
}

// zip adress : https://github.com/nothaldir/Portfolio/archive/master.zip
