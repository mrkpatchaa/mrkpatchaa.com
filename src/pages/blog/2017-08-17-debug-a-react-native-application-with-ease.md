---
templateKey: blog-post
title: 'Debug a React Native application with ease'
description: ''
published: true
comments: true
date: 2017-08-17T23:45:00.0000Z
readTime: 5
tags:
  - React Native
  - React Native Debugger
  - Electron
  - Javascript
  - Debug
  - Mobile
image: /img/React-Native-Debugger.png
---

Debugging on React Native is not as ease as we think. Facebook officially provides [**documentation**](https://facebook.github.io/react-native/docs/debugging.html) on debugging a RN application in Google Chrome taking advantages of Chrome Developer Tools.

To debug the JavaScript code in Chrome, you need to select "Debug JS Remotely" from the Developer Menu \(⌘D or ⌘M depending if you are running iOS or Android simulator\). This will open a new tab at [**http://localhost:8081/debugger-ui**](http://localhost:8081/debugger-ui) when your application launches.

This is good, but not enough. It is difficult to set up React Developer Tools Chrome extension for React Native. You need a custom extension to debug Redux...

You also have the choice to use standalone version of React Developer Tools to debug the component hierarchy. You can install it using **npm**.

```bash
$ npm install -g react-devtools
```

Launch it from the terminal

```bash
$ react-devtools
```

There is an all in one solution, called -you guessed it- [**React Native Debugger**](https://github.com/jhen0409/react-native-debugger). It is a standalone application based on the official debugger of React Native which includes React inspector and Redux DevTools, offering a debugger for applications using Redux or not.

### How to install React Native Debugger

The application is based on **Electron** :\). Prebuilt binaries are available for Windows, Linux and macOS on the [**releases**](https://github.com/jhen0409/react-native-debugger/releases) page of the project. For macOS, you can install it via **Homebrew Cask**.

```bash
$ brew update && brew cask install react-native-debugger
```

### Usage

#### 1. Manually

Using React Native Debugger doesn't require custom configuration, as it listens by default on the React Native packager port \(8081\) by default. Follow these steps to start debugging :

1. Make sure all [http://localhost:&lt;port&gt;/debugger-ui](http://localhost:<port>/debugger-ui) pages are closed
2. Launch React Native Debugger
3. Launch your application and enable [**Debug JS Remotely**](https://facebook.github.io/react-native/docs/debugging.html#accessing-the-in-app-developer-menu)
   <br /><br />

#### 2. Automatically with react-native-debugger-open

There is a [**package**](https://github.com/jhen0409/react-native-debugger/tree/master/npm-package) which configures your application to automatically open React Native Debugger instead of Google Chrome when it launches. It replaces `open debugger-ui with Chrome` by `open React Native Debugger` from react-native packager

To install and configure the package, follow these steps :

- Install the package :

```bash
$ npm i --save-dev react-native-debugger-open # or -g
```

- Add this to your package.json

```json
"scripts": {
    ... your current scripts configuration
    // add this line
    "postinstall": "rndebugger-open"
}
```

It will be run after `npm install`. \(You can run `npm run postinstall first`\) The `./node_modules/react-native/local-cli/server/middleware/getDevToolsMiddleware.js` code will be replaced.

And voilà. Now, every time your application launches, it will open React Native Debugger. If the React Native Debugger app is already opened, it will attach automatically the debugging session. But It is recommended to first close the React Native Debugger windows, just to make sure you won't have unexpected behavior.

### Going further

There is a lot to read about debugging React Native applications. I gave an introduction which covers simple cases. If you need advanced configuration in the debugging process, you could read more about with the following resources.

- **React Native Debugger Documentation** : [https://github.com/jhen0409/react-native-debugger\#documentation](https://github.com/jhen0409/react-native-debugger#documentation)
- **React Native Debugger Open** : [https://github.com/jhen0409/react-native-debugger/tree/master/npm-package\#usage](https://github.com/jhen0409/react-native-debugger/tree/master/npm-package#usage)
- **Official React Native Debugging documentation** : [https://facebook.github.io/react-native/docs/debugging.html](https://facebook.github.io/react-native/docs/debugging.html)
- **Google** : [http://bfy.tw/DR8k](http://bfy.tw/DR8k) :\)
