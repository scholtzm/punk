require('./utils/monkey-patch');

const Punk = require('./punk.js');

const punk = new Punk();
punk.start();

window.punk = punk;
