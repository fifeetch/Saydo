import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveView, contentsForSection } from '../public/src/domain/notebook.js';
import { readHostingConfiguration } from '../public/src/services/firebase.js';

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
test('Firebase foundation tolerates missing web app and rejects wrong project', async () => {
  assert.equal(await readHostingConfiguration(async () => new Response('', { status: 404 })), null);
  assert.equal(await readHostingConfiguration(async () => new Response('<html></html>', { headers: { 'content-type': 'text/html' } })), null);
  await assert.rejects(readHostingConfiguration(async () => Response.json({ projectId: 'wrong-project' })));
  assert.equal((await readHostingConfiguration(async () => Response.json({ projectId: 'saydo-helper' }))).projectId, 'saydo-helper');
});
