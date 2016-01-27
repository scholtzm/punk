![Punk logo](https://cloud.githubusercontent.com/assets/2640934/11823554/dde8a120-a374-11e5-8c81-7a91481d5243.png)

![Punk screenshot](https://cloud.githubusercontent.com/assets/2640934/11825305/a0382ff8-a37e-11e5-9957-5c42b6c9bf16.png)

[![Build Status](https://travis-ci.org/scholtzm/punk.svg?branch=master)](https://travis-ci.org/scholtzm/punk)
[![Dependency Status](https://david-dm.org/scholtzm/punk.svg)](https://david-dm.org/scholtzm/punk)
[![devDependency Status](https://david-dm.org/scholtzm/punk/dev-status.svg)](https://david-dm.org/scholtzm/punk#info=devDependencies)

**Punk** is a cross-platform Steam client for desktop built on top of [Vapor](https://github.com/scholtzm/vapor) and [Electron](http://electron.atom.io/).

The UI is powered by [React](https://facebook.github.io/react/), [Flux](https://facebook.github.io/flux/) and the visuals are handled by [Photon](http://photonkit.com/).

Punk is currently under development and as such isn't recommended for day-to-day usage.

## Build & develop

After cloning the repo, run:

```sh
npm install
npm run build
npm run watch
```

A `dist` folder will be created.

## Running the application

```sh
npm start
```

## Building the packages

```sh
npm run build
npm run package-osx
# or
npm run package-win
```

A `package` folder will be created.

## LICENSE

MIT. See `LICENSE`.
