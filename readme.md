# WASA CLI

<table>
  <tr>
    <td>
      <a href="http://www.waitandsee.fr/home">
        <img width="77px" alt="Wait And See Agency logo" src="https://raw.githubusercontent.com/waitandseeagency/wasa-cli/gh-pages/wait-and-see-agency-logo.png" />
      </a>
  </td>
  </tr>
</table>

#### Introduction
WASA CLI is a tool to **automate the installation** of the <a href="https://github.com/waitandseeagency/wasa-boilerplate/">WASA Boilerplate</a>. Upon initialization, **a series of questions** will be asked (e.g. the name of the project, its location, its git repository), and then will **download the WASA Boilerplate**. 

With the WASA CLI, you can **initialize a new front-end project** in less than five minutes (*unless you have a really, really bad internet connection*), with no complication.

![Peek recording itself](https://raw.githubusercontent.com/waitandseeagency/wasa-cli/gh-pages/wasa-cli.gif)


#### WASA Boilerplate
The WASA Boilerplate is a simple and ready-to-go front-end boilerplate. It uses **Babel** to compile you ES6, **Pug** for the HTML, and **node-sass** with **csss-next** for your SCSS. And the best thing is : no need of gulp or webpack, everything is done thanks to the power of the NPM Scripts !


## Requirements
- node-js >= 6.4.0

## Installation
There are two ways to install the WASA CLI:
1. ###### (Recommended) global install:
```
npm i -g @waitandsee/wasa-cli
``` 
If you need root access, run instead: `sudo npm i -g @waitandsee/wasa-cli`
2. ###### Local install and then with an alias:
  1. Installation: `npm i @waitandsee/wasa-cli`
  2. Alias creation: e.g. `alias wasa="node ~/wasa-cli/index.js"`

## Usage
##### To initialiaze a project, simply type:
```
wasa
```
