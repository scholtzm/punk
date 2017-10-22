const SteamUser = require('steam-user');

const Logger = require('../../utils/logger')('plugin:personastate');
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
module.exports = function(steamUser) {
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

  function isDefaultRelationGroup(relationship) {
    return relationship === SteamUser.EFriendRelationship.RequestRecipient ||
      relationship === SteamUser.EFriendRelationship.Friend ||
      relationship === SteamUser.EFriendRelationship.RequestInitiator ||
      relationship === SteamUser.EFriendRelationship.IgnoredFriend;
  }

  steamUser.on('friendsList', () => {
    const toBeRequested = [];

    for (const id in steamUser.myFriends) {
      if (id === steamUser.steamID.getSteamID64()) {
        continue;
      }

      // Regular Steam client shows only these 4 groups
      if (isDefaultRelationGroup(steamUser.myFriends[id])) {
        toBeRequested.push(id);
      }
    }

    if(toBeRequested.length > 0) {
      steamUser.getPersonas(toBeRequested);
    }
  });

  steamUser.on('friendRelationship', (user, type) => {
    if (type === SteamUser.EFriendRelationship.None) {
      FriendsActions.purge(user);
    }

    if (isDefaultRelationGroup(type)) {
      steamUser.getPersonas([user]);
    }
  });

  steamUser.on('user', (sid, persona) => {
    // get SteamID64
    const id = sid.getSteamID64();

    // get old data if we have them
    const currentFriend = FriendsStore.getById(id) || EMPTY_FRIEND;

    // request new data if we are missing avatar
    const requestNewData = persona.avatar_hash === undefined;

    // fix persona since not all fields are sent by Steam
    persona.persona_state = persona.persona_state === undefined
      ? currentFriend.persona.persona_state || SteamUser.EPersonaState.Offline
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
    const relationship = steamUser.myFriends[id];

    const user = {
      id,
      username: persona.player_name,
      avatar: avatarUrl,
      inGame: persona.gameid !== '0',

      state: relationship === SteamUser.EFriendRelationship.IgnoredFriend
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
    if(id === steamUser.steamID.getSteamID64()) {
      UserActions.update(user);
    } else {
      FriendsActions.insertOrUpdate(user);
    }

    if(requestNewData) {
      Logger.debug('Requesting new data.');
      steamUser.getPersonas([id]);
    }
  });
};
