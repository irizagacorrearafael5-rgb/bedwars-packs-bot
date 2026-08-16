const { EmbedBuilder } = require('discord.js');
const { searchResourcePacks } = require('./sources/modrinth');
const { classifyPack, isRelevant, getTags } = require('./classifier');
const { isPublished, markAsPublished } = require('./storage');

const SEARCH_TERMS = [
  'bedwars',
  'pvp',
  '16x',
  '32x',
  'short sword',
  'fps',
  'clean default'
];

// ID do canal onde os packs novos serão publicados.
// Depois vamos configurar isso via variável de ambiente.
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

async function runAutoSearch(client) {
  console.log('🔎 Iniciando busca automática de packs...');

  if (!CHANNEL_ID) {
    console.log('⚠️ Nenhum DISCORD_CHANNEL_ID configurado. Pulando publicação.');
    return;
  }

  const channel = await client.channels.fetch(CHANNEL_ID).catch(() => null);
  if (!channel) {
    console.log('⚠️ Canal não encontrado. Verifique o DISCORD_CHANNEL_ID.');
    return;
  }

  const foundIds = new Set();

  for (const term of SEARCH_TERMS) {
    try {
      const results = await searchResourcePacks(term, 10);

      for (const pack of results) {
        if (foundIds.has(pack.project_id)) continue;
        foundIds.add(pack.project_id);

        if (isPublished(pack.project_id)) continue;

        const fullText = `${pack.title} ${pack.description}`;
        const categories = classifyPack(fullText);

        if (!isRelevant(categories)) continue;

        const tags = getTags(categories);
        const packUrl = `https://modrinth.com/resourcepack/${pack.slug}`;

        const embed = new EmbedBuilder()
          .setTitle(pack.title)
          .setDescription(pack.description || 'Sem descrição disponível.')
          .setURL(packUrl)
          .addFields(
            { name: 'Categorias', value: tags.join(' ') || 'N/A' },
            { name: 'Downloads', value: String(pack.downloads ?? 'N/A'), inline: true }
          )
          .setColor(0x57f287)
          .setFooter({ text: 'Fonte: Modrinth' });

        if (pack.icon_url) {
          embed.setThumbnail(pack.icon_url);
        }

        await channel.send({ embeds: [embed] });
        markAsPublished(pack.project_id);

        console.log(`✅ Publicado: ${pack.title}`);
      }
    } catch (err) {
      console.error(`Erro ao buscar termo "${term}":`, err.message);
    }
  }

  console.log('🔎 Busca automática finalizada.');
}

module.exports = { runAutoSearch };
