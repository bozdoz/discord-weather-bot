const Discord = require('discord.js')
const WeatherAdapter = require('./weather-adapter')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const prefix = '!'
const command = process.env.COMMAND || 'weather'
const regex = new RegExp(`^${prefix}${command}\\s*(?<args>.*)?\\s*$`, 'i')
const helpText = [
  `Maybe try adding a city? \`!${command} halifax\``,
  // `Maybe try adding a forecast? \`!${command} dartmouth tomorrow\``,
  // `Maybe try asking politely? \`!${command} pei next week please\``,
]

const random = (arr) => arr[Math.floor(Math.random() * arr.length)]

client.on('message', async (msg) => {
  const { content } = msg
  const match = content.match(regex)

  if (!match) {
    return
  }

  const { args } = match.groups

  if (!args) {
    msg.channel.send(random(helpText))
    return
  }

  // assume city
  if (args) {
    try {
      const weatherMessage = await new WeatherAdapter().get(args)
      msg.channel.send(weatherMessage)
      msg.react('🤖')
    } catch (e) {
      console.error(e)
      msg.react('😭')
      msg.channel.send('Failed to parse the location')
    }
    return
  }
})

client.login(process.env.TOKEN)
