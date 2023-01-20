const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, Collection, Events, ActivityType } = require(`discord.js`);
// const ytdl = require(`ytdl-core`);
const dir = './songRequests/'
const query = require('./query');

const prefix = '!';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });

client.on("ready", () => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    console.log("Bloody Marry is online!");

    // client.user.setActivity("/help", { type: "PLAYING" });
    client.user.setPresence({ activities: [{ name: `/help`, type: ActivityType.Playing }] });
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`);
    }
}

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    query.execute(message);
});

client.on(Events.InteractionCreate, async interaction => {
    // if (interaction.message)
    // console.log(interaction);
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    // console.log(interaction);
});

// client.on("messageCreate", (message) => {
//     if(!message.content.startsWith(prefix) || message.author.bot) return;

//     const args = message.content.slice(prefix.length).split(/ +/);
//     const command = args.shift().toLowerCase();

//     //Message array
//     const messageArray = message.content.split(" ");
//     const argument = messageArray.slice(1);
//     const cmd = messageArray[0];

//     //Commands
//     if (command === 'ping') {
//         message.channel.send("Pong");
//     }

//     if (command === 'play') {
//         message.channel.send(message.author.username);
//     }

// });















client.login(process.env.TOKEN);