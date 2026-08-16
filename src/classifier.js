/**
 * Analisa o texto (nome + descrição) de um pack e retorna as categorias
 * detectadas, com base em palavras-chave.
 */
function classifyPack(text) {
  const t = text.toLowerCase();

  const categories = {
    res16x: /\b16x\b|16x16/.test(t),
    res32x: /\b32x\b|32x32/.test(t),
    pvp: /\bpvp\b/.test(t),
    bedwars: /bedwars|bed wars/.test(t),
    shortSwords: /short\s?sword/.test(t),
    fps: /\bfps\b|low\s?end|leve|lightweight|performance|optimi[sz]ed/.test(t),
    cleanDefault: /clean|default\s?edit|vanilla/.test(t),
    mc189: /1\.8\.9|1\.8/.test(t)
  };

  return categories;
}

/**
 * Verifica se um pack é relevante o suficiente para ser publicado.
 */
function isRelevant(categories) {
  return (
    categories.res16x ||
    categories.res32x ||
    categories.pvp ||
    categories.bedwars ||
    categories.shortSwords ||
    categories.fps ||
    categories.cleanDefault
  );
}

/**
 * Monta uma lista de emojis/tags para exibição no Discord.
 */
function getTags(categories) {
  const tags = [];
  if (categories.res16x) tags.push('🟦 16x16');
  if (categories.res32x) tags.push('🟩 32x32');
  if (categories.pvp) tags.push('⚔️ PvP');
  if (categories.bedwars) tags.push('🛏️ BedWars');
  if (categories.shortSwords) tags.push('🗡️ Short Swords');
  if (categories.fps) tags.push('🚀 FPS');
  if (categories.cleanDefault) tags.push('🎨 Clean/Default Edit');
  return tags;
}

module.exports = {
  classifyPack,
  isRelevant,
  getTags
};
