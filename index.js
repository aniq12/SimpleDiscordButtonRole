const { Client, Intents, MessageButton, MessageActionRow } = require('discord.js');
const { prefix, token, roleId, emojiId } = require('./config.json');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCES
    ]
})

client.on('ready', async () => {
    console.log('Ready!');
    client.user.setActivity(``, { type: "LISTENING" })
    client.user.setStatus('online') //online, dnd, idle
})

client.on('messageCreate', async (msg) => {
    const args = msg.content.slice(prefix.length).trim().split(/ +/).filter(Boolean);
    if (msg.content.startsWith(prefix)) {
        if (args[0] === `send`) {
            const channel = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[1]);
            if (!channel) return msg.reply('Please provide a valid channel mention or ID.');
            const button = new MessageButton()
                .setCustomId('verify-button')
                .setLabel('Verify')
                .setStyle('SUCCESS')
                .setEmoji(emojiId)
            const row = new MessageActionRow()
                .setComponents([button])
            channel.send({ content: 'Click button below to verify', components: [row] })
            msg.reply('Successfully sent message')
        }
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return
    const { customId, guild, member } = interaction
    if (customId === 'verify-button') {
        await member.roles.add(roleId).catch(e => console.error(e))
        interaction.reply({ content: 'Success', ephemeral: true })
    }
})

client.login(token)
