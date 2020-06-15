const AbstractPlugin = require('./abstract-plugin');
const Discord = require('discord.js');
const Reporter = require('../lib/reporter.js');
const fs = require('fs');
const path = require('path');

const reporter = new Reporter();

class SaEmotes extends AbstractPlugin {
  constructor(client) {
    super();
    reporter.register({
      userId: '268183210297393152',
      client
    });

    const emoteRegEx = /\:([\w\;\-\(\)\!]+)\:/g;

    client.on('message', async message => {
      try {
        if (emoteRegEx.test(message.content)) {
          const fileExtensions = ['.png', '.gif', '.mp4'];
          const emoteFolders = [
            path.join(__rootdir, 'saemotes'),
            path.join(__rootdir, 'cemotes')
          ];

          // Extract emotes from message
          const emoteTags = message.content
            .match(emoteRegEx)
            .map(tag => tag.slice(1, -1)); // strip colons

          // Construct a list of filepaths to the emote images
          let emoteFilepaths = emoteFolders.reduce(
            (sum, dir) =>
              sum.concat(
                fs.readdirSync(dir).map(filename => path.join(dir, filename))
              ),
            []
          );

          // Send an emote image for everything that matches
          for (let tag of emoteTags) {
            // check SaEmotes
            const candidateFilenames = emoteFolders.reduce(
              (sum, dir) =>
                sum.concat(
                  fileExtensions.map(ext => path.join(dir, tag + ext))
                ),
              []
            );

            const filepath = emoteFilepaths.find(filepath =>
              candidateFilenames.find(
                candidateName => filepath === candidateName
              )
            );

            if (filepath) {
              await message.channel.send(new Discord.Attachment(filepath));
            }
          }
        }
      } catch (e) {
        e.data = { messageContent: message.content };
        reporter.error(e);
      }
    });
  }

  getDescription() {
    return 'Use emotes from some dead gay forum';
  }
}

module.exports = SaEmotes;
