'use strict';

const chalk    = require('chalk');
const inquirer = require('inquirer');

const regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g;

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
      message: 'How would you like to name your project ? (special caracters are not permitted)',
      validate: function(value) {
        if (value.length && regex.test(value)) {
          return true;
        } else if (value.length == 0) {
          return 'Please enter a project name.';
        } else {
          return `${value} is not a valid project name.`;
        }
      }
    }
  ];
  inquirer.prompt(questions).then(callback);
}

exports.projectQuestions = (name, callback) => {
  const questions = [
    {
      name: 'projectLocation',
      type: 'input',
      message: 'Where would you like to install this project ?',
      default: `leave empty for : ./${name}`,
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return 'Error';
        }
      }
    },
    {
      type: 'list',
      name: 'repoExists',
      message: 'Is there a git repository associated with this project ? If so, do you wish to clone it now ?',
      choices: [ 'No', 'Yes, and clone', 'Yes, but continue without cloning' ],
      default: 'No'
    }
  ];
  inquirer.prompt(questions).then(callback);
};
