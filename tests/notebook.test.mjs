import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveView, contentsForSection, parseVoiceCommand, INITIAL_SECTIONS } from '../public/src/domain/notebook.js';

test('routes: cover, today, inbox, sections and safe unknown fallback', () => {
  assert.equal(resolveView('').kind, 'cover');
  assert.equal(resolveView('#/cahier').kind, 'today');
  assert.equal(resolveView('#/entree').kind, 'inbox');
  assert.equal(resolveView('#/intercalaire/famille').section.id, 'famille');
  assert.equal(resolveView('#/intercalaire/inconnu').kind, 'cover');
});
test('content type remains independent of section; unclassified content is inbox', () => {
  const records = [{ id: 'a', type: 'task', sectionId: 'famille' }, { id: 'b', type: 'note', sectionId: 'famille' }, { id: 'c', type: 'task', sectionId: null }];
  assert.deepEqual(contentsForSection(records, 'famille').map(x => x.id), ['a', 'b']);
  assert.deepEqual(contentsForSection(records, null).map(x => x.id), ['c']);
});
test('voice commands map explicit content to a known section without guessing', () => {
  const note = parseVoiceCommand('Créer une note dans Famille : appeler maman', INITIAL_SECTIONS);
  assert.equal(note.ok, true);
  assert.equal(note.draft.type, 'note');
  assert.equal(note.draft.sectionId, 'famille');
  assert.equal(note.draft.body, 'appeler maman');

  const missing = parseVoiceCommand('Créer un événement : dentiste', INITIAL_SECTIONS);
  assert.deepEqual(missing.missing, ['destination', 'date', 'heure']);
  assert.equal(missing.draft.sectionId, null);

  const event = parseVoiceCommand('Créer un événement dans Travail : réunion demain à 9h30', INITIAL_SECTIONS, new Date('2026-09-25T10:00:00'));
  assert.equal(event.draft.date, '2026-09-26');
  assert.equal(event.draft.time, '09:30');

  const unknown = parseVoiceCommand('Créer une liste dans Inconnu : pain, œufs', INITIAL_SECTIONS);
  assert.equal(unknown.ok, false);
  assert.match(unknown.reason, /n’existe pas/);
});
