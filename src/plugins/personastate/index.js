var FriendsActions = require('../../actions/friends-actions.js');
var UserActions = require('../../actions/user-actions.js');

exports.name = 'punk-personastate';

exports.plugin = function(API) {
  var utils = API.getUtils();
  var Steam = API.getSteam();
  var client = API.getClient();

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'personaState'
  }, function(persona) {
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
};
