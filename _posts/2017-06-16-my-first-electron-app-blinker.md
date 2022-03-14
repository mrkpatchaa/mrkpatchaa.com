---
templateKey: blog-post
title: 'My first electron app : Blinker'
excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus.'
published: true
comments: true
date: '2017-06-17T18:30:00.0000Z'
readTime: 3
author:
  name: Tim Neutkens
  picture: '/assets/blog/authors/tim.jpeg'
tags:
  - Electron
  - Application
  - Javascript
  - Health
coverImage: /assets/blog/blinker.png
ogImage:
  url: /assets/blog/blinker.png
---

A week ago, I discovered a very useful website and I thought I should make it an application.
This is the website : <a href="http://www.blynker.com/" target="blank" rel="noopener">http://www.blynker.com/</a>.<br/>
The principle is simple : it reminds you to take your eyes away from your computer every 20 minutes. So here is **Blinker**.

I do a lot of stuff on my computer and I don't always take a break to rest. We can see it like a <a href="https://cirillocompany.de/pages/pomodoro-technique" target="blank" rel="noopener">pomodoro</a>, but not just when you want to concentrate on something.

### **Planning the application**

**The idea is simple** : Every x (20) minutes you notify the user that he should take a break. 20 seconds later, he can go back to work.

**The technology** : I do a lot of Javascript so I decided to go with a tool that could help me create my _native_ application in Javascript. With no doubt I decided to go with <a href="https://electron.atom.io/" target="blank" rel="noopener">Electron</a>. Many applications, including Slack, Atom, VS Code, are built on top of Electron. And it has the advantage to help you build cross platform applications.

### **Creating the application**

Electron provides a quick start to help you understand the concept.

```bash
# Clone the Quick Start repository
$ git clone https://github.com/electron/electron-quick-start

# Go into the repository
$ cd electron-quick-start

# Install the dependencies and run
$ npm install && npm start
```

Blinker is a "window less" application (as it just shows a tray icon) so I deleted the `index.html` and `renderer.js` files.

Electron provides a <a href="https://electron.atom.io/docs/api/tray/" target="blank" rel="noopener">Tray</a> item that helps you add icons and context menus to the system’s notification area.

```javascript
const electron = require('electron')
const { app, Tray, Menu, BrowserWindow } = require('electron')
```

Here is the list of dependencies :

<a href="https://github.com/mikaelbr/node-notifier" target="blank" rel="noopener">**node-notifier**</a> : to display system notifications. I first used the HTML5 native Notification API, but it didn't work as our application doesn't run in a window.

```javascript
notifier.notify({
  title: 'Startup status changed',
  message: launchOnStartup
    ? 'You will have to launch the application every time you log in'
    : 'Great! Application will launch on system startup',
  icon: path.join(__dirname, 'icons/eye.png'),
  contentImage: '',
  sound: playSound, // true of false
})
```

<a href="https://github.com/Teamwork/node-auto-launch/" target="blank" rel="noopener">**auto-launch**</a> : to launch application on startup ;)

```javascript
const appAutoLauncher = new AutoLaunch({
  name: 'Blinker',
  isHidden: true,
  mac: {
    useLaunchAgent: true,
  },
})
```

<a href="https://github.com/sindresorhus/electron-store" target="blank" rel="noopener">**electron-store**</a> : to save application specific configuration (like sound, autostart)

```javascript
const store = new Store({
  defaults: {
    config: {
      launchOnStartup: true,
      playSound: true,
    },
  },
})
const config = store.get('config')
```

I have released the <a href="https://github.com/mrkpatchaa/blinker/releases/tag/v01" target="" rel="noopener">first version</a> for Linux and MacOS. If you are on windows, you can just checkout the code and build for windows.

Feel free to checkout the code on <a href="https://github.com/mrkpatchaa/blinker/" target="blank" rel="noopener">github</a>, submit pull requests or open issues if something is not working as expected.

Cheers.
