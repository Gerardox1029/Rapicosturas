import {runUpload} from './uploads.js';
import {CATEGORIES,DEFAULT_USERS} from './model.js';
export const demo=new URLSearchParams(location.search).get('demo')==='1';
const demoMedia=new Map();let demoOwner=false,demoPattern='7415963';
const now=Date.now();
const exampleShipments=[
 {id:'RC-1048',type:'work',description:'Colocar cierres y ajustar pretinas.',title:'Arreglo de prendas',origin:'dolores',destination:'cerro-colorado',shipmentAt:new Date(now-2*3600000).toISOString(),status:'transit'},
 {id:'RC-1047',type:'package',description:'Tela lila, cierres y botones.',title:'Telas y cierres',origin:'dolores',destination:'yanahuara',shipmentAt:new Date(now-3600000).toISOString(),status:'transit'},
 {id:'RC-1046',type:'package',title:'Materiales para el taller',description:'Hilos y elásticos. Todo completo.',origin:'cerro-colorado',destination:'dolores',shipmentAt:new Date(now-3*3600000).toISOString(),receivedAt:new Date(now-3600000).toISOString(),status:'received'},
 {id:'RC-1045',type:'work',title:'Ajuste de pantalones',description:'Ajuste de basta para entregar a la clienta.',origin:'cayma',destination:'dolores',shipmentAt:new Date(now-1800000).toISOString(),status:'transit'}
];
let demoShipments=exampleShipments;
let demoUsers=structuredClone(DEFAULT_USERS);
const demoVideos=CATEGORIES.map((c,i)=>({id:`demo-video-${i}`,title:['Recibir y revisar una prenda','Preparar un acabado limpio','Revisar las puntadas','Preparar un paquete'][i],category:c.id,description:'Recurso visual de ejemplo para revisar la presentación del taller.',sample:true,sizeBytes:0}));
export async function request(path,{method='GET',body}={}){
  if(demo)return demoRequest(path,method,body);
  const response=await fetch(`/api/v1${path}`,{method,credentials:'same-origin',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,cache:'no-store'});
  const data=await response.json().catch(()=>({error:'El servidor devolvió una respuesta inesperada.'}));
  if(!response.ok){const err=Error(data.error||'No se pudo completar la operación.');err.status=response.status;throw err;}return data;
}
async function demoRequest(path,method,body){
  const url=new URL(path,location.origin),p=url.pathname;
  if(p==='/session')return {owner:demoOwner};
  if(p==='/owner/login'){if(body.pattern.join('')!==demoPattern)throw Error('El patrón no coincide.');demoOwner=true;return {owner:true};}
  if(p==='/owner/logout'){demoOwner=false;return {owner:false};}
  if(p==='/owner/pattern'){if(body.currentPattern.join('')!==demoPattern)throw Error('El patrón actual no coincide.');demoPattern=body.newPattern.join('');return {ok:true};}
  if(p==='/users'&&method==='GET')return {items:demoUsers};
  if(p==='/users'&&method==='POST'){const item={id:'user-'+crypto.randomUUID(),name:body.name,kind:'user'};demoUsers.push(item);return item;}
  if(p.startsWith('/users/')&&method==='PATCH'){const item=demoUsers.find(u=>u.id===p.split('/')[2]);if(!item)throw Error('Usuaria no encontrada.');item.name=body.name;return item;}
  if(p.startsWith('/users/')&&method==='DELETE'){const id=p.split('/')[2];if(demoShipments.some(s=>s.status==='transit'&&(s.origin===id||s.destination===id)))throw Error('Termina sus envíos en camino antes de eliminarla.');demoUsers=demoUsers.filter(u=>u.id!==id);return {ok:true};}
  if(p==='/push/config')return {enabled:false,publicKey:null};
  if(p==='/shipments'&&method==='GET')return {items:demoShipments};
  if(p==='/shipments'&&method==='POST'){const item={...body,evidenceId:body.evidence?.id,audioId:body.audio?.id,revision:0,id:`RC-${Date.now().toString(36).toUpperCase()}`,title:body.description||'Encargo entre sedes',status:'transit',createdAt:new Date().toISOString()};demoShipments=[item,...demoShipments];return item;}
  if(p.startsWith('/shipments/')&&method==='DELETE'){demoShipments=demoShipments.filter(s=>s.id!==p.split('/')[2]);return {ok:true};}
  if(p.startsWith('/shipments/')&&method==='PATCH'){const s=demoShipments.find(s=>s.id===p.split('/')[2]);Object.assign(s,body,{title:body.description||s.title,revision:(s.revision||0)+1});return s;}
  if(p.startsWith('/shipments/')&&method==='GET')return demoShipments.find(s=>s.id===p.split('/')[2]);
  if(p.endsWith('/receipt')){const item=demoShipments.find(s=>s.id===p.split('/')[2]);Object.assign(item,{status:'received',receivedAt:body.receivedAt,receiptNote:body.note,receiptEvidenceId:body.evidence?.id,receiptAudioId:body.audio?.id,evidenceExpiresAt:new Date(Date.now()+72*3600000).toISOString()});return item;}
  if(p==='/videos'&&method==='GET')return {items:demoVideos};
  if(p==='/videos'&&method==='POST'){const v={...body,id:`VID-${Date.now()}`,mediaId:body.media.id,thumbnailURL:demoMedia.get(body.thumbnail?.id)?.url};demoVideos.unshift(v);return v;}
  if(p.startsWith('/videos/')&&method==='DELETE'){demoVideos.splice(demoVideos.findIndex(v=>v.id===p.split('/')[2]),1);return {ok:true};}
  if(p==='/videos/usage')return {usedBytes:0,referenceBytes:100_000_000_000};
  if(p.startsWith('/media/')&&p.endsWith('/url'))return (demoMedia.get(p.split('/')[2])||{url:null});
  throw Error('Esta acción no forma parte de la demostración.');
}
export async function upload(file,kind,onProgress=()=>{}){
  if(demo){const id=crypto.randomUUID();demoMedia.set(id,{url:URL.createObjectURL(file),contentType:file.type});onProgress(100,{state:'done',loaded:file.size,total:file.size});return {id,token:'demo'};}
  return runUpload(file,kind,request,onProgress);
}
export async function mediaURL(id,site){if(!id)return null;return (await request(`/media/${encodeURIComponent(id)}/url?site=${encodeURIComponent(site)}`)).url;}
