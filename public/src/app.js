import { resolveView, parseVoiceCommand, normalize } from './domain/notebook.js';
import { cover, notebook, choiceMarkup, formMarkup, messageMarkup } from './ui/notebook.js';
import { icon } from './ui/icons.js';
import { addSection, deleteContent, ensureDefaultSections, removeSectionToInbox, renameSection, saveContent, subscribeNotebook, updateContent } from './services/notebook-store.js';
import { auth, readableFirebaseError, signIn, signOutUser, subscribeToUser } from './services/firebase.js';

const app=document.querySelector('#app');
const dialog=document.querySelector('#dialog');
document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();document.querySelector('#main')?.focus();});
let currentUser=null; let notebookState={sections:[],contents:[]}; let stopNotebook=null; let firstRender=true; let activeDraft=null;
const showError=message=>{const region=document.querySelector('[role="status"]');if(region)region.textContent=message;};
const escape=(value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const currentSectionId=()=>resolveView(location.hash,notebookState.sections).section?.id || '';

function render(){
  const view=resolveView(location.hash,notebookState.sections);
  const pageName=view.section?.name || (view.kind==='inbox'?'Boîte d’entrée':view.kind==='today'?'Aujourd’hui':'Mon cahier personnel');
  document.title=`${pageName} — SayDo`;
  if(!currentUser){
    app.innerHTML=`<header class="app-header"><a href="#/" class="wordmark">SayDo<span>MON CAHIER PERSONNEL</span></a></header><main id="main" class="sign-in-scene"><section class="sign-in-card leather"><p class="eyebrow">VOTRE CAHIER PERSONNEL</p><h1>SayDo</h1><p>Notes, listes, rendez-vous et fichiers, réunis dans votre cahier.</p><form class="login-form" data-form="sign-in"><label class="form-field"><span>Adresse e-mail</span><input type="email" name="email" autocomplete="username" required></label><label class="form-field"><span>Mot de passe</span><input type="password" name="password" autocomplete="current-password" required></label><button class="google-button" type="submit">Se connecter</button></form><p class="privacy-note">Vos contenus sont enregistrés dans votre espace Firebase privé.</p><p class="auth-error" role="status" aria-live="polite"></p></section></main><footer class="app-footer"><span>Un cahier. Votre univers.</span><span>SayDo V2</span></footer>`;
    firstRender=false;return;
  }
  app.innerHTML=`<header class="app-header"><a href="#/" class="wordmark" aria-label="SayDo — couverture">SayDo<span>MON CAHIER PERSONNEL</span></a><nav class="header-nav" aria-label="Navigation principale"><a href="#/cahier" aria-label="Aujourd’hui" ${view.kind==='today'?'aria-current="page"':''}>${icon('sun')}<span>Aujourd’hui</span></a><a href="#/entree" aria-label="Boîte d’entrée" ${view.kind==='inbox'?'aria-current="page"':''}>${icon('inbox')}<span>Boîte d’entrée</span></a><button class="top-mic" data-action="voice" aria-label="Dicter un contenu">${icon('mic')}</button><button class="add-button" data-action="open-choices">${icon('plus')}<span>Ajouter</span></button><button class="menu-button" data-action="account-menu" aria-label="Compte : ${escape(currentUser.displayName||currentUser.email||'Google')}">${escape((currentUser.displayName||currentUser.email||'S').slice(0,1).toLocaleUpperCase('fr-FR'))}</button></nav></header>${view.kind==='cover'?cover(notebookState.sections):notebook(view,notebookState)}<div class="app-status" role="status" aria-live="polite"></div><footer class="app-footer"><span>Un cahier. Votre univers.</span><span>Enregistré dans Firebase · ${escape(currentUser.email||'Compte Google')}</span></footer>`;
  if(!firstRender) (document.querySelector('#page-title')||document.querySelector('#main'))?.focus({preventScroll:true});
  firstRender=false;
}

function openDialog(markup){dialog.innerHTML=`<div class="dialog-shell"><button type="button" class="dialog-close" data-action="back-choice" aria-label="Fermer">${icon('close')}</button><div class="dialog-content">${markup}</div></div>`;dialog.showModal();}
function closeDialog(){if(dialog.open)dialog.close();}
function showChoice(){activeDraft=null;openDialog(choiceMarkup());}
function showForm(type,draft={}){activeDraft=draft;openDialog(formMarkup(type,notebookState,currentSectionId(),draft));}
function parseTranscript(transcript){
  const result=parseVoiceCommand(transcript,notebookState.sections);
  if(!result.ok){openDialog(messageMarkup('Je n’ai pas assez d’informations',result.reason,transcript));return;}
  const draft={...result.draft,transcript,missing:result.missing};
  showForm(draft.type==='file'?'file':draft.type,draft);
}

function listenByVoice(){
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRecognition){openDialog(messageMarkup('Dictée non disponible','La reconnaissance vocale n’est pas disponible dans ce navigateur. Vous pouvez tout de même créer un contenu avec le bouton « Ajouter ».'));return;}
  openDialog(messageMarkup('Je vous écoute','Dites une commande simple, par exemple : « Créer une note dans Famille : appeler maman dimanche. »'));
  const status=dialog.querySelector('.choice-subtitle');status.textContent='Le microphone va s’activer. Parlez après le bip.';
  const recognition=new SpeechRecognition();recognition.lang='fr-FR';recognition.interimResults=false;recognition.maxAlternatives=1;
  const micButton=document.createElement('button');micButton.type='button';micButton.className='voice-listen-button';micButton.textContent='Démarrer la dictée';status.after(micButton);
  micButton.addEventListener('click',()=>{micButton.disabled=true;micButton.textContent='J’écoute…';recognition.start();});
  recognition.onresult=event=>parseTranscript(event.results[0][0].transcript);
  recognition.onerror=event=>{const note=dialog.querySelector('.choice-subtitle');if(note)note.textContent=event.error==='not-allowed'?'Autorisez le microphone dans les réglages du navigateur puis recommencez.':'La dictée n’a pas abouti. Réessayez ou utilisez « Ajouter ».';if(micButton){micButton.disabled=false;micButton.textContent='Réessayer';}};
  recognition.onend=()=>{if(micButton?.isConnected){micButton.disabled=false;micButton.textContent='Parler à nouveau';}};
}

subscribeToUser(async user=>{
  stopNotebook?.();stopNotebook=null;currentUser=user;notebookState={sections:[],contents:[]};
  if(user){
    try{await ensureDefaultSections(user.uid);stopNotebook=subscribeNotebook(user.uid,state=>{notebookState=state;render();},error=>{render();showError(readableFirebaseError(error));});}
    catch(error){render();showError(readableFirebaseError(error));return;}
  }
  render();
});

document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-action]');if(!button)return;
  const action=button.dataset.action;
  try{
    if(action==='open-choices'){showChoice();return;}
    if(action==='choose-type'){showForm(button.dataset.type);return;}
    if(action==='voice'){listenByVoice();return;}
    if(action==='back-choice'){closeDialog();return;}
    if(action==='parse-again'){const phrase=dialog.querySelector('[name="voice-transcript"]').value;parseTranscript(phrase);return;}
    if(action==='add-item'){
      const list=dialog.querySelector('[data-items]');const index=list.querySelectorAll('.list-input-row').length;
      list.insertAdjacentHTML('beforeend',`<label class="list-input-row"><span class="list-number">${index+1}</span><input name="item" placeholder="Élément à ajouter" aria-label="Élément ${index+1}" required><button type="button" data-action="remove-item" aria-label="Supprimer l’élément ${index+1}">${icon('trash')}</button></label>`);list.lastElementChild.querySelector('input').focus();return;
    }
    if(action==='remove-item'){if(dialog.querySelectorAll('.list-input-row').length>1)button.closest('.list-input-row').remove();dialog.querySelectorAll('.list-input-row').forEach((row,index)=>{row.querySelector('.list-number').textContent=index+1;row.querySelector('input').ariaLabel=`Élément ${index+1}`;});return;}
    if(action==='rename-section'){
      const id=button.dataset.section;const section=notebookState.sections.find(item=>item.id===id);if(!section)return;
      openDialog(`<section class="choice-screen"><p class="eyebrow">INTERCALAIRE</p><h2 id="dialog-title">Renommer</h2><label class="form-field"><span>Nom de l’intercalaire</span><input name="new-section-name" value="${escape(section.name)}" maxlength="40" required></label><div class="form-actions"><button class="secondary-button" type="button" data-action="back-choice">Annuler</button><button class="submit-button sage" type="button" data-action="save-rename" data-section="${escape(id)}">Enregistrer</button></div></section>`);return;
    }
    if(action==='save-rename'){
      const field=dialog.querySelector('[name="new-section-name"]');const name=field.value.trim();if(!name){field.reportValidity();return;}if(notebookState.sections.some(item=>item.id!==button.dataset.section&&normalize(item.name)===normalize(name))){field.setCustomValidity('Un intercalaire porte déjà ce nom.');field.reportValidity();field.setCustomValidity('');return;}
      await renameSection(currentUser.uid,button.dataset.section,name);closeDialog();return;
    }
    if(action==='delete-section'){
      const id=button.dataset.section;const section=notebookState.sections.find(item=>item.id===id);if(!section)return;
      const count=notebookState.contents.filter(item=>item.sectionId===id).length;
      openDialog(`<section class="choice-screen"><p class="eyebrow">CONFIRMATION</p><h2 id="dialog-title">Supprimer « ${escape(section.name)} » ?</h2><p class="choice-subtitle">${count?`${count} contenu${count>1?'s':''} seront déplacés dans la boîte d’entrée avant la suppression.`:'Cet intercalaire est vide.'} Les contenus ne seront pas effacés.</p><div class="form-actions"><button class="secondary-button" type="button" data-action="back-choice">Garder</button><button class="submit-button orange" type="button" data-action="confirm-delete-section" data-section="${escape(id)}">Déplacer et supprimer</button></div></section>`);return;
    }
    if(action==='confirm-delete-section'){button.disabled=true;await removeSectionToInbox(currentUser.uid,button.dataset.section);closeDialog();if(location.hash.includes(button.dataset.section))location.hash='#/cahier';return;}
    if(action==='add-section'){
      openDialog(`<section class="choice-screen"><p class="eyebrow">UN NOUVEL ESPACE</p><h2 id="dialog-title">Ajouter un intercalaire</h2><label class="form-field"><span>Nom de l’intercalaire</span><input name="new-section-name" maxlength="40" placeholder="Ex. : Études" required></label><div class="form-actions"><button type="button" class="secondary-button" data-action="back-choice">Annuler</button><button type="button" class="submit-button blue" data-action="save-section">Ajouter</button></div></section>`);return;
    }
    if(action==='save-section'){
      const field=dialog.querySelector('[name="new-section-name"]');const name=field.value.trim();if(!name){field.reportValidity();return;}if(notebookState.sections.some(item=>normalize(item.name)===normalize(name))){field.setCustomValidity('Un intercalaire porte déjà ce nom.');field.reportValidity();field.setCustomValidity('');return;}
      const colors=['rose','sand','sage','blue','lavender'];const color=colors[notebookState.sections.length%colors.length];const id=crypto.randomUUID();const section={id,name,color,icon:'book',order:notebookState.sections.length};await addSection(currentUser.uid,section);closeDialog();location.hash=`#/intercalaire/${id}`;return;
    }
    if(action==='account-menu'){openDialog(`<section class="choice-screen"><p class="eyebrow">SAYDO</p><h2 id="dialog-title">${escape(currentUser.displayName||currentUser.email||'Votre compte')}</h2><p class="choice-subtitle">Vos contenus sont enregistrés dans votre espace Firebase.</p><div class="form-actions"><button type="button" class="secondary-button" data-action="back-choice">Fermer</button><button type="button" class="submit-button rose" data-action="sign-out">Se déconnecter</button></div></section>`);return;}
    if(action==='sign-out'){closeDialog();await signOutUser();return;}
    if(action==='delete-content'){
      const content=notebookState.contents.find(item=>item.id===button.dataset.content);if(content&&confirm(`Supprimer « ${content.title||content.fileName||'ce contenu'} » ? Cette suppression est définitive.`)){await deleteContent(currentUser.uid,content);}return;
    }
  if(action==='download-file'){
      const content=notebookState.contents.find(item=>item.id===button.dataset.content);if(!content?.storagePath)return;const {downloadContent}=await import('./services/notebook-store.js');const blob=await downloadContent(content.storagePath);const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=content.fileName||'SayDo-fichier';anchor.click();URL.revokeObjectURL(url);return;
    }
  }catch(error){showError(readableFirebaseError(error));const notice=dialog.querySelector('.form-notice')||dialog.querySelector('.auth-error');if(notice)notice.textContent=readableFirebaseError(error);else if(dialog.open){const message=document.createElement('p');message.className='form-notice';message.setAttribute('role','alert');message.textContent=readableFirebaseError(error);dialog.querySelector('.dialog-content')?.prepend(message);}}
});

document.addEventListener('change',event=>{
  const input=event.target;if(input.matches('[name="upload"]')){const label=dialog.querySelector('[data-file-name]');if(label)label.textContent=input.files[0]?.name||'Aucun fichier choisi';}
  if(input.matches('[data-action="toggle-item"]')){const content=notebookState.contents.find(item=>item.id===input.dataset.content);if(content){const items=content.items.map(item=>item.id===input.dataset.item?{...item,done:input.checked}:item);updateContent(currentUser.uid,{...content,items}).catch(error=>{input.checked=!input.checked;showError(readableFirebaseError(error));});}}
});

document.addEventListener('submit',async event=>{
  const loginForm=event.target.closest('[data-form="sign-in"]');
  if(loginForm){
    event.preventDefault();const button=loginForm.querySelector('[type="submit"]');const email=loginForm.querySelector('[name="email"]').value.trim();const password=loginForm.querySelector('[name="password"]').value;
    button.disabled=true;button.textContent='Connexion…';
    try{await signIn(email,password);}catch(error){showError(readableFirebaseError(error));button.disabled=false;button.textContent='Se connecter';}
    return;
  }
  const form=event.target.closest('[data-form="content"]');if(!form)return;
  event.preventDefault();const data=new FormData(form);const type=form.dataset.type;const sectionValue=data.get('sectionId');
  if(!sectionValue){form.querySelector('[name="sectionId"]').reportValidity();return;}
  const sectionId=sectionValue==='__inbox__'?null:sectionValue;
  if(sectionId&&!notebookState.sections.some(section=>section.id===sectionId)){showError('Cet intercalaire n’existe plus. Choisis-en un autre.');return;}
  const content={id:crypto.randomUUID(),type,sectionId,title:String(data.get('title')||'').trim(),body:String(data.get('body')||'').trim(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  if(type==='list')content.items=data.getAll('item').map(text=>({id:crypto.randomUUID(),text:String(text).trim(),done:false})).filter(item=>item.text);
  if(type==='event'){content.date=data.get('date');content.time=data.get('time');content.location=String(data.get('location')||'').trim();}
  const file=type==='file'?form.querySelector('[name="upload"]').files[0]:null;
  if(type==='file'&&!file){form.querySelector('[name="upload"]').reportValidity();return;}
  const submit=form.querySelector('[type="submit"]');submit.disabled=true;submit.textContent='Enregistrement…';
  try{await saveContent(currentUser.uid,content,file);closeDialog();if(viewCurrentIsInboxOrToday(content))location.hash=content.sectionId?`#/intercalaire/${content.sectionId}`:'#/entree';}
  catch(error){submit.disabled=false;submit.textContent=type==='file'?'Ajouter':'Enregistrer';const notice=document.createElement('p');notice.className='form-notice';notice.setAttribute('role','alert');notice.textContent=readableFirebaseError(error);form.prepend(notice);}
});

function viewCurrentIsInboxOrToday(content){const view=resolveView(location.hash,notebookState.sections);return !content.sectionId&&(view.kind==='today'||view.kind==='inbox')||Boolean(content.sectionId&&view.kind==='section'&&view.section.id===content.sectionId);}
window.addEventListener('hashchange',render);
render();
