'use strict';

const chalk    = require('chalk');
const inquirer = require('inquirer');
const fs       = require('fs');
const isGitUrl = require('is-git-url');


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
      message: `How would you like to name your project ? ${chalk.reset('(special caracters are not permitted)')}`,
      validate: function(value) {
        if (value.length && regex.test(value)) {
          return true;
        } else if (value.length == 0) {
          return 'Please enter a project name.';
        } else {
          return `"${value}" is not a valid project name.`;
        }
      }
    }
  ];
  inquirer.prompt(questions).then(callback);
}

exports.projectQuestions = (callback) => {
  const questions = [
    {
      name: 'projectLocation',
      type: 'input',
      message: 'Where would you like to install this project? ' + chalk.reset('(leave empty for : ') + chalk.reset.yellow('./your_project_name)')
      // validate: function(value) {
      //   if (fs.existsSync(value)) {
      //     return 'There is already a directory with this name.'
      //   } else if (regex.test(value) || value.length == 0 ) {
      //     // && fs.existsSync(projectName) == false
      //     return true;
      //   // } else if (fs.existsSync(projectName)) {
      //   //   return 'nope';
      //   } else {
      //     return `"${value}" is not a valid project location.`;
      //   }
      // }
    },
    {
      type: 'list',
      name: 'repoExists',
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
};

exports.gitRepo = (callback) => {
  const questions = [
    {
      name: 'gitRepo',
      type: 'input',
      message: 'Paste here the remote URL we should use? (https or ssh)',
      validate: function(value) {
        if (value.length && isGitUrl(value) || ssh.test(value)) {
          return true;
        } else {
          return 'wrong'
        }
      }
    }
  ];
  inquirer.prompt(questions).then(callback);
}
