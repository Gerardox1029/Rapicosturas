import {request,demo} from './api.js';

function keyBytes(key){const padded=key+'='.repeat((4-key.length%4)%4),bytes=atob(padded.replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(bytes,c=>c.charCodeAt(0));}
export function pushSupported(){return !demo&&'serviceWorker'in navigator&&'PushManager'in window&&'Notification'in window;}
export async function activatePush(entity){
 if(!pushSupported())throw Error('Este navegador no admite avisos PWA.');
 const permission=Notification.permission==='granted'?'granted':await Notification.requestPermission();if(permission!=='granted')throw Error('No se concedió permiso para mostrar avisos.');
 const config=await request('/push/config');if(!config.enabled)throw Error('Los avisos aún necesitan las claves VAPID en Netlify.');
 const registration=await navigator.serviceWorker.ready;
 let subscription=await registration.pushManager.getSubscription();
 if(!subscription)subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(config.publicKey)});
 await request('/push/subscription',{method:'PUT',body:{entity,subscription:subscription.toJSON()}});
 return subscription;
}
export async function syncPushTarget(entity){
 if(!pushSupported()||Notification.permission!=='granted')return;
 const registration=await navigator.serviceWorker.ready,subscription=await registration.pushManager.getSubscription();if(!subscription)return;
 try{if(entity==='all')await request('/push/subscription',{method:'DELETE',body:{subscription:subscription.toJSON()}});
 else await request('/push/subscription',{method:'PUT',body:{entity,subscription:subscription.toJSON()}});}catch(error){await subscription.unsubscribe().catch(()=>{});throw error;}
}
