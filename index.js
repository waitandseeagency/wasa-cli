#!/usr/bin/env node

'use strict'

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const program = require('commander')
const pkg = require('./package.json')
const helper = require('./lib/helper')
const Manager = require('./lib/manager')

const manager = new Manager()

program
  .version(pkg.version)

program
  // .help(false)
  .command('init [projectName]')
  .alias('i')
  .description('Initiliaze the project, with directly project name if wanted')
  .option('-G, --gulp', 'Used Gulp system instead of manual npm scripts')
  .option('-f, --force', 'Force the installation regardless of the folder\'s state')
  .action((env, options) => {
    console.log(`the gulp mode is : ${options.gulp}`)
    console.log(`the projectName is : ${env}`)

    // Clear terminal
    clear()

    // Init cli head
    console.log(chalk.yellow(figlet.textSync('|| WASA-CLI ||', { horizontalLayout: 'full' })))
    console.log(chalk.blue('Welcome to the Wasa Builder. Let\'s initiliaze together your boilerplate !'))


    if (helper.directoryExists('.git')) {
      manager.askContinue(options.force)
    } else {
      manager.askProjectName(env)
    }
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp(chalk.red)
}
