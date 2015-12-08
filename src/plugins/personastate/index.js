var FriendsActions = require('../../actions/friends-actions.js');

exports.name = 'punk-personastate';

exports.plugin = function(API) {
  var utils = API.getUtils();
  var Steam = API.getSteam();
  var client = API.getClient();

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'personaState'
  }, function(persona) {
    // ignore self
    if(persona.friendid === client.steamID) {
      return;
    }

    // only Vapor can correctly "decode" the object so we transform it here
    var hash = persona.avatar_hash.toString('hex');
    var avatarUrl = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/' + hash.substring(0, 2) + '/' + hash + '.jpg';

    var friend = {
      id: persona.friendid,
      username: persona.player_name,
      avatar: avatarUrl,
      state: utils.enumToString(persona.persona_state, Steam.EPersonaState)
    };

    // let's ship the object
    FriendsActions.insertOrUpdate(friend);
  });
};
