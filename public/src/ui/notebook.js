import { INITIAL_SECTIONS, contentsForSection } from '../domain/notebook.js';
import { icon } from './icons.js';

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}

export function tabs(sections = INITIAL_SECTIONS, selected) {
  return `<nav class="intercalaires" aria-label="Intercalaires">${sections.map(section => `<a class="tab ${escapeHtml(section.color)}" href="#/intercalaire/${encodeURIComponent(section.id)}" ${selected === section.id ? 'aria-current="page"' : ''}>${escapeHtml(section.name)}</a>`).join('')}<button class="tab-add" data-action="add-section">＋ Ajouter un onglet</button></nav>`;
}

export function rings() {
  return `<div class="binding" aria-hidden="true">${Array.from({ length: 6 }, () => '<img src="/assets/ring.svg" alt="" width="100" height="34">').join('')}</div>`;
}

export function cover(sections = INITIAL_SECTIONS) {
  return `<main id="main" class="cover-scene" tabindex="-1"><div class="closed-notebook">${tabs(sections)}<div class="cover leather">
    <span class="cover-spine" aria-hidden="true"></span><span class="elastic" aria-hidden="true"></span>
    <div class="cover-heading"><p class="eyebrow">MON CAHIER PERSONNEL</p><h1>SayDo</h1><span class="embossed-line"></span></div>
    <div class="cover-notes"><div class="sticky rose welcome-note"><span class="tape" aria-hidden="true"></span><p>Tout commence<br>par une page<br>à soi.</p></div><div class="little-note"><span class="little-note-title">Mon quotidien</span><span>Un peu d’espace.</span><span>Des idées au calme.</span><span>Tout simplement.</span></div></div>
    <a class="open-button" href="#/cahier">Ouvrir mon cahier ${icon('arrow')}</a><span class="cover-edition">SAYDO · V2</span>
  </div></div><p class="cover-caption">Votre quotidien, à votre façon.</p></main>`;
}

function getDestination(view) { return view.kind === 'section' ? view.section.id : null; }

function destinationName(content, sections) { return sections.find(x => x.id === content.sectionId)?.name || 'Boîte d’entrée'; }

function contentCard(content, sections) {
  const type = { note:'note', list:'liste', event:'événement', file:'fichier' }[content.type] || 'note';
  const color = { note:'rose', list:'sage', event:'orange', file:'blue' }[content.type] || 'rose';
  let inside = '';
  if (content.type === 'list') inside = `<ul class="saved-list">${content.items.map(item => `<li><label><input data-action="toggle-item" data-content="${escapeHtml(content.id)}" data-item="${escapeHtml(item.id)}" type="checkbox" ${item.done ? 'checked' : ''}><span class="${item.done ? 'done' : ''}">${escapeHtml(item.text)}</span></label></li>`).join('')}</ul>`;
  else if (content.type === 'event') inside = `<p class="saved-event-time">${icon('calendar')}<span>${new Intl.DateTimeFormat('fr-FR',{weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(new Date(`${content.date}T12:00:00`))} · ${escapeHtml(content.time)}</span></p>${content.location ? `<p class="content-detail">${icon('pin')}${escapeHtml(content.location)}</p>` : ''}${content.body ? `<p class="content-body">${escapeHtml(content.body)}</p>` : ''}`;
  else if (content.type === 'file') inside = `<p class="content-detail">${icon('paperclip')}${escapeHtml(content.fileName)} · ${formatBytes(content.fileSize)}</p>${content.body ? `<p class="content-body">${escapeHtml(content.body)}</p>` : ''}<button class="text-action" data-action="download-file" data-content="${escapeHtml(content.id)}">${icon('download')} Télécharger le fichier</button>`;
  else inside = `<p class="content-body">${escapeHtml(content.body)}</p>`;
  return `<article class="content-card ${color} content-${type}"><div class="content-card-heading">${icon({note:'note',list:'list',event:'calendar',file:'paperclip'}[content.type])}<div><p class="eyebrow">${type} · ${escapeHtml(destinationName(content, sections))}</p><h2>${escapeHtml(content.title || content.fileName || 'Sans titre')}</h2></div><button class="icon-action delete-content" data-action="delete-content" data-content="${escapeHtml(content.id)}" aria-label="Supprimer ${escapeHtml(content.title || type)}">${icon('trash')}</button></div>${inside}</article>`;
}

function savedContents(contents, sections, { today = false } = {}) {
  const shown = today ? contents.filter(item => item.type === 'event' && item.date === new Date().toISOString().slice(0,10)) : contents;
  return shown.length ? `<div class="content-list">${shown.map(item => contentCard(item,sections)).join('')}</div>` : '';
}

function todayPages(state) {
  const date = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const todayEvents = state.contents.filter(item => item.type === 'event' && item.date === new Date().toISOString().slice(0,10));
  return `<section class="page page-left" aria-labelledby="page-title"><div class="page-heading"><p class="eyebrow">MON QUOTIDIEN</p><h1 id="page-title" tabindex="-1">Aujourd’hui</h1><p class="date">${date}</p></div>
      ${todayEvents.length ? savedContents(state.contents,state.sections,{today:true}) : `<div class="sticky rose greeting"><span class="tape" aria-hidden="true"></span><p>Bienvenue dans<br>votre cahier.</p><span>Un espace qui vous ressemble.</span></div><div class="quiet-state">${icon('sun')}<h2>Une nouvelle page</h2><p>Votre cahier est prêt à accueillir<br>les petits et grands moments.</p></div>`}
      <a href="#/entree" class="inbox-link">${icon('inbox')}<span>Boîte d’entrée</span>${icon('arrow')}</a><span class="page-number">01</span></section>
    <section class="page page-right" aria-labelledby="sections-title"><div class="page-heading"><p class="eyebrow">À CHAQUE CHOSE SA PLACE</p><h2 id="sections-title" class="page-title">Mes intercalaires</h2><p class="date">Les différentes pages de votre vie.</p></div>
      <div class="section-list">${state.sections.map(section => `<a href="#/intercalaire/${encodeURIComponent(section.id)}" class="section-row"><span class="section-icon ${escapeHtml(section.color)}">${icon(section.icon)}</span><span>${escapeHtml(section.name)}</span>${icon('arrow')}</a>`).join('')}<button class="quiet-add-section" data-action="add-section">＋ Ajouter un onglet</button></div>
      <p class="handwritten page-thought">Un peu moins dans la tête,<br>un peu plus sur le papier.</p><span class="page-number">02</span></section>`;
}

function contextPages(view, state) {
  const isInbox = view.kind === 'inbox'; const section = view.section;
  const name = isInbox ? 'Boîte d’entrée' : section.name; const color = isInbox ? 'sand' : section.color;
  const contents = isInbox ? state.contents.filter(item => !item.sectionId) : contentsForSection(state.contents,section.id);
  return `<section class="page page-left" aria-labelledby="page-title"><div class="page-heading"><a href="#/cahier" class="back-link">← Aujourd’hui</a><div class="title-with-tools"><h1 id="page-title" tabindex="-1" class="context-title ${escapeHtml(color)}">${icon(isInbox ? 'inbox' : section.icon)}${escapeHtml(name)}</h1>${!isInbox ? `<button class="icon-action" data-action="rename-section" data-section="${escapeHtml(section.id)}" aria-label="Renommer ${escapeHtml(name)}">${icon('edit')}</button><button class="icon-action danger-action" data-action="delete-section" data-section="${escapeHtml(section.id)}" aria-label="Supprimer ${escapeHtml(name)}">${icon('trash')}</button>` : ''}</div></div>
    ${contents.length ? savedContents(contents,state.sections) : `<div class="context-empty">${icon(isInbox ? 'inbox' : 'book')}<h2>${isInbox ? 'Un espace pour déposer' : 'Une page à remplir'}</h2><p>${isInbox ? 'Les contenus sans intercalaire trouveront ici leur place, avant d’être rangés.' : 'Vos contenus liés à cet intercalaire seront réunis ici.'}</p></div><div class="ruled-space" aria-hidden="true"></div>`}<span class="page-number">01</span></section>
    <section class="page page-right context-right"><div class="page-heading"><p class="eyebrow">${isInbox ? 'PRENDRE LE TEMPS DE RANGER' : 'VOTRE ESPACE ' + escapeHtml(name.toLocaleUpperCase('fr-FR'))}</p><h2 class="page-title">À votre rythme</h2></div><div class="sticky ${escapeHtml(color)} context-note"><span class="tape" aria-hidden="true"></span><p>${isInbox ? 'Déposer d’abord.<br>Ranger ensuite.' : 'Une place pour<br>ce qui compte.'}</p></div><p class="coming-next">${contents.length ? `${contents.length} contenu${contents.length>1?'s':''} dans cet intercalaire.` : 'Chaque idée trouvera ici sa place.'}</p><span class="page-number">02</span></section>`;
}

export function notebook(view, state) {
  return `<main id="main" class="notebook-scene" tabindex="-1"><div class="notebook leather">${tabs(state.sections,view.section?.id)}<div class="pages">${view.kind === 'today' ? todayPages(state) : contextPages(view,state)}</div>${rings()}<button class="voice-button" data-action="voice" aria-label="Dicter une création">${icon('mic')}</button></div><p class="edition-note">${icon('plus')} <span>Ajoutez une note, une liste, un événement ou un fichier.</span></p></main>`;
}

export function formatBytes(size = 0) { return size < 1024 ? `${size} o` : size < 1048576 ? `${(size/1024).toFixed(0)} Ko` : `${(size/1048576).toFixed(1)} Mo`; }

export function formMarkup(type, state, selectedSection = '', draft = {}) {
  const config = {
    note: { title:'Nouvelle note', color:'rose', icon:'note', action:'Enregistrer' },
    list: { title:'Nouvelle liste', color:'sage', icon:'list', action:'Enregistrer' },
    event: { title:'Nouvel événement', color:'orange', icon:'calendar', action:'Enregistrer' },
    file: { title:'Ajouter un fichier', color:'blue', icon:'paperclip', action:'Ajouter' },
  }[type];
  const isVoice = Boolean(draft.transcript);
  const selected = Object.hasOwn(draft, 'sectionId') ? draft.sectionId : selectedSection;
  const sectionOptions = `<option value="">${isVoice ? 'Choisir un intercalaire' : 'Boîte d’entrée'}</option>${state.sections.map(section => `<option value="${escapeHtml(section.id)}" ${selected===section.id?'selected':''}>${escapeHtml(section.name)}</option>`).join('')}`;
  const field = (label,name,value = '',type='text',required=false,placeholder='') => `<label class="form-field"><span>${label}${required?' <b aria-hidden="true">*</b>':''}</span><input name="${name}" type="${type}" value="${escapeHtml(value)}" ${required?'required':''} ${placeholder?`placeholder="${escapeHtml(placeholder)}"`:''}></label>`;
  let fields = '';
  if (type === 'note') fields = `${field('Titre (facultatif)','title',draft.title,'text',false,'Ex. : Idée de week-end…')}<label class="form-field"><span>Écrire votre note <b aria-hidden="true">*</b></span><textarea name="body" rows="6" required placeholder="Écrire votre note…">${escapeHtml(draft.body)}</textarea></label>`;
  if (type === 'list') fields = `${field('Titre de la liste','title',draft.title,'text',true,'Ex. : Courses, À faire…')}<div class="list-editor" data-items>${(draft.items?.length?draft.items:[{id:crypto.randomUUID(),text:'',done:false}]).map((item,index)=>listInput(item,index)).join('')}</div><button type="button" class="quiet-add-section" data-action="add-item">＋ Ajouter un élément</button>`;
  if (type === 'event') fields = `${field('Titre de l’événement','title',draft.title,'text',true,'Ex. : Rendez-vous, Réunion…')}<div class="field-row">${field('Date','date',draft.date,'date',true)}${field('Heure','time',draft.time,'time',true)}</div>${field('Lieu (facultatif)','location',draft.location,'text',false,'Ex. : Cabinet médical…')}<label class="form-field"><span>Notes (facultatif)</span><textarea name="body" rows="3" placeholder="Ajouter des détails…">${escapeHtml(draft.body)}</textarea></label>`;
  if (type === 'file') fields = `<label class="file-drop"><input type="file" name="upload" required><span class="file-drop-icon">${icon('upload')}</span><strong>Choisir un fichier</strong><span>PDF, image ou document. Enregistré dans votre espace Firebase.</span><span class="chosen-file" data-file-name>Aucun fichier choisi</span></label>${field('Nom du fichier (facultatif)','title',draft.title,'text',false,'Ex. : Facture, Photo, Document…')}<label class="form-field"><span>Ajouter une note (facultatif)</span><textarea name="body" rows="3" placeholder="Décrire ce fichier…">${escapeHtml(draft.body)}</textarea></label>`;
  const typeLabels={note:'Note',list:'Liste',event:'Événement',file:'Fichier'};
  const requiredMissing=draft.missing?.length?`<p class="form-notice">À compléter avant d’enregistrer : ${draft.missing.map(x=>x==='destination'?'intercalaire':x).join(', ')}.</p>`:'';
  return `<form class="editor-form ${config.color}" data-form="content" data-type="${type}" data-voice="${isVoice?'true':'false'}"><div class="form-banner ${config.color}">${icon(config.icon)}<span>${typeLabels[type]}</span><span class="form-step">${isVoice?'Vérifier la commande':'Nouvelle page'}</span></div>${isVoice?`<div class="transcript-chip"><span class="eyebrow">TRANSCRIPTION · À RELIRE</span><p>${escapeHtml(draft.transcript)}</p><input type="hidden" name="transcript" value="${escapeHtml(draft.transcript)}"></div>`:''}${requiredMissing}${fields}<label class="form-field destination-field"><span>Ranger dans l’intercalaire</span><select name="sectionId" required><option value="__inbox__" ${selected===null?'selected':''}>Boîte d’entrée</option>${state.sections.map(section=>`<option value="${escapeHtml(section.id)}" ${selected===section.id?'selected':''}>${escapeHtml(section.name)}</option>`).join('')}</select></label><div class="form-actions"><button type="button" class="secondary-button" data-action="back-choice">Annuler</button><button class="submit-button ${config.color}" type="submit">${config.action}</button></div></form>`;
}

function listInput(item,index) { return `<label class="list-input-row"><span class="list-number">${index+1}</span><input name="item" value="${escapeHtml(item.text)}" placeholder="Élément à ajouter" aria-label="Élément ${index+1}" required><button type="button" data-action="remove-item" aria-label="Supprimer l’élément ${index+1}">${icon('trash')}</button></label>`; }

export function choiceMarkup() {
  return `<section class="choice-screen"><p class="eyebrow">UNE NOUVELLE PAGE</p><h2 id="dialog-title">Que souhaitez-vous ajouter ?</h2><p class="choice-subtitle">Choisissez le contenu à glisser dans votre cahier.</p><div class="choice-grid">${[
    ['note','Note','Idées, réflexions, informations…','rose'],['list','Liste','Tâches, courses, à faire…','sage'],['event','Événement','Rendez-vous, dans l’agenda…','orange'],['file','Fichier','Document, photo, pièce jointe…','blue']
  ].map(([type,title,description,color])=>`<button class="choice-tile ${color}" data-action="choose-type" data-type="${type}">${icon({note:'note',list:'list',event:'calendar',file:'paperclip'}[type])}<span class="choice-label">${title}</span><span class="choice-description">${description}</span></button>`).join('')}</div></section>`;
}

export function messageMarkup(title, message, transcript = '') {
  return `<section class="choice-screen voice-result"><div class="voice-result-icon">${icon('mic')}</div><p class="eyebrow">COMMANDE VOCALE · SANS IA</p><h2 id="dialog-title">${escapeHtml(title)}</h2><p class="choice-subtitle">${escapeHtml(message)}</p>${transcript?`<label class="form-field"><span>Transcription à corriger ou réessayer</span><textarea name="voice-transcript" rows="3">${escapeHtml(transcript)}</textarea></label>`:''}<div class="form-actions"><button type="button" class="secondary-button" data-action="back-choice">Annuler</button>${transcript?'<button type="button" class="submit-button blue" data-action="parse-again">Analyser cette phrase</button>':''}</div></section>`;
}
