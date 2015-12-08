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

      ChatActions.newFriendMessage(message);

      // var visible = false;
      // if(Object.keys(punk.chats).length === 0) {
      //   visible = true;
      // }
      //
      // if(!punk.chats[user]) {
      //   punk.chats[user] = {
      //     id: user,
      //     visible: visible,
      //     messages: []
      //   };
      // }
      //
      // // we overwrite the name
      // punk.chats[user].name = name;
      // punk.chats[user].messages.push(message);
      //
      // punk.render();
    }
  });
};
