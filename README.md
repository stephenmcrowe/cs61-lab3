# cs61-lab3

 * Stephen Crowe, Shikhar Sinha
 * Prof. Pierson
 * CS61: Databases
 * 27 April 2020

This is our lab 3 submission utilizing a node.js express server for the endpoints and a simple python client to access the api. See below for installation instructions.

## Dev Setup

### Requirements

API requirements

* Node >=9 <=11
* yarn (preferred over npm)

To install node on Mac:
```
brew update
brew upgrade
brew install node@10
brew install yarn
```

To check your installation of node and yarn:
```
node --version
yarn --version
```

To install on Windows, install from [nodejs.org](https://nodejs.org/en/) and [yarnpkg.com](https://classic.yarnpkg.com/en/).


Client requirements

* pipenv
* python 3.8

Alternatively, install requests and pyjwt

### Install dependencies

Run the command `yarn` to install node modules.
Run the command `pipenv install` to install python dependencies.

### Start the server

`yarn start`

### Start the client

`pipenv run python client.py`

Or, if your Python packages are installed locally, just `python client.py`.


Thanks to Prof. Tim Tregubov for equipping this repo with the following from his server starterpack:

* node with babel
* expressjs
* airbnb eslint rules

Procfile set up to run on [heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app)
