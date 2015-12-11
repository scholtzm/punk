var ChatActions = require('../../actions/chat-actions.js');

exports.name = 'punk-friendmsg';

exports.plugin = function(API) {
  var Steam = API.getSteam();
  var steamFriends = API.getHandler('steamFriends');

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'friendMsg'
  }, function(user, message, type) {
    if(type === Steam.EChatEntryType.ChatMsg) {
      var name = user;

      var persona = steamFriends.personaStates[user];
      if(persona) {
        name = persona.player_name;
      }

      var message = {
        sender: user,
        name: name,
        text: message
      };

      ChatActions.newIncomingMessage(message);
    }
  });
};
