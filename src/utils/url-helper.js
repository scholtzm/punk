const shell = require('electron').shell;

const urlHelper = {};

urlHelper.steamUrlRegex = /^https?:\/\/(?:www\.)?(?:steamcommunity|store\.steampowered)\.com\/(?!linkfilter).*$/;

urlHelper.isSteamUrl = function(url) {
  return this.steamUrlRegex.test(url);
};

urlHelper.openExternal = function(url) {
  shell.openExternal(url);
};

module.exports = urlHelper;
