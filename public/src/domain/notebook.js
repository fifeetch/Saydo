/** Context is independent of content type. Stable IDs will survive renaming. */
export const INITIAL_SECTIONS = [
  { id: 'famille', name: 'Famille', color: 'rose', icon: 'family' },
  { id: 'maison', name: 'Maison', color: 'sand', icon: 'home' },
  { id: 'personnel', name: 'Personnel', color: 'sage', icon: 'heart' },
  { id: 'travail', name: 'Travail', color: 'blue', icon: 'work' },
  { id: 'voyage', name: 'Voyage', color: 'lavender', icon: 'compass' },
];

export const CONTENT_TYPES = Object.freeze(['note', 'task', 'list', 'event', 'reminder', 'photo', 'document']);

/**
 * Future Firestore record: users/{uid}/contents/{id}.
 * @typedef {Object} Content
 * @property {string} id
 * @property {'note'|'task'|'list'|'event'|'reminder'|'photo'|'document'} type
 * @property {string|null} sectionId null means inbox; never infer from type.
 * @property {string} title
 * @property {string} body
 * @property {string} createdAt ISO date in the domain, Timestamp in Firestore.
 * @property {string} updatedAt
 */

export function resolveView(hash, sections = INITIAL_SECTIONS) {
  const route = hash.replace(/^#\/?/, '');
  if (route === 'cahier') return { kind: 'today' };
  if (route === 'entree') return { kind: 'inbox' };
  const section = sections.find(item => route === `intercalaire/${item.id}`);
  return section ? { kind: 'section', section } : { kind: 'cover' };
}

export function contentsForSection(contents, sectionId) {
  return contents.filter(content => content.sectionId === sectionId);
}

export function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr-FR').trim();
}

/** Parse only the explicit, deterministic syntax described by prompt 2. */
export function parseVoiceCommand(transcript, sections, now = new Date()) {
  const clean = transcript.trim().replace(/[.!?]+$/, '');
  const match = clean.match(/^(?:créer|creer|ajoute|ajouter)\s+(?:une?\s+)?(note|liste|événement|evenement|rendez-vous|fichier)(?:\s+dans\s+([^:]+?))?\s*:\s*(.*)$/iu);
  if (!match) return { ok: false, transcript, reason: 'Utilisez : « Créer [type] dans [intercalaire] : [contenu] ».' };
  const typeName = normalize(match[1]);
  const rawSection = match[2]?.trim();
  const section = rawSection && sections.find(item => normalize(item.name) === normalize(rawSection));
  if (rawSection && !section) return { ok: false, transcript, reason: `L’intercalaire « ${rawSection} » n’existe pas. Choisissez-en un dans la liste.` };
  const body = match[3].trim();
  const type = typeName === 'liste' ? 'list' : ['evenement', 'rendez-vous'].includes(typeName) ? 'event' : typeName;
  const draft = { type, sectionId: section?.id ?? null, title: '', body, items: type === 'list' ? body.split(/[,;\n]+/).map(x => x.trim()).filter(Boolean).map(text => ({ id: crypto.randomUUID(), text, done: false })) : [], date: '', time: '', location: '' };
  if (type === 'event') {
    const time = draft.body.match(/\b(?:à\s*)?(\d{1,2})\s*(?:h|:)(\d{2})?\b/i);
    const date = parseFrenchDate(draft.body, now);
    if (time) { draft.time = `${time[1].padStart(2, '0')}:${(time[2] || '00').padEnd(2, '0')}`; draft.body = draft.body.replace(time[0], ' ').replace(/\s+/g, ' ').trim(); }
    if (date) { draft.date = date.value; draft.body = draft.body.replace(date.raw, ' ').replace(/\s+/g, ' ').trim(); }
  }
  if (type === 'note') draft.title = body.slice(0, 48);
  if (type === 'list') draft.title = 'Ma liste';
  if (type === 'event') draft.title = draft.body || 'Nouvel événement';
  return { ok: true, draft, missing: [...(!section ? ['destination'] : []), ...(type === 'event' ? [!draft.date && 'date', !draft.time && 'heure'].filter(Boolean) : [])] };
}

function parseFrenchDate(value, now) {
  const iso = value.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) return { raw: iso[0], value: iso[0] };
  const numeric = value.match(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/);
  if (numeric) return { raw: numeric[0], value: `${numeric[3]}-${numeric[2].padStart(2, '0')}-${numeric[1].padStart(2, '0')}` };
  const relative = value.match(/\b(demain|aujourd’hui|aujourd'hui)\b/i);
  let target;
  if (relative) { target = new Date(now); if (normalize(relative[1]) === 'demain') target.setDate(target.getDate() + 1); }
  else {
    const weekdays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const match = value.match(/\b(?:ce\s+|prochain\s+)?(dimanche|lundi|mardi|mercredi|jeudi|vendredi|samedi)\b/i);
    if (!match) return null;
    target = new Date(now); const delta = (weekdays.indexOf(normalize(match[1])) - target.getDay() + 7) % 7 || 7; target.setDate(target.getDate() + delta);
    return { raw: match[0], value: localIso(target) };
  }
  return { raw: relative[0], value: localIso(target) };
}

function localIso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
