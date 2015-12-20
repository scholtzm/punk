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
      console.log(data.toString());
      if(error) {
        log.error('Error while retrieving friends list cache.');
        log.error(error);
      } else {
        try {
          var friends = JSON.parse(data);
          FriendsActions.init(friends);
        } catch(e) {
          log.error('Failed to parse friends list cache data.');
          log.error(e);
        }
      }
    });
  }

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'relationships'
  }, function() {
    var toBeRequested = [];

    for(var id in steamFriends.friends) {
      if(id === client.steamID) {
        continue;
      }

      if(steamFriends.friends[id] !== Steam.EFriendRelationship.Friend) {
        continue;
      }

      // at this point, we just check FriendsStore
      var friend = FriendsStore.getById(id);
      if(!friend) {
        toBeRequested.push(id);
      }
    }

    // we send a single request
    steamFriends.requestFriendData(toBeRequested);
  });

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'personaState'
  }, function(persona) {
    log.info('personaState: %s', persona.player_name);

    // fix persona since not all fields are sent by Steam
    persona.persona_state = persona.persona_state || 0;
    persona.game_name = persona.game_name || '';

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
