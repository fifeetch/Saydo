/** Context is independent of content type. Stable IDs will survive renaming. */
export const INITIAL_SECTIONS = Object.freeze([
  { id: 'famille', name: 'Famille', color: 'rose', icon: 'family' },
  { id: 'maison', name: 'Maison', color: 'sand', icon: 'home' },
  { id: 'personnel', name: 'Personnel', color: 'sage', icon: 'heart' },
  { id: 'travail', name: 'Travail', color: 'blue', icon: 'work' },
  { id: 'voyage', name: 'Voyage', color: 'lavender', icon: 'compass' },
]);

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
