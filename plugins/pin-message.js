const AbstractPlugin = require('./abstract-plugin');
const Discord = require('discord.js');
const Reporter = require('../lib/reporter.js');

const reporter = new Reporter();

class PinMessage extends AbstractPlugin {
  constructor(client) {
    super();
    reporter.register({
      userId: '358407021344587777',
      client
    });

    client.on('messageReactionAdd', reaction => {
      try {
        // you'll never fucking guess what this does
        if (reaction.emoji.name == '📌') reaction.message.pin();
      } catch (e) {
        e.data = { messageContent: reaction };
        reporter.error(e);
      }
    });
  }
}

module.exports = PinMessage;
