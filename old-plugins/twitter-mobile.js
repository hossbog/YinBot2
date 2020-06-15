const AbstractPlugin = require('./abstract-plugin')
const Discord = require('discord.js')
const Reporter = require('../lib/reporter.js')
// const requestHeaders = require('./shared/request-headers');
const { last, map } = require('ramda')

const BEEFY_GUILD_ID = '106690445328855040'
const TEST_GUILD_ID = '283748334311571457'
const WTT_GUILD_ID = '156528442446184448'
const allowedGuilds = [BEEFY_GUILD_ID, TEST_GUILD_ID, WTT_GUILD_ID]

const EMOJI_NAME = 'verified'
const reporter = new Reporter()

const { debug, error, info } = map(fn => fn.bind(console), console)

// DEPRECATED
class TwitterMobile extends AbstractPlugin {
  constructor(client) {
    return;

    super()
    reporter.register({
      userId: '268183210297393152',
      client
    })

    client.on('message', async message => {
      if (!(message.channel instanceof Discord.TextChannel)) return
      if (!allowedGuilds.includes(message.guild.id)) return

      try {
        const twitterAddrRegEx = /http(s?):\/\/mobile\.twitter\.com\/(\w+)\/status/
        if (!message.content.match(twitterAddrRegEx)) return
        const mobileTwitterRegEx = /http(s?):\/\/mobile\.twitter\.com\//

        const path = last(message.content.split(mobileTwitterRegEx))

        const response = `learn to post you dumb zoomer.\nhttps://twitter.com/${path}`
        debug('message.content.split(mobileTwitterRegEx)', message.content.split(mobileTwitterRegEx))
        info('response', response)

        message.reply(response)

      } catch (e) {
        e.data = { messageContent: message.content }
        reporter.error(e)
      }
    })
  }

  getDescription() {
    return 'because you\'re all a bunch of zoomer faggots'
  }
}

module.exports = TwitterMobile
