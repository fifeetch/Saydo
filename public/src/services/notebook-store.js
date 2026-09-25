import { INITIAL_SECTIONS } from '../domain/notebook.js';
import { db, storage } from './firebase.js';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { deleteObject, getBlob, ref, uploadBytes } from 'firebase/storage';

const sectionsPath = uid => collection(db,'users',uid,'sections');
const contentsPath = uid => collection(db,'users',uid,'contents');
const recordPath = (uid,id) => doc(db,'users',uid,'contents',id);

export async function ensureDefaultSections(uid) {
  const current = await getDocs(sectionsPath(uid));
  if (!current.empty) return;
  const batch = writeBatch(db);
  INITIAL_SECTIONS.forEach((section,order)=>batch.set(doc(db,'users',uid,'sections',section.id),{...section,order,createdAt:serverTimestamp(),updatedAt:serverTimestamp()}));
  await batch.commit();
}

export function subscribeNotebook(uid, callback, onError) {
  let sections = []; let contents = [];
  const publish = () => callback({sections:[...sections].sort((a,b)=>a.order-b.order),contents});
  const stopSections = onSnapshot(sectionsPath(uid),snapshot=>{sections=snapshot.docs.map(item=>({id:item.id,...item.data()}));publish();},onError);
  const stopContents = onSnapshot(contentsPath(uid),snapshot=>{contents=snapshot.docs.map(item=>({id:item.id,...item.data()}));publish();},onError);
  return () => { stopSections(); stopContents(); };
}

export async function saveContent(uid, content, file) {
  let uploadRef;
  if (file) {
    if (file.size > 10 * 1024 * 1024) throw new Error('Les fichiers doivent faire 10 Mo ou moins.');
    const safeName=file.name.normalize('NFKC').replace(/[^a-zA-Z0-9._-]+/g,'_').slice(0,120) || 'fichier';
    uploadRef=ref(storage,`users/${uid}/files/${content.id}/${safeName}`);
    await uploadBytes(uploadRef,file,{contentType:file.type || 'application/octet-stream',customMetadata:{ownerUid:uid}});
    content={...content,storagePath:uploadRef.fullPath,fileName:file.name,fileSize:file.size,fileType:file.type || 'application/octet-stream'};
  }
  try { await setDoc(recordPath(uid,content.id),{...content,createdAt:serverTimestamp(),updatedAt:serverTimestamp()}); }
  catch(error) { if(uploadRef) await deleteObject(uploadRef).catch(()=>{}); throw error; }
  return content;
}

export async function updateContent(uid,content) { await updateDoc(recordPath(uid,content.id),{...content,updatedAt:serverTimestamp()}); }
export async function addSection(uid,section) { await setDoc(doc(db,'users',uid,'sections',section.id),{...section,createdAt:serverTimestamp(),updatedAt:serverTimestamp()}); }
export async function renameSection(uid,id,name) { await updateDoc(doc(db,'users',uid,'sections',id),{name,updatedAt:serverTimestamp()}); }

/** Move contents first; remove the tab only after every write succeeds. */
export async function removeSectionToInbox(uid,id) {
  const linked=await getDocs(query(contentsPath(uid),where('sectionId','==',id)));
  const records=linked.docs;
  for(let start=0;start<records.length;start+=450){
    const batch=writeBatch(db);
    records.slice(start,start+450).forEach(record=>batch.update(record.ref,{sectionId:null,updatedAt:serverTimestamp()}));
    await batch.commit();
  }
  await deleteDoc(doc(db,'users',uid,'sections',id));
  return records.length;
}

export async function deleteContent(uid,content) {
  await deleteDoc(recordPath(uid,content.id));
  if(content.storagePath) await deleteObject(ref(storage,content.storagePath));
}

export async function downloadContent(storagePath) { return getBlob(ref(storage,storagePath)); }
