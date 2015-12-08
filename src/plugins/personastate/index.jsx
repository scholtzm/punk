exports.name = 'punk-personastate';

exports.plugin = function(API) {
  var utils = API.getUtils();
  var Steam = API.getSteam();
  var client = API.getClient();

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'personaState'
  }, function(friend) {
    // ignore self
    if(friend.friendid === client.steamID) {
      return;
    }

    if(!punk.friends[friend.friendid]) {
      punk.friends[friend.friendid] = {};
    }

    var hash = friend.avatar_hash.toString('hex');
    var avatarUrl = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/' + hash.substring(0, 2) + '/' + hash + '.jpg';

    punk.friends[friend.friendid].id = friend.friendid;
    punk.friends[friend.friendid].username = friend.player_name;
    punk.friends[friend.friendid].avatar = avatarUrl;
    punk.friends[friend.friendid].state = utils.enumToString(friend.persona_state, Steam.EPersonaState);

    punk.render();
  });
};
