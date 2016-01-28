var SteamID = require('steamid');

var FriendsActions = require('../../actions/friends-actions.js');
var UserActions = require('../../actions/user-actions.js');
var FriendsStore = require('../../stores/friends-store.js');

/**
 * Persona State
 * Handles persona state changes - users changing online state, starting a game,
 * changing name etc.
 * Steam does not always send us everything so we also have to selectively request
 * user information from Steam.
 */
exports.name = 'punk-personastate';

exports.plugin = function(API) {
  var CACHE_FILE_NAME = 'friendslist-cache.json';
  var EMPTY_AVATAR_HASH = '0000000000000000000000000000000000000000';
  var DEFAULT_AVATAR_HASH = 'fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb';
  var EMPTY_FRIEND = {persona: {}};

  var PERSONA_STATES = [
    'Offline',
    'Online',
    'Busy',
    'Away',
    'Snooze',
    'Looking to Trade',
    'Looking to Play'
  ];

  var Steam = API.getSteam();
  var client = API.getClient();
  var log = API.getLogger();
  var username = API.getConfig().username;

  var steamFriends = API.getHandler('steamFriends');
  var pendingWrite = false;

  CACHE_FILE_NAME = username + '-' + CACHE_FILE_NAME;

  function persistFriendsList() {
    if(pendingWrite) {
      return;
    }

    pendingWrite = true;
    var friends = FriendsStore.getAll();

    if(API.hasHandler('writeFile')) {
      API.emitEvent('writeFile', CACHE_FILE_NAME, JSON.stringify(friends), function(error) {
        if(error) {
          log.error('Failed to persist friends list to cache.');
          log.debug(error);
        }

        pendingWrite = false;
      });
    } else {
      pendingWrite = false;
    }
  }

  FriendsStore.addChangeListener(persistFriendsList);

  if(API.hasHandler('readFile')) {
    API.emitEvent('readFile', CACHE_FILE_NAME, function(error, data) {
      if(error && error.code !== 'ENOENT') {
        log.error('Error while retrieving friends list cache.');
        log.debug(error);
      } else {
        try {
          var friends = JSON.parse(data);
          // assume everyone is offline
          friends.forEach(function(friend) {
            friend.state = 'Offline';
            friend.stateEnum = Steam.EPersonaState.Offline;
            friend.inGame = false;
          });
          FriendsActions.init(friends);
        } catch(e) {
          log.error('Failed to parse friends list cache data.');
          log.debug(e);
        }
      }
    });
  }

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'relationships'
  }, function() {
    // let's validate cache first
    var friends = FriendsStore.getAll();
    var validatedFriends = [];

    friends.forEach(function(friend) {
      if(steamFriends.friends[friend.id]) {
        validatedFriends.push(friend);
      }
    });

    FriendsActions.init(validatedFriends);

    var toBeRequested = [];

    for(var id in steamFriends.friends) {
      if(id === client.steamID) {
        continue;
      }

      if(steamFriends.friends[id] !== Steam.EFriendRelationship.RequestRecipient &&
         steamFriends.friends[id] !== Steam.EFriendRelationship.Friend &&
         steamFriends.friends[id] !== Steam.EFriendRelationship.RequestInitiator) {
        continue;
      }

      // at this point, we just check FriendsStore
      var friend = FriendsStore.getById(id);
      if(!friend) {
        toBeRequested.push(id);
      }
    }

    // we send a single request
    if(toBeRequested.length > 0) {
      steamFriends.requestFriendData(toBeRequested);
    }
  });

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'friend'
  }, function(user, type) {
    if(type === Steam.EFriendRelationship.None) {
      FriendsActions.purge(user);
    } else if(type === Steam.EFriendRelationship.RequestInitiator) {
      steamFriends.requestFriendData([user]);
    }
  });

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'personaState'
  }, function(persona) {
    var id = new SteamID(persona.friendid);

    // they use these for groups too, we will ignore them for now
    // perhaps this information can be used later
    if(id.type === SteamID.Type.CLAN) {
      return;
    }

    // get old data if we have them
    var currentFriend = FriendsStore.getById(persona.friendid) || EMPTY_FRIEND;

    // request new data if we are missing avatar
    var requestNewData = persona.avatar_hash === undefined;

    // fix persona since not all fields are sent by Steam
    persona.persona_state = persona.persona_state || currentFriend.persona.persona_state || Steam.EPersonaState.Offline;
    // this is sometimes empty even if the other user is playing a game; no idea why
    persona.game_name = persona.game_name || currentFriend.persona.game_name || '';
    persona.gameid = persona.gameid || currentFriend.persona.gameid || '0';
    persona.avatar_hash = persona.avatar_hash || currentFriend.persona.avatar_hash || EMPTY_AVATAR_HASH;

    // get avatar
    var hash = persona.avatar_hash.toString('hex');
    if(hash === EMPTY_AVATAR_HASH) {
      hash = DEFAULT_AVATAR_HASH;
    }
    var avatarUrl = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/' + hash.substring(0, 2) + '/' + hash + '.jpg';

    // relationship
    var relationship = steamFriends.friends[persona.friendid];

    var user = {
      id: persona.friendid,
      username: persona.player_name,
      avatar: avatarUrl,
      inGame: persona.gameid !== '0',

      state: persona.gameid !== '0'
        ? (persona.game_name !== '' ? persona.game_name : 'In-Game') // sometimes this will be empty, no idea why
        : PERSONA_STATES[persona.persona_state],
      stateEnum: persona.persona_state,

      relationshipEnum: relationship,

      // store the old persona object
      persona: persona
    };

    // let's ship the object
    if(persona.friendid === client.steamID) {
      UserActions.update(user);
    } else {
      FriendsActions.insertOrUpdate(user);
    }

    if(requestNewData) {
      log.debug('Requesting new data.');
      steamFriends.requestFriendData([persona.friendid]);
    }
  });

  API.registerHandler({
    emitter: 'plugin',
    plugin: '*',
    event: 'logout'
  }, function() {
    FriendsStore.removeChangeListener(persistFriendsList);
  });
};
