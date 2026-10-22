import webpush from 'web-push';
import {HttpError,ensure} from './domain.mjs';

const pushHosts=['fcm.googleapis.com','updates.push.services.mozilla.com','web.push.apple.com'];
function trustedEndpoint(endpoint){
 try{const url=new URL(endpoint);return url.protocol==='https:'&&!url.username&&!url.password&&(!url.port||url.port==='443')&&(pushHosts.includes(url.hostname)||url.hostname.endsWith('.notify.windows.com')||url.hostname.endsWith('.push.apple.com'));}catch{return false;}
}
export function validSubscription(value){
 ensure(value&&typeof value==='object'&&!Array.isArray(value),400,'Suscripción de avisos inválida.');
 const {endpoint,keys}=value;
 ensure(typeof endpoint==='string'&&endpoint.length<=2048&&trustedEndpoint(endpoint),400,'El servicio de avisos no es compatible.');
 ensure(keys&&typeof keys.p256dh==='string'&&typeof keys.auth==='string'&&/^[A-Za-z0-9_-]{40,200}$/.test(keys.p256dh)&&/^[A-Za-z0-9_-]{10,100}$/.test(keys.auth),400,'Las claves del dispositivo no son válidas.');
 return {endpoint,keys:{p256dh:keys.p256dh,auth:keys.auth}};
}
export function shipmentNotice({sender,type,shipmentId,destination}){
 const item=type==='work'?'trabajo':'material';
 return {title:'Nuevo envío para ti 📦',body:`Se te envió un ${item} desde ${sender}. ¡Haz la recepción! 📦✨`,url:`/envios?tab=recepcion&site=${encodeURIComponent(destination)}&shipment=${encodeURIComponent(shipmentId)}`,tag:`shipment-${shipmentId}`};
}
export async function sendShipmentPush({subscriptions,env,destination,sender,type,shipmentId,send=webpush.sendNotification}){
 if(!env.VAPID_PUBLIC_KEY||!env.VAPID_PRIVATE_KEY||!env.VAPID_SUBJECT)return {sent:0,invalid:[]};
 webpush.setVapidDetails(env.VAPID_SUBJECT,env.VAPID_PUBLIC_KEY,env.VAPID_PRIVATE_KEY);
 const targets=await subscriptions.find({entity:destination}).limit(50).toArray();
 const payload=JSON.stringify(shipmentNotice({sender,type,shipmentId,destination}));
 const results=await Promise.allSettled(targets.map(item=>send({endpoint:item.endpoint,keys:item.keys},payload,{TTL:86400,timeout:3500})));
 return {sent:results.filter(r=>r.status==='fulfilled').length,invalid:results.flatMap((r,i)=>r.status==='rejected'&&[404,410].includes(r.reason?.statusCode)?[targets[i].endpoint]:[])};
}
