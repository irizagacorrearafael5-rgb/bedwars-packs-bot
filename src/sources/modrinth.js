const fetch = require('node-fetch');

const BASE_URL = 'https://api.modrinth.com/v2';

/**
 * Busca resource packs no Modrinth relacionados a termos específicos.
 * @param {string} query - termo de busca (ex: "bedwars", "pvp", "16x")
 * @param {number} limit - quantidade de resultados
 */
async function searchResourcePacks(query, limit = 20) {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    facets: JSON.stringify([['project_type:resourcepack']])
  });

  const url = `${BASE_URL}/search?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'bedwars-packs-bot/1.0 (Discord bot)'
    }
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar no Modrinth: ${response.status}`);
  }

  const data = await response.json();
  return data.hits || [];
}

/**
 * Busca detalhes completos de um projeto específico pelo slug/id.
 */
async function getProjectDetails(idOrSlug) {
  const url = `${BASE_URL}/project/${idOrSlug}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'bedwars-packs-bot/1.0 (Discord bot)'
    }
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar projeto no Modrinth: ${response.status}`);
  }

  return response.json();
}

module.exports = {
  searchResourcePacks,
  getProjectDetails
};
