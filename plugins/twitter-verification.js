const AbstractPlugin = require('./abstract-plugin')
const Discord = require('discord.js')
const Reporter = require('../lib/reporter.js')
const cheerio = require('cheerio')
const request = require('request-promise-native')
// const requestHeaders = require('./shared/request-headers');
const stringify = require('json-stringify-safe')
const { map } = require('ramda')

const BEEFY_GUILD_ID = '106690445328855040'
const TEST_GUILD_ID = '283748334311571457'
const WTT_GUILD_ID = '156528442446184448'
const allowedGuilds = [BEEFY_GUILD_ID, TEST_GUILD_ID, WTT_GUILD_ID]

const EMOJI_NAME = 'verified'
const reporter = new Reporter()

const { debug, error, info } = map(fn => fn.bind(console), console)

class TwitterVerification extends AbstractPlugin {
  constructor(client) {
    super()
    // reporter.register({
    //   userId: '268183210297393152',
    //   client
    // });

    client.on('message', async message => {
      if (!(message.channel instanceof Discord.TextChannel)) return
      if (!allowedGuilds.includes(message.guild.id)) return

      try {
        const twitterAddrRegEx = /http(s?):\/\/(.*)twitter\.com\/(\w+)\/status/
        if (!message.content.match(twitterAddrRegEx)) return

        const tweetUri = this.getUri(message)
        const tweetId = this.getId(message)

        const $ = await request({
          uri: tweetUri,
          transform: body => cheerio.load(body)
        })

        if ($('.permalink-header .Icon--verified')[0]) {
          const bluecheck = await message.guild.emojis.find(
            emoji => emoji.name === EMOJI_NAME
          )
          if (!bluecheck) {
            throw new Error(`Emoji name :${EMOJI_NAME}: not found!`)
          }
          await message.react(bluecheck)
        }

      } catch (e) {
        e.data = { messageContent: message.content }
        reporter.error(e)
      }
    })
  }

  getDescription() {
    return 'Literally who?'
  }

  getId(message) {
    const id = message.content.split('/status/')[1].split('?')[0]
    return id
  }

  getUri(message) {
    const host = 'http://www.twitter.com'
    const path = message.content.split('twitter.com')[1].split(' ')[0]
    return host + path
  }
}

module.exports = TwitterVerification
