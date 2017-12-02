global._mckay_statistics_opt_out = true;

const Punk = require('./punk.js');

const punk = new Punk();
punk.start();

window.punk = punk;
