'use strict'

const chalk = require('chalk')
const inquirer = require('inquirer')
const isGitUrl = require('is-git-url')
const helper = require('./helper')

const regex = /^[a-zA-Z0-9]{1}[a-zA-Z0-9-_]*[a-zA-Z0-9]{1}$/
const regexStartEnd = /^[a-zA-Z0-9]/
const ssh = /^[A-Za-z][A-Za-z0-9_]*@[A-Za-z][A-Za-z0-9_.]*:(\/[A-Za-z][A-Za-z0-9_]*)*$/

class Questions {
  static gitContinue(callback) {
    const questions = [
      {
        type: 'confirm',
        name: 'gitContinue',
        message: `${chalk.red('Be careful')}, you seem to be already inside of a git repository. Continue?`,
      },
    ]
    inquirer.prompt(questions)
      .then((res) => {
        callback(res)
      })
  }

  static projectName(callback) {
    const questions = [
      {
        name: 'projectName',
        type: 'input',
        message: `How would you like to name your project? ${chalk.reset.italic('(kebab-case)')}`,
        validate(value) {
          if (value.length === 0) {
            return 'Please enter a project name.'
          } else if (!regex.test(value)) {
            if (!regexStartEnd.test(value.substr(0, 1))
             || !regexStartEnd.test(value.substr(-1, 1))) {
              return 'The project must begin / end with an alphanumeric character'
            }
            return `${value} is not a valid project name.`
          }
          return true
        },
      },
    ]
    inquirer.prompt(questions)
      .then((res) => {
        callback(res)
      })
  }

  static projectDirectory(projectName, callback) {
    const questions = [
      {
        name: 'projectDirectory',
        type: 'input',
        message: `Where would you like to install this project? ${chalk.reset.italic('(leave empty for:')} ${chalk.reset.yellow.italic(`./${projectName}`)}${chalk.reset.italic(')')}`,
        validate(value) {
          if (value.length === 0) {
            if (helper.directoryExists(projectName)) {
              return `There is already a directory named ${projectName}`
            }
            return true
          }

          if (helper.directoryExists(value)) {
            return `There is already a directory named ${value}.`
          } else if (!regex.test(value)) {
            return `${value} is not a valid directory name.`
          }
          return true
        },
      },
    ]
    inquirer.prompt(questions)
      .then((res) => {
        callback(res)
      })
  }

  static projectGit(callback) {
    const questions = [
      {
        type: 'list',
        name: 'projectGit',
        message: 'Is there a git repository associated with this project? If so, do you wish to clone it now?',
        choices: [
          {
            name: 'No',
            value: 0,
          },
          {
            name: 'Yes, clone',
            value: 1,
          },
          {
            name: 'Yes, but continue without clonning',
            value: 2,
          },
        ],
        default: 0,
      },
    ]
    inquirer.prompt(questions)
      .then((res) => {
        callback(res)
      })
  }

  static gitRepo(callback) {
    const questions = [
      {
        name: 'gitRepo',
        type: 'input',
        message: 'Paste here the remote URL we should use? (https or ssh)',
        validate(value) {
          if (isGitUrl(value) || ssh.test(value)) {
            return true
          } else if (value.length === 0) {
            return 'Please enter a remote URL.'
          }
          return 'This git remote URL is not valid.'
        },
      },
    ]
    inquirer.prompt(questions)
      .then((res) => {
        callback(res)
      })
  }
}

module.exports = Questions
