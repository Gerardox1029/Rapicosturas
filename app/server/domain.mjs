import {randomUUID} from 'node:crypto';
export const SITE_IDS=['dolores','siglo-xx','cerro-colorado','yanahuara','cayma'];
export const CATEGORY_IDS=['recepcion','costura','calidad','entregas'];
export const RETENTION_MS=24*60*60*1000;
export class HttpError extends Error{constructor(status,message){super(message);this.status=status;}}
export function ensure(condition,status,message){if(!condition)throw new HttpError(status,message);}
export function text(value,name,max=500,{optional=false}={}){ensure(typeof value==='string'||optional&&value==null,400,`${name}: valor inválido.`);const t=(value||'').trim();ensure((optional||t.length>0)&&t.length<=max,400,`${name}: revisa el texto (máximo ${max} caracteres).`);return t;}
export function site(value){ensure(SITE_IDS.includes(value),400,'Selecciona una sede válida.');return value;}
export function iso(value,name='Fecha'){ensure(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T/.test(value)&&Number.isFinite(Date.parse(value)),400,`${name}: valor inválido.`);return new Date(value).toISOString();}
export function requestId(value){ensure(typeof value==='string'&&/^[a-f0-9-]{36}$/i.test(value),400,'Identificador de operación inválido.');return value;}
export function pattern(value){ensure(Array.isArray(value)&&value.length>=4&&value.length<=9&&new Set(value).size===value.length&&value.every(n=>Number.isInteger(n)&&n>=1&&n<=9),400,'Usa entre 4 y 9 puntos distintos.');return value.join('');}
export function newId(prefix){return `${prefix}-${randomUUID()}`;}
export function mediaSpec(body){ensure(['evidence','tutorial'].includes(body.kind),400,'Tipo de archivo inválido.');const video=['video/mp4','video/webm'].includes(body.contentType),image=['image/jpeg','image/png','image/webp'].includes(body.contentType);ensure(body.kind==='tutorial'?video:video||image,400,'Formato de archivo no permitido.');const maximum=body.kind==='tutorial'?300*1024*1024:25*1024*1024;ensure(Number.isSafeInteger(body.sizeBytes)&&body.sizeBytes>0&&body.sizeBytes<=maximum,400,`El archivo supera ${maximum/1024/1024} MB o no tiene contenido.`);return {kind:body.kind,contentType:body.contentType,sizeBytes:body.sizeBytes};}
export function evidenceExpiry(confirmedAt){return new Date(new Date(confirmedAt).getTime()+RETENTION_MS);}
export function shipmentInput(body){const origin=site(body.origin),destination=site(body.destination);ensure(origin!==destination,400,'Origen y destino deben ser distintos.');ensure(['package','work'].includes(body.type),400,'Selecciona Encargo o Trabajo.');return {requestId:requestId(body.requestId),origin,destination,type:body.type,description:text(body.description,'Descripción',500,{optional:true}),shipmentAt:iso(body.shipmentAt,'Fecha de envío')};}
export function receiptInput(body,shipment){ensure(site(body.site)===shipment.destination,403,'Sólo la sede destino puede confirmar la recepción.');const receivedAt=iso(body.receivedAt,'Fecha de recepción');ensure(Date.parse(receivedAt)>=Date.parse(shipment.shipmentAt),400,'La recepción no puede ser anterior al envío.');return {receivedAt,receiptNote:text(body.note,'Observación',500,{optional:true})};}
export function canSeeShipment(s,selectedSite,owner){return owner||s.origin===selectedSite||s.destination===selectedSite;}
export function videoInput(body){ensure(CATEGORY_IDS.includes(body.category),400,'Categoría inválida.');return {requestId:requestId(body.requestId),title:text(body.title,'Título',100),description:text(body.description,'Descripción',700,{optional:true}),category:body.category};}
