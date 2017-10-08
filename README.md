![Punk logo](https://cloud.githubusercontent.com/assets/2640934/11823554/dde8a120-a374-11e5-8c81-7a91481d5243.png)

![Punk screenshot](https://cloud.githubusercontent.com/assets/2640934/12659057/fc11ad1c-c60c-11e5-841b-8d34e729b8e4.png)

[![Build Status](https://travis-ci.org/scholtzm/punk.svg?branch=master)](https://travis-ci.org/scholtzm/punk)
[![Dependency Status](https://david-dm.org/scholtzm/punk.svg)](https://david-dm.org/scholtzm/punk)
[![devDependencies Status](https://david-dm.org/scholtzm/punk/dev-status.svg)](https://david-dm.org/scholtzm/punk?type=dev)
[![Steam Group](https://img.shields.io/badge/steam-group-blue.svg)](http://steamcommunity.com/groups/punkclient)

**Punk** is a cross-platform Steam client for desktop built on top of [Vapor](https://github.com/scholtzm/vapor) and [Electron](http://electron.atom.io/).

The UI is powered by [React](https://facebook.github.io/react/), [Flux](https://facebook.github.io/flux/) and the visuals are handled by [Photon](http://photonkit.com/).

## Features

- Friends list
  - Add, remove or block friends
  - Send, accept, decline or cancel friend requests
  - Display offline messages

- Chatting
  - Chat with people in your friends list
  - Built-in chat logger

- Trading
  - Accept, decline or cancel regular trades
  - Accept or send trade offers

- Notifications
  - Dedicated notification badge for trade offers
  - Desktop notifications for chat messages and trade offers

- Steam Community & Steam Store integration
  - Full interaction with these websites

## Download

Pre-built binaries as well as the source code snapshots can be found in the [releases](https://github.com/scholtzm/punk/releases) section.

## Developers

### Build & develop

After cloning the repo, run:

```sh
npm install
npm run build
# or
npm run watch
```

A `dist` folder will be created.

### Running the application

```sh
npm start
```

### Building the packages

```sh
npm run package
```

This will build package for your current platform in `package/{platform}`.

You can also override your current platform by passing it as a command line argument.

```sh
npm run package -- --platform={win32,darwin}
```

## Data

Punk stores all of your data in a single folder. The folder path depends on your operating system:

- `%APPDATA%/Punk` on Windows
- `$XDG_CONFIG_HOME/Punk` or `~/.config/Punk` on Linux
- `~/Library/Application Support/Punk` on OS X

This folder contains user data, cache files, chat logs and application log.
Make sure to remove this folder in case you decide to stop using Punk.

## LICENSE

MIT. See `LICENSE`.
