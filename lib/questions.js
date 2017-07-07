'use strict';

const chalk    = require('chalk');
const inquirer = require('inquirer');
const fs       = require('fs');
const isGitUrl = require('is-git-url');
const files    = require('./files');

const regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g;
const ssh   = /^[A-Za-z][A-Za-z0-9_]*\@[A-Za-z][A-Za-z0-9_\.]*\:(\/[A-Za-z][A-Za-z0-9_]*)*$/;

// Git detected
exports.gitContinue = (callback) => {
  const questions = [
    {
      type: 'confirm',
      name: 'gitContinue',
      message: `${chalk.red('Be careful,')} you seem to be already inside of a git repository. Continue?`
    }
  ];
  inquirer.prompt(questions).then(callback);
};

exports.projectName = (callback) => {
  const questions = [
    {
      name: 'projectName',
      type: 'input',
      message: `How would you like to name your project ? ${chalk.reset.italic('(special caracters are not permitted)')}`,
      validate: function(value) {
        if (value.length == 0) {
          return 'Please enter a project name.';
        } else if (regex.test(value) == false) {
          return `"${value}" is not a valid project name.`;
        } else {
          return true;
        }
      }
    }
  ];
  inquirer.prompt(questions).then(callback);
}

exports.projectDirectory = (callback) => {
  const questions = [
    {
      name: 'projectDirectory',
      type: 'input',
      message: 'Where would you like to install this project? ' + chalk.reset('(leave empty for : ') + chalk.reset.yellow('./your_project_name)'),
      validate: function(value) {
        if (value.length == 0) {
          return true;
        } else if (files.directoryExists(value)) {
          return `There is already a directory named ${value}`;
        } else if (regex.test(value) == false) {
          return 'This is not a valid directory name.'
        } else {
          return true;
        }
      }
    }
  ];
  inquirer.prompt(questions).then(callback);
};

exports.projectGit = (callback) => {
  const questions = [
    {
      type: 'list',
      name: 'projectGit',
      message: 'Is there a git repository associated with this project? If so, do you wish to clone it now?',
      choices: [
        {
          name: 'No',
          value: 0
        },
        {
          name: 'Yes, and clone',
          value: 1
        },
        {
          name: 'Yes, but continue without clonning',
          value: 2
        }
      ],
      default: 0
    }
  ];
  inquirer.prompt(questions).then(callback);
}

exports.gitRepo = (callback) => {
  const questions = [
    {
      name: 'gitRepo',
      type: 'input',
      message: 'Paste here the remote URL we should use? (https or ssh)',
      validate: function(value) {
        if (value.length && isGitUrl(value) || ssh.test(value)) {
          return true;
        } else if (value.length == 0) {
          return 'Please enter a remote URL.'
        } else {
          return 'This git remote URL is not valid.'
        }
      }
    }
  ];
  inquirer.prompt(questions).then(callback);
}
