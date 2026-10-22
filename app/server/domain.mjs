import {randomUUID} from 'node:crypto';
export const SITE_IDS=['dolores','siglo-xx','cerro-colorado','yanahuara','cayma'];
export const SITE_NAMES={dolores:'Dolores','siglo-xx':'Siglo XX','cerro-colorado':'Cerro Colorado',yanahuara:'Yanahuara',cayma:'Cayma'};
export const DEFAULT_USERS=[{id:'user-yesenia',name:'Yesenia'},{id:'user-yolanda',name:'Yolanda'}];
export const CATEGORY_IDS=['recepcion','costura','calidad','entregas'];
export const RETENTION_MS=72*60*60*1000;
export const SHIPMENT_RETENTION_MS=72*60*60*1000;
export const PART_SIZE=8*1024*1024;
export const TUTORIAL_MAX=1024*1024*1024;
export class HttpError extends Error{constructor(status,message){super(message);this.status=status;}}
export function ensure(condition,status,message){if(!condition)throw new HttpError(status,message);}
export function text(value,name,max=500,{optional=false}={}){ensure(typeof value==='string'||optional&&value==null,400,`${name}: valor inválido.`);const t=(value||'').trim();ensure((optional||t.length>0)&&t.length<=max,400,`${name}: revisa el texto (máximo ${max} caracteres).`);return t;}
export function site(value){ensure(SITE_IDS.includes(value)||typeof value==='string'&&/^user-(?:yesenia|yolanda|[a-f0-9-]{36})$/.test(value),400,'Selecciona una sede o usuaria válida.');return value;}
export function userName(value){return text(value,'Nombre de usuaria',60);}
export function iso(value,name='Fecha'){ensure(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T/.test(value)&&Number.isFinite(Date.parse(value)),400,`${name}: valor inválido.`);return new Date(value).toISOString();}
export function requestId(value){ensure(typeof value==='string'&&/^[a-f0-9-]{36}$/i.test(value),400,'Identificador de operación inválido.');return value;}
export function pattern(value){ensure(Array.isArray(value)&&value.length>=4&&value.length<=9&&new Set(value).size===value.length&&value.every(n=>Number.isInteger(n)&&n>=1&&n<=9),400,'Usa entre 4 y 9 puntos distintos.');return value.join('');}
export function newId(prefix){return `${prefix}-${randomUUID()}`;}
export function mediaSpec(body){ensure(['evidence','tutorial','thumbnail'].includes(body.kind),400,'Tipo de archivo inválido.');const contentType=String(body.contentType||'').split(';')[0],video=['video/mp4','video/webm'].includes(contentType),image=['image/jpeg','image/png','image/webp'].includes(contentType),audio=['audio/webm','audio/ogg','audio/mpeg','audio/mp4'].includes(contentType);ensure(body.kind==='tutorial'?video:body.kind==='thumbnail'?image:video||image||audio,400,'Formato de archivo no permitido.');const maximum=body.kind==='tutorial'?TUTORIAL_MAX:body.kind==='thumbnail'?500*1024:25*1024*1024;ensure(Number.isSafeInteger(body.sizeBytes)&&body.sizeBytes>0&&body.sizeBytes<=maximum,400,`El archivo supera ${maximum/1024/1024} MB o no tiene contenido.`);if(body.durationSeconds!==undefined)ensure(Number.isInteger(body.durationSeconds)&&body.durationSeconds>=0&&body.durationSeconds<=86400,400,'Duración de grabación inválida.');return {kind:body.kind,contentType,sizeBytes:body.sizeBytes,...(body.durationSeconds!==undefined?{durationSeconds:body.durationSeconds}:{})};}
export const shipmentExpired=(s,now)=>s.status==='deleted'||s.status==='received'&&+new Date(s.confirmedAt||s.receivedAt)+SHIPMENT_RETENTION_MS<=+now;
export const evidenceIds=s=>[s.evidenceId,s.receiptEvidenceId,s.audioId,s.receiptAudioId].filter(Boolean);
export function evidenceExpiry(confirmedAt){return new Date(new Date(confirmedAt).getTime()+RETENTION_MS);}
export function shipmentInput(body){const origin=site(body.origin),destination=site(body.destination);ensure(origin!==destination,400,'Origen y destino deben ser distintos.');ensure(['package','work'].includes(body.type),400,'Selecciona Encargo o Trabajo.');return {requestId:requestId(body.requestId),origin,destination,type:body.type,description:text(body.description,'Descripción',500,{optional:true}),shipmentAt:iso(body.shipmentAt,'Fecha de envío')};}
export function receiptInput(body,shipment){ensure(site(body.site)===shipment.destination,403,'Sólo el destino puede confirmar la recepción.');const receivedAt=iso(body.receivedAt,'Fecha de recepción');ensure(Date.parse(receivedAt)>=Date.parse(shipment.shipmentAt),400,'La recepción no puede ser anterior al envío.');return {receivedAt,receiptNote:text(body.note,'Observación',500,{optional:true})};}
export function canSeeShipment(s,selectedSite,owner){return owner||s.origin===selectedSite||s.destination===selectedSite;}
export function videoInput(body){ensure(CATEGORY_IDS.includes(body.category),400,'Categoría inválida.');return {requestId:requestId(body.requestId),title:text(body.title,'Título',100),description:text(body.description,'Descripción',700,{optional:true}),category:body.category};}
