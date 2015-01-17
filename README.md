# ![Github Pulse](resources/icon.png) Github Pulse

Github Pulse is an app to help you keep your streaks, making a commit every day.

It shows a graph of your last month commits and how long is your current streak. Its icon also turns red if you haven't committed today yet, and by the end of the afternoon it'll remind you once, in case you still haven't committed.

![Screenshot 1](resources/screenshot1.png)
![Screenshot 2](resources/screenshot2.png)
![Screenshot 3](resources/screenshot3.png)

## Installation

Right now it is available for OSX and Google Chrome

For OSX you can just download it [here](https://github.com/tadeuzagallo/GithubPulse/raw/master/dist/GithubPulse.zip), unzip and copy to your applications folder.

The Google Chrome Extension is available on the [Chrome Web Store](https://chrome.google.com/webstore/detail/githubpulse/ppkickbgijieebbgfipephpafiiebapg) and if, for any reason, you want to download directly, it's also available [here](https://github.com/tadeuzagallo/GithubPulse/raw/master/dist/GithubPulse.crx)

## What's being used

The OSX application has a small shell of native code, written in Swift and renders a React app (using JSX) on a WebView and uses `window.location` redirects to communicate with the native app.

The same react code is used for the Chrome Extension, just replacing the storage helpers and background workers.

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

As mentioned above I'm using Swift and React, so you'll need to have XCode 6+, Node and CocoaPods already installed in order to build.

### To get started:

* Clone the repo: `$ git clone https://github.com/tadeuzagallo/GithubPulse.git`
* Install the npm dependencies: `$ npm install`
* Install the pods: `$ cd widget && pod install`. If you haven't used pod before, you will need to run `pod setup` first.

### Debug building

The debug build points the WebView to `webpack-dev-server`'s default address: `localhost:8080`, so in order to get it running

* Start the webpack dev server: `$ cd front && make osx.watch`
* Just build the app through XCode interface

### Release building

__NOTICE__: If you just cloned the repo and wants `make` it, you'll have to open the file `widget/GithubPulse.xcworkspace` on XCode at least once for the build to succeed.

Just run `$ make osx` and the file `GithubPulse.zip` will be placed inside the `dist` directory.

### Chrome Extension

There actually is a target on the root `Makefile` called `chrome` but it won't work, because the private key is, well... private.

But you can still build the front end and load the unpacked extensions. Here is how:

* Run `$ cd front && make chrome` ( or `make chrome.watch` if you want to watch for changes)
* Then go to `chrome:extension`
* click on `Load unpacked extension...` (make sure `Developer mode` is checked on the top right of the page)
* Select `GithubPulse/chrome_extension`
* Done!

## Credits and Motivation

I really believe committing every day on an open source project is the best practice a developer can keep, so I made this project to show my love to Github and make I sure I never miss a commit! :D
