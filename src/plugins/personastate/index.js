var FriendsActions = require('../../actions/friends-actions.js');
var UserActions = require('../../actions/user-actions.js');

var FriendsStore = require('../../stores/friends-store.js');

exports.name = 'punk-personastate';

exports.plugin = function(API) {
  var CACHE_FILE_NAME = 'friendslist-cache.json';

  var utils = API.getUtils();
  var Steam = API.getSteam();
  var client = API.getClient();
  var log = API.getLogger();

  var steamFriends = API.getHandler('steamFriends');

  function persistFriendsList() {
    var friends = FriendsStore.getAll();

    if(API.hasHandler('writeFile')) {
      API.emitEvent('writeFile', CACHE_FILE_NAME, JSON.stringify(friends, null, 2), function(error) {
        if(error) {
          log.error('Failed to persist friends list to cache.');
          log.error(error);
        }
      });
    }
  }

  FriendsStore.addChangeListener(persistFriendsList);

  if(API.hasHandler('readFile')) {
    API.emitEvent('readFile', CACHE_FILE_NAME, function(error, data) {
      if(error) {
        log.error('Error while retrieving friends list cache.');
        log.error(error);
      } else {
        var friends = JSON.parse(data);
        FriendsActions.init(friends);
      }
    });
  }

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'relationships'
  }, function() {
    log.info(steamFriends.friends);
    // for(var id in steamFriends.friends) {
    //   if(id === client.steamID) {
    //     continue;
    //   }
    //
    //   var user = {
    //     id: id,
    //     username: id,
    //     // missing avatar
    //     state: 'Offline',
    //     stateEnum: Steam.EPersonaState.Offline,
    //     inGame: false
    //   };
    //
    //   FriendsActions.insertOrUpdate(user);
    // }
  });

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'personaState'
  }, function(persona) {
    log.info('personaState: %s', persona.player_name);

    // only Vapor can correctly "decode" the object so we transform it here
    var hash = persona.avatar_hash.toString('hex');
    var avatarUrl = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/' + hash.substring(0, 2) + '/' + hash + '.jpg';

    var user = {
      id: persona.friendid,
      username: persona.player_name,
      avatar: avatarUrl,
      state: persona.game_name === '' ?
        utils.enumToString(persona.persona_state, Steam.EPersonaState) :
        persona.game_name,
      stateEnum: persona.persona_state,
      inGame: persona.game_name !== ''
    };

    // let's ship the object
    if(persona.friendid === client.steamID) {
      UserActions.update(user);
    } else {
      FriendsActions.insertOrUpdate(user);
    }
  });

  API.registerHandler({
    emitter: 'plugin',
    plugin: 'punk-logout',
    event: 'logout'
  }, function() {
    FriendsStore.removeChangeListener(persistFriendsList);
  });
};
