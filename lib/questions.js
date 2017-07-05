'use strict';

const chalk       = require('chalk');
const inquirer = require('inquirer');

const regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g;

// Git detected
exports.gitDetected = (callback) => {
  const questions = [
    {
      type: 'list',
      name: 'gitDetected',
      message: `${chalk.red('Be careful!')} You seem to be already inside of a git repository. Continue?`,
      choices: [
        {
          name: 'Yes',
          value: true
        }, {
          name: 'No',
          value: false
        }
      ],
      default: 'Yes'
    }
  ];
  inquirer.prompt(questions).then(callback);
}

// Project Name
exports.projectName = (callback) => {
  const questions = [
    {
      name: 'projectName',
      type: 'input',
      message: "How would you like to name your project ? (special caracters are not permitted)",
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
};

// Project Location
exports.projectLocation = (name, callback) => {
  const questions = [
    {
      name: 'projectLocation',
      type: 'input',
      message: 'Where would you like to install this project ?',
      default: `leave empty for : /${name}`,
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return 'Error';
        }
      }
    }
  ];
  inquirer.prompt(questions).then(callback);
};

// Repo exists
exports.repoExists = (callback) => {
  const questions = [
    {
      type: 'list',
      name: 'repoExists',
      message: 'Is there a git repository associated with this project ? If so, do you wish to clone it now ?',
      choices: [ 'No', 'Yes, and clone', 'Yes, but continue without cloning' ],
      default: 'No'
    }
  ];
  inquirer.prompt(questions).then(callback);
}
