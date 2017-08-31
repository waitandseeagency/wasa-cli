'use strict'

const chalk = require('chalk')
const CLI = require('clui')
const download = require('download-git-repo')
const fs = require('fs')
const git = require('simple-git')()
const shell = require('shelljs')
const username = require('git-user-name')
const Questions = require('./questions')

// Other packages
const Spinner = CLI.Spinner

class Manager {
  constructor() {
    this.gitDetected = false
    this.name = ''
    this.directory = ''
  }

  get isGit() {
    return this.gitDetected
  }

  set isGit(value) {
    this.gitDetected = value
  }

  set projectName(newProjectName) {
    this.name = newProjectName
  }

  get projectName() {
    return this.name
  }

  set projectDirectoryy(newProjectDirectory) {
    this.directory = newProjectDirectory
  }

  get projectDirectoryy() {
    return this.directory
  }

  // Ask continue (git repository detected)
  askContinue(force) {
    this.gitDetected = true
    if (typeof force !== 'undefined') {
      this.askProjectName()
    } else {
      Questions.gitContinue((...args) => {
        if (args[0].gitContinue) {
          this.askProjectName()
        } else {
          console.log(`${chalk.red.bold('Process aborted')}, we advise you to move to a new directory.`)
          process.exit()
        }
      })
    }
  }

  // Ask project name
  askProjectName(name) {
    if (typeof name !== 'undefined') {
      this.name = name.toLowerCase()
      console.log(`Your project will be named ${chalk.blue.bold(this.name)}.`)
      this.askProjectDirectory()
    } else {
      Questions.projectName((...args) => {
        this.name = args[0].projectName.toLowerCase()
        console.log(`Your project will be named ${chalk.blue.bold(this.name)}.`)
        this.askProjectDirectory()
      })
    }
  }

  // Ask project location
  askProjectDirectory() {
    Questions.projectDirectory(this.name, (...args) => {
      if (args[0].projectDirectory.length === 0) {
        this.directory = this.name
      } else {
        this.directory = args[0].projectDirectory.toLowerCase()
      }
      console.log(`You project will be installed in the directory ${chalk.blue.bold(`./${this.directory}`)}`)
      if (this.gitDetected) {
        // if git detected skip add repo
        this.dlBoilerplate()
      } else {
        this.askProjectGit()
      }
    })
  }

  // Ask project git
  askProjectGit() {
    Questions.projectGit((...args) => {
      if (args[0].projectGit === 1) {
        this.askGitRepo()
      } else {
        fs.mkdirSync(this.directory)
        this.dlBoilerplate()
      }
    })
  }

  // Ask git repository
  askGitRepo() {
    Questions.gitRepo((...args) => {
      const gitRepo = args[0].gitRepo
      // clone desired repository
      const status = new Spinner(chalk.white('Cloning repository, please wait...'))
      status.start()
      git.clone(gitRepo, this.directory).exec(() => {
        status.stop()
        console.log('Repository successfully cloned.')
        this.dlBoilerplate()
      })
    })
  }

  // WASAgency Boilerplate Download
  dlBoilerplate() {
    console.log(chalk.blue('We will now download the WASA Boilerplate.'))
    setTimeout(() => {
      const status = new Spinner(chalk.white('Downloading boilerplate, please wait...'))
      status.start()
      download('waitandseeagency/wasa-boilerplate', `${this.directory}/`, (err) => {
        status.stop()
        if (err) {
          console.log(`${chalk.red('An internal error occured while downloading the boilerplate. Please contact us.')}`)
        } else {
          console.log('We successfully downloaded the WASA Boilerplate.')
          this.initDependencies()
        }
      })
    }, 500)
  }

  // Install dependencies
  initDependencies() {
    const current = process.cwd()
    try {
      process.chdir(`${current}/${this.directory}`)
    } catch (err) {
      console.log(`chdir: ${err}`)
    }
    console.log(chalk.blue('We will now install the dependencies. This might take a moment, please wait.'))
    setTimeout(() => {
      if (shell.exec('npm install --silent').code !== 0) {
        shell.echo('Error: npm install failed :/ !')
        shell.exit(1)
      } else {
        console.log('Dependencies successfully installed.')
        this.updateProject()
      }
    }, 100)
  }

  // Update project (package.json, readme) with answers
  updateProject() {
    console.log(chalk.blue('We are now making the final touches!'))
    const status = new Spinner(chalk.white('Please wait...'))
    status.start()
    setTimeout(() => {
      fs.readFile('package.json', 'utf-8', (err, data) => {
        if (err) throw err

        const newValue = data
          .replace(/"name": "wasa-boilerplate"/g, `"name": "${this.name}"`)
          .replace(/"author": "Wait And See Agency"/g, `"author": "${username()}"`)

        fs.writeFile('package.json', newValue, 'utf-8', (error) => {
          if (error) {
            throw error
          } else {
            status.stop()
            console.log(chalk.green('Project install complete, you\'re all set !'))
          }
        })
      })
    }, 1000)
  }
}

module.exports = Manager
