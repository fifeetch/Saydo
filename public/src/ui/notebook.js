import { INITIAL_SECTIONS } from '../domain/notebook.js';
import { icon } from './icons.js';

export function tabs(selected) {
  return `<nav class="intercalaires" aria-label="Intercalaires">${INITIAL_SECTIONS.map(section => `<a class="tab ${section.color}" href="#/intercalaire/${section.id}" ${selected === section.id ? 'aria-current="page"' : ''}>${section.name}</a>`).join('')}</nav>`;
}

export function rings() {
  return `<div class="binding" aria-hidden="true">${Array.from({ length: 6 }, () => '<img src="/assets/ring.svg" alt="" width="100" height="34">').join('')}</div>`;
}

export function cover() {
  return `<main id="main" class="cover-scene" tabindex="-1">
    <div class="closed-notebook">
      ${tabs()}
      <div class="cover leather">
        <span class="cover-spine" aria-hidden="true"></span><span class="elastic" aria-hidden="true"></span>
        <div class="cover-heading"><p class="eyebrow">MON CAHIER PERSONNEL</p><h1>SayDo</h1><span class="embossed-line"></span></div>
        <div class="cover-notes"><div class="sticky rose welcome-note"><span class="tape" aria-hidden="true"></span><p>Tout commence<br>par une page<br>à soi.</p></div>
        <div class="little-note"><span class="little-note-title">Mon quotidien</span><span>Un peu d’espace.</span><span>Des idées au calme.</span><span>Tout simplement.</span></div></div>
        <a class="open-button" href="#/cahier">Ouvrir mon cahier ${icon('arrow')}</a>
        <span class="cover-edition">SAYDO · V2</span>
      </div>
    </div>
    <p class="cover-caption">Votre quotidien, à votre façon.</p>
  </main>`;
}

function todayPages() {
  const date = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  return `<section class="page page-left" aria-labelledby="page-title">
      <div class="page-heading"><p class="eyebrow">MON QUOTIDIEN</p><h1 id="page-title" tabindex="-1">Aujourd’hui</h1><p class="date">${date}</p></div>
      <div class="sticky rose greeting"><span class="tape" aria-hidden="true"></span><p>Bienvenue dans<br>votre cahier.</p><span>Un espace qui vous ressemble.</span></div>
      <div class="quiet-state">${icon('sun')}<h2>Une nouvelle page</h2><p>Votre cahier est prêt à accueillir<br>les petits et grands moments.</p></div>
      <a href="#/entree" class="inbox-link">${icon('inbox')}<span>Boîte d’entrée</span>${icon('arrow')}</a>
      <span class="page-number">01</span>
    </section>
    <section class="page page-right" aria-labelledby="sections-title"><div class="page-heading"><p class="eyebrow">À CHAQUE CHOSE SA PLACE</p><h2 id="sections-title" class="page-title">Mes intercalaires</h2><p class="date">Les différentes pages de votre vie.</p></div>
      <div class="section-list">${INITIAL_SECTIONS.map(section => `<a href="#/intercalaire/${section.id}" class="section-row"><span class="section-icon ${section.color}">${icon(section.icon)}</span><span>${section.name}</span>${icon('arrow')}</a>`).join('')}</div>
      <p class="handwritten page-thought">Un peu moins dans la tête,<br>un peu plus sur le papier.</p><span class="page-number">02</span>
    </section>`;
}

function contextPages(view) {
  const isInbox = view.kind === 'inbox';
  const name = isInbox ? 'Boîte d’entrée' : view.section.name;
  const color = isInbox ? 'sand' : view.section.color;
  return `<section class="page page-left" aria-labelledby="page-title"><div class="page-heading"><a href="#/cahier" class="back-link">← Aujourd’hui</a><h1 id="page-title" tabindex="-1" class="context-title ${color}">${icon(isInbox ? 'inbox' : view.section.icon)}${name}</h1></div>
    <div class="context-empty">${icon(isInbox ? 'inbox' : 'book')}<h2>${isInbox ? 'Un espace pour déposer' : 'Une page à remplir'}</h2><p>${isInbox ? 'Les contenus sans intercalaire trouveront ici leur place, avant d’être rangés.' : 'Vos futurs contenus liés à cet intercalaire seront réunis ici.'}</p></div><div class="ruled-space" aria-hidden="true"></div><span class="page-number">01</span></section>
    <section class="page page-right context-right"><div class="page-heading"><p class="eyebrow">${isInbox ? 'PRENDRE LE TEMPS DE RANGER' : 'VOTRE ESPACE ' + name.toLocaleUpperCase('fr-FR')}</p><h2 class="page-title">À votre rythme</h2></div><div class="sticky ${color} context-note"><span class="tape" aria-hidden="true"></span><p>${isInbox ? 'Déposer d’abord.<br>Ranger ensuite.' : 'Une place pour<br>ce qui compte.'}</p></div><p class="coming-next">La création de contenus arrivera<br>à la prochaine étape.</p><span class="page-number">02</span></section>`;
}

export function notebook(view) {
  return `<main id="main" class="notebook-scene" tabindex="-1"><div class="notebook leather">${tabs(view.section?.id)}<div class="pages">${view.kind === 'today' ? todayPages() : contextPages(view)}</div>${rings()}<button class="voice-button" data-dialog="voice" aria-label="La voix dans SayDo — à venir">${icon('mic')}</button></div><p class="edition-note">Votre cahier prend forme. Les outils d’écriture arrivent bientôt.</p></main>`;
}
