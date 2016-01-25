var shell = require('electron').shell;

var urlHelper = {};

urlHelper.steamUrlRegex = /^https?:\/\/(steamcommunity|store\.steampowered)\.com\/(?!linkfilter).*$/;

urlHelper.isSteamUrl = function(url) {
  return this.steamUrlRegex.test(url);
};

urlHelper.openExternal = function(url) {
  shell.openExternal(url);
};

module.exports = urlHelper;
