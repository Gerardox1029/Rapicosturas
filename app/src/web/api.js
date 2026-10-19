import {CATEGORIES} from './model.js';
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
  if(p==='/shipments'&&method==='GET')return {items:demoShipments};
  if(p==='/shipments'&&method==='POST'){const item={...body,evidenceId:body.evidence?.id,id:`RC-${Date.now().toString(36).toUpperCase()}`,title:body.description||'Encargo entre sedes',status:'transit',createdAt:new Date().toISOString()};demoShipments=[item,...demoShipments];return item;}
  if(p.startsWith('/shipments/')&&method==='GET')return demoShipments.find(s=>s.id===p.split('/')[2]);
  if(p.endsWith('/receipt')){const item=demoShipments.find(s=>s.id===p.split('/')[2]);Object.assign(item,{status:'received',receivedAt:body.receivedAt,receiptNote:body.note,receiptEvidenceId:body.evidence?.id,evidenceExpiresAt:new Date(Date.now()+86400000).toISOString()});return item;}
  if(p==='/videos'&&method==='GET')return {items:demoVideos};
  if(p==='/videos'&&method==='POST'){const v={...body,id:`VID-${Date.now()}`,mediaId:body.media.id};demoVideos.unshift(v);return v;}
  if(p.startsWith('/videos/')&&method==='DELETE'){demoVideos.splice(demoVideos.findIndex(v=>v.id===p.split('/')[2]),1);return {ok:true};}
  if(p==='/videos/usage')return {usedBytes:0,referenceBytes:100_000_000_000};
  if(p.startsWith('/media/')&&p.endsWith('/url'))return (demoMedia.get(p.split('/')[2])||{url:null});
  throw Error('Esta acción no forma parte de la demostración.');
}
export async function upload(file,kind,onProgress=()=>{}){
  if(demo){const id=crypto.randomUUID();demoMedia.set(id,{url:URL.createObjectURL(file),contentType:file.type});onProgress(100);return {id,token:'demo'};}
  const ticket=await request('/media/tickets',{method:'POST',body:{kind,contentType:file.type,sizeBytes:file.size}});
  await new Promise((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open('PUT',ticket.url);xhr.setRequestHeader('Content-Type',file.type);xhr.timeout=15*60*1000;xhr.upload.onprogress=e=>{if(e.lengthComputable)onProgress(Math.round(e.loaded/e.total*100));};xhr.onload=()=>xhr.status>=200&&xhr.status<300?resolve():reject(Error('No se pudo subir el archivo a R2. Comprueba CORS y vuelve a intentar.'));xhr.onerror=()=>reject(Error('La carga se interrumpió. Revisa la conexión.'));xhr.ontimeout=()=>reject(Error('La carga tardó demasiado. Intenta de nuevo.'));xhr.send(file);});
  await request(`/media/${ticket.id}/complete`,{method:'POST',body:{token:ticket.token}});return {id:ticket.id,token:ticket.token};
}
export async function mediaURL(id,site){if(!id)return null;return (await request(`/media/${encodeURIComponent(id)}/url?site=${encodeURIComponent(site)}`)).url;}
