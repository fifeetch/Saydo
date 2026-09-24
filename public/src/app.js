import { resolveView } from './domain/notebook.js';
import { cover, notebook } from './ui/notebook.js';
import { icon } from './ui/icons.js';

const app = document.querySelector('#app');
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#main').focus();
});
let firstRender = true;
function render() {
  const view = resolveView(location.hash);
  document.title = `${view.section?.name || (view.kind === 'inbox' ? 'Boîte d’entrée' : view.kind === 'today' ? 'Aujourd’hui' : 'Mon cahier personnel')} — SayDo`;
  app.innerHTML = `<header class="app-header"><a href="#/" class="wordmark" aria-label="SayDo, fermer le cahier">SayDo<span>MON CAHIER PERSONNEL</span></a><nav class="header-nav" aria-label="Navigation principale">${view.kind !== 'cover' ? `<a href="#/cahier" aria-label="Aujourd’hui" ${view.kind === 'today' ? 'aria-current="page"' : ''}>${icon('sun')}<span>Aujourd’hui</span></a><a href="#/entree" aria-label="Boîte d’entrée" ${view.kind === 'inbox' ? 'aria-current="page"' : ''}>${icon('inbox')}<span>Boîte d’entrée</span></a>` : ''}<button class="menu-button" data-dialog="about" aria-label="À propos de mon cahier">${icon('menu')}</button></nav></header>${view.kind === 'cover' ? cover() : notebook(view)}<footer class="app-footer"><span>Un cahier. Votre univers.</span><button data-dialog="about">SayDo V2 · Premières pages</button></footer><dialog aria-labelledby="dialog-title"><form method="dialog"><button class="dialog-close" aria-label="Fermer">${icon('close')}</button><div id="dialog-content"></div><button class="dialog-done">Revenir au cahier</button></form></dialog>`;
  if (!firstRender) (document.querySelector('#page-title') || document.querySelector('#main')).focus({ preventScroll: true });
  firstRender = false;
}

app.addEventListener('click', event => {
  const button = event.target.closest('[data-dialog]');
  if (!button) return;
  const voice = button.dataset.dialog === 'voice';
  document.querySelector('#dialog-content').innerHTML = voice
    ? `${icon('mic')}<h2 id="dialog-title">Parler à son cahier</h2><p>La voix aura une place centrale dans SayDo : déposer une idée ou une tâche, simplement en parlant.</p><p>Cette fonction sera ajoutée lors d’une prochaine étape. Le microphone n’est pas activé.</p>`
    : `${icon('book')}<h2 id="dialog-title">Les premières pages</h2><p>Bienvenue dans SayDo V2, votre cahier personnel numérique.</p><p>Cette première version pose les fondations : ouvrir votre cahier, parcourir ses intercalaires et découvrir la boîte d’entrée.</p><p>Les contenus, la personnalisation des intercalaires, la voix et la synchronisation seront ajoutés progressivement. Aucune donnée personnelle n’est enregistrée pour le moment.</p>`;
  document.querySelector('dialog').showModal();
});
window.addEventListener('hashchange', render);
render();
