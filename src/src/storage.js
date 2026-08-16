const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'published.json');

/**
 * Garante que o arquivo de dados exista.
 */
function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ published: [] }, null, 2));
  }
}

/**
 * Carrega a lista de IDs de packs já publicados.
 */
function loadPublished() {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const data = JSON.parse(raw);
  return data.published || [];
}

/**
 * Verifica se um pack (pelo id) já foi publicado.
 */
function isPublished(packId) {
  const published = loadPublished();
  return published.includes(packId);
}

/**
 * Marca um pack como publicado.
 */
function markAsPublished(packId) {
  ensureFile();
  const published = loadPublished();
  if (!published.includes(packId)) {
    published.push(packId);
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ published }, null, 2)
    );
  }
}

module.exports = {
  loadPublished,
  isPublished,
  markAsPublished
};
