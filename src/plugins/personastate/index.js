const SteamID = require('steamid');

const FriendsActions = require('../../actions/friends-actions.js');
const UserActions = require('../../actions/user-actions.js');
const FriendsStore = require('../../stores/friends-store.js');

/**
 * Persona State
 * Handles persona state changes - users changing online state, starting a game,
 * changing name etc.
 * Steam does not always send us everything so we also have to selectively request
 * user information from Steam.
 */
exports.name = 'punk-personastate';

exports.plugin = function(API) {
  const CACHE_FILE_NAME = 'friendslist-cache.json';
  const EMPTY_AVATAR_HASH = '0000000000000000000000000000000000000000';
  const DEFAULT_AVATAR_HASH = 'fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb';
  const EMPTY_FRIEND = { persona: {} };

  const PERSONA_STATES = [
    'Offline',
    'Online',
    'Busy',
    'Away',
    'Snooze',
    'Looking to Trade',
    'Looking to Play'
  ];

  const Steam = API.getSteam();
  const client = API.getClient();
  const log = API.getLogger();
  const username = API.getConfig().username;
  const sanitizedUsername = username.toLowerCase();

  const DEFAULT_INFO_REQUEST = Steam.EClientPersonaStateFlag.PlayerName |
    Steam.EClientPersonaStateFlag.Presence |
    Steam.EClientPersonaStateFlag.SourceID |
    Steam.EClientPersonaStateFlag.GameExtraInfo |
    Steam.EClientPersonaStateFlag.LastSeen;

  const steamFriends = API.getHandler('steamFriends');
  let pendingWrite = false;

  function persistFriendsList() {
    if(pendingWrite) {
      return;
    }

    pendingWrite = true;
    const friends = FriendsStore.getAll();

    if(API.hasHandler('writeFile')) {
      API.emitEvent('writeFile', { prefix: sanitizedUsername, fileName: CACHE_FILE_NAME, value: JSON.stringify(friends) }, (error) => {
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
    API.emitEvent('readFile', { prefix: sanitizedUsername, fileName: CACHE_FILE_NAME }, (error, data) => {
      if(error) {
        if(error.code !== 'ENOENT') {
          log.warn('Couldn\'t retrieve friends list from cache.');
          log.debug(error);
        }
      } else {
        try {
          const friends = JSON.parse(data);
          // assume everyone is offline
          friends.forEach((friend) => {
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

  function isDefaultRelationGroup(relationship) {
    return relationship === Steam.EFriendRelationship.RequestRecipient ||
      relationship === Steam.EFriendRelationship.Friend ||
      relationship === Steam.EFriendRelationship.RequestInitiator ||
      relationship === Steam.EFriendRelationship.IgnoredFriend;
  }

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'relationships'
  }, () => {
    const toBeRequested = [];

    for(const id in steamFriends.friends) {
      if(id === client.steamID) {
        continue;
      }

      // Regular Steam client shows only these 4 groups
      if(isDefaultRelationGroup(steamFriends.friends[id])) {
        toBeRequested.push(id);
      }
    }

    // Let's validate cache first
    const friends = FriendsStore.getAll();
    const validatedFriends = friends.filter(friend => toBeRequested.includes[friend.id]);
    FriendsActions.init(validatedFriends);

    // we send a single request
    if(toBeRequested.length > 0) {
      steamFriends.requestFriendData(toBeRequested, DEFAULT_INFO_REQUEST);
    }
  });

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'friend'
  }, (user, type) => {
    if(type === Steam.EFriendRelationship.None) {
      FriendsActions.purge(user);
    }

    if(isDefaultRelationGroup(type)) {
      steamFriends.requestFriendData([user], DEFAULT_INFO_REQUEST);
    }
  });

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'personaState'
  }, (persona) => {
    const id = new SteamID(persona.friendid);

    // they use these for groups too, we will ignore them for now
    // perhaps this information can be used later
    if(id.type === SteamID.Type.CLAN) {
      return;
    }

    // get old data if we have them
    const currentFriend = FriendsStore.getById(persona.friendid) || EMPTY_FRIEND;

    // request new data if we are missing avatar
    const requestNewData = persona.avatar_hash === undefined;

    // fix persona since not all fields are sent by Steam
    persona.persona_state = persona.persona_state === undefined
      ? currentFriend.persona.persona_state || Steam.EPersonaState.Offline
      : persona.persona_state;
    // this is sometimes empty even if the other user is playing a game; no idea why
    persona.game_name = persona.game_name || currentFriend.persona.game_name || '';
    persona.gameid = persona.gameid || currentFriend.persona.gameid || '0';
    persona.avatar_hash = persona.avatar_hash || currentFriend.persona.avatar_hash || EMPTY_AVATAR_HASH;

    // get avatar
    let hash = persona.avatar_hash.toString('hex');
    if(hash === EMPTY_AVATAR_HASH) {
      hash = DEFAULT_AVATAR_HASH;
    }
    const avatarUrl = `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/${ hash.substring(0, 2) }/${ hash }.jpg`;

    // relationship
    const relationship = steamFriends.friends[persona.friendid];

    const user = {
      id: persona.friendid,
      username: persona.player_name,
      avatar: avatarUrl,
      inGame: persona.gameid !== '0',

      state: relationship === Steam.EFriendRelationship.IgnoredFriend
        ? 'Blocked'
        : persona.gameid !== '0'
          ? (persona.game_name !== '' ? persona.game_name : 'In-Game') // sometimes this will be empty, no idea why
          : PERSONA_STATES[persona.persona_state],
      stateEnum: persona.persona_state,

      relationshipEnum: relationship,

      // store the old persona object
      persona
    };

    // let's ship the object
    if(persona.friendid === client.steamID) {
      UserActions.update(user);
    } else {
      FriendsActions.insertOrUpdate(user);
    }

    if(requestNewData) {
      log.debug('Requesting new data.');
      steamFriends.requestFriendData([persona.friendid], DEFAULT_INFO_REQUEST);
    }
  });

  API.registerHandler({
    emitter: 'plugin',
    plugin: '*',
    event: 'logout'
  }, () => {
    FriendsStore.removeChangeListener(persistFriendsList);
  });
};
