const Discord = require('discord.js')
const WeatherAdapter = require('./weather-adapter')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const DEV = process.env.DEV

// dev mode is '?'; otherwise '!'
const prefix = DEV === 'true' ? '\\?' : '!'

// 'weather' is ideal, but we'll also accept 'leather' or 'feather'
const idealCommand = 'weather'

// regex is crazy, just believe it works
const commandRegex = new RegExp(
  `^${prefix}(?<command>\\w+${idealCommand.substr(1)})\\s*(?<args>.*)?\\s*$`,
  'i'
)

// help text in case no args are passed
const helpText = [
  `Maybe try adding a city? \`!%command% halifax\``,
  // `Maybe try adding a forecast? \`!%command% dartmouth tomorrow\``,
  // `Maybe try asking politely? \`!%command% pei next week please\``,
]

// fail texts in case something goes wrong
/** @type {{text: string, react?: string}[]} */
const failTexts = [
  {
    text: 'dunno what dat is',
    react: '🤷‍♀️',
  },
  {
    text: `that didn't work; maybe try again`,
  },
  {
    text: `I have no idea. Rain maybe?`,
    react: '🌦',
  },
]

// reveal who made the bot
const daddyRegex = new RegExp(`who('s| is) y(ou|e|uo|o)r daddy`, 'i')
const daddy = process.env.DADDY

/**
 * Let the people know who created you
 * @param {Discord.Message} msg
 */
const sendDaddyMessage = async (msg) => {
  if (daddy) {
    msg.reply(`👉 <@${daddy}>`)
  } else {
    // just in case I fail to update the env variable with my user id
    const sent = await msg.reply(
      'My father left to pick up cigarettes 23 years ago'
    )

    sent.react('😭')
  }
}

/**
 * @template T
 * @param {Array<T>} arr
 * @returns T
 */
const random = (arr) => arr[Math.floor(Math.random() * arr.length)]

client.on('message', async (msg) => {
  const { content, mentions, author } = msg

  // don't listen to yourself
  if (author.id === client.user.id) {
    // it me!
    return
  }

  // if mentioned directly, send a DM
  if (mentions.users.has(client.user.id)) {
    msg.react('👋')

    // who's your daddy?
    if (daddyRegex.test(content)) {
      sendDaddyMessage(msg)
    } else {
      author.send('Listen here you little shit')
    }

    return
  }

  const match = content.match(commandRegex)

  if (!match) {
    // no command/args found
    return
  }

  const { args, command } = match.groups

  // change nickname if mispelling first letter(s)
  const capitalized = capitalize(command)
  // change nickname in guild/server
  const member = msg.guild.member(client.user)
  if (member && member.nickname !== capitalized) {
    member.setNickname(capitalized).catch((e) => {
      console.log('failed setting nickname', command)
      console.error(String(e))
    })
  }

  // send help text if no args
  if (!args) {
    msg.channel.send(random(helpText).replace('%command%', command))
    return
  }

  // say hi
  if (['hi', 'hello', `what's up`, 'howdy'].includes(args.toLowerCase())) {
    msg.reply('Oh! Hey! Fuck you!')
    return
  }

  // who's your daddy?
  if (daddyRegex.test(args)) {
    return sendDaddyMessage(msg)
  }

  // assume city (or equivalent) is provided
  try {
    const weatherMessage = await new WeatherAdapter().get(args)

    msg.channel.send(weatherMessage)
    msg.react('🤖')
  } catch (e) {
    console.error(e)

    msg.react('😭')

    const failMessage = random(failTexts)
    const sent = await msg.reply(failMessage.text)

    if (failMessage.react) {
      sent.react(failMessage.react)
    }
  }
})

const capitalize = (str) =>
  str
    .split(' ')
    .map((word) => word.substr(0, 1).toUpperCase() + word.substr(1))
    .join(' ')

client.login(process.env.TOKEN)
