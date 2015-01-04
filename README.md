# ![Github Pulse](resources/icon.png) Github Pulse

Github Pulse is a status bar app for osx to help you keep your streaks, making a commit every day.

It shows a graph of your last month commits and how long is your current streak. Its icon also turns red if you haven't commited today yet, and by the end of the afternoon it'll remember you once, in case you still haven't commited.

![Screenshot 1](resources/screenshot1.png =250x)
![Screenshot 2](resources/screenshot2.png =250x)
![Screenshot 3](resources/screenshot3.png =250x)

## Installation

Just download it [here](https://github.com/tadeuzagallo/GithubPulse/raw/master/dist/GithubPulse.zip) and copy to your applications folder

## What's being used

The application has a small shell of native code, written in Swift and renders a React app (using JSX) on a WebView and uses `window.location` redirects to communicate with the native app.

### 3rd party libraries (Front)

* React
* Webpack
* Stylus
* Octicons
* react-router
* Chart.js

### Pods

* IYLoginItem
* INPopoverController

## Building it locally

As mentioned above I'm using Swift and React, so you'll need to have XCode 6+ installed, Node and CocoaPods already installed in order to build.

### To get started:

* Clone the repo: `$ git clone https://github.com/tadeuzagallo/GithubPulse.git`
* Install the npm dependencies: `$ npm install`
* Install the pods: `$ cd widget && pod install`

### Debug building

The debug build points the WebView to `webback-dev-server` default address: `localhost:8080`, so in order to get it running

* Start the webpack dev server: `$ cd front && webpack-dev-server`
* Just build the app through XCode interface (Command line build step is yet to come)

### Release building

* Pack the front with webpack: `$ cd front && webpack`
* Go to XCode, on the `Product` menu, click and `Archive` and then `Export...` and  finally `Export as Mac Application`

Done!

## Credits and Motivation

I really believe commiting every day on an open source project is the best practice a developer can keep, so I made this project to show my love to Github and make I sure I never miss a commit! :D
