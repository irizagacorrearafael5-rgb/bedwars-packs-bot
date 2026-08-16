require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const cron = require('node-cron');
const { runAutoSearch } = require('./src/autoSearch');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);

  // Roda a busca automática assim que o bot liga
  runAutoSearch(client);

  // Depois roda a cada 30 minutos
  cron.schedule('*/30 * * * *', () => {
    runAutoSearch(client);
  });
});

client.login(process.env.DISCORD_TOKEN);
