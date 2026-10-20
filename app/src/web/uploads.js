// El archivo siempre va a R2. La API sólo firma partes y valida el resultado.
export function putFile(url,blob,{onBytes=()=>{},onXHR=()=>{}}={}){
 return new Promise((resolve,reject)=>{const xhr=new XMLHttpRequest();onXHR(xhr);xhr.open('PUT',url);xhr.setRequestHeader('Content-Type',blob.type||'application/octet-stream');xhr.timeout=15*60*1000;xhr.upload.onprogress=e=>{if(e.lengthComputable)onBytes(e.loaded);};xhr.onload=()=>{if(xhr.status>=200&&xhr.status<300)resolve();else{const e=Error(`R2 rechazó la carga (${xhr.status}). Revisa permisos y CORS.`);e.status=xhr.status;reject(e);}};xhr.onerror=()=>reject(Error('El navegador no pudo conectar con R2. Revisa internet y el permiso CORS del dominio.'));xhr.ontimeout=()=>reject(Error('Esta parte tardó demasiado.'));xhr.onabort=()=>reject(Object.assign(Error('Carga pausada.'),{name:'AbortError'}));xhr.send(blob);});
}
export async function fileKey(file,kind){const first=await file.slice(0,65536).arrayBuffer(),last=await file.slice(Math.max(0,file.size-65536)).arrayBuffer();const stamp=new TextEncoder().encode(`${kind}:${file.name}:${file.size}:${file.lastModified}`),bytes=new Uint8Array(first.byteLength+last.byteLength+stamp.length);bytes.set(new Uint8Array(first));bytes.set(new Uint8Array(last),first.byteLength);bytes.set(stamp,first.byteLength+last.byteLength);const digest=await crypto.subtle.digest('SHA-256',bytes);return 'rc-upload-v2-'+Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');}
export function forgetUpload(ref){try{if(ref?.localKey)localStorage.removeItem(ref.localKey);}catch{}}
export async function runUpload(file,kind,request,report=()=>{},deps={}){
 const put=deps.put||putFile,online=()=>deps.online?deps.online():navigator.onLine;
 let ticket,localKey,paused=null,cancelled=false,xhr=null,wake=null,confirmed=0,partial=0,finished=false;
 const task={pause(){if(!finished){paused='manual';xhr?.abort();emit();}},resume(){if(!finished){paused=online()?null:'offline';wake?.();emit();}},cancel(){if(!finished){cancelled=true;xhr?.abort();wake?.();}}};
 function emit(state){report(Math.min(finished?100:99,Math.floor((confirmed+partial)/file.size*100)),{state:state||(!online()?'offline':paused||'uploading'),loaded:confirmed+partial,total:file.size,task});}
 const offline=()=>{if(!paused)paused='offline';xhr?.abort();emit();},back=()=>{if(paused==='offline'){paused=null;wake?.();}emit();};
 if(!deps.online){window.addEventListener('offline',offline);window.addEventListener('online',back);}
 async function ready(){while(!cancelled&&(paused||!online())){if(!paused)paused='offline';emit();await new Promise(r=>{wake=r;});wake=null;}if(cancelled)throw Object.assign(Error('Carga cancelada.'),{name:'AbortError'});}
 async function retry(fn){let failures=0;for(;;){await ready();try{const result=await fn();xhr=null;await ready();return result;}catch(e){xhr=null;partial=0;if(cancelled)throw e;if(paused||!online())continue;if(e.status>=400&&e.status<500&&![403,408,429].includes(e.status))throw e;if(++failures>=3){paused='error';emit();await ready();failures=0;}else await new Promise(r=>setTimeout(r,500*failures));}}}
 try{
  emit();if(kind==='tutorial'){localKey=await fileKey(file,kind);try{ticket=JSON.parse(localStorage.getItem(localKey)||'null');}catch{}if(ticket&&Date.now()-ticket.savedAt>86400000){forgetUpload({localKey});ticket=null;}}
  if(ticket){try{const resume=await retry(()=>request(`/media/${ticket.id}/resume`,{method:'POST',body:{token:ticket.token}}));if(resume.done){finished=true;confirmed=file.size;emit('done');return {...ticket,localKey};}}catch(e){if([404,410,409].includes(e.status)){ticket=null;forgetUpload({localKey});}else throw e;}}
  if(!ticket){ticket=await retry(()=>request('/media/tickets',{method:'POST',body:{kind,contentType:file.type,sizeBytes:file.size,...(Number.isInteger(file.durationSeconds)?{durationSeconds:file.durationSeconds}:{})}}));if(localKey)try{localStorage.setItem(localKey,JSON.stringify({...ticket,savedAt:Date.now()}));}catch{}}
  if(ticket.protocol==='multipart'){
   const resume=await retry(()=>request(`/media/${ticket.id}/resume`,{method:'POST',body:{token:ticket.token}}));
   if(resume.staged||resume.done){confirmed=file.size;emit();}else{const parts=new Map((resume.parts||[]).map(p=>[p.partNumber,p]));confirmed=[...parts.values()].reduce((n,p)=>n+p.sizeBytes,0);emit();
    for(let n=1;n<=Math.ceil(file.size/ticket.partSize);n++){if(parts.has(n))continue;const part=file.slice((n-1)*ticket.partSize,Math.min(n*ticket.partSize,file.size),file.type);await retry(async()=>{const signed=await request(`/media/${ticket.id}/parts`,{method:'POST',body:{token:ticket.token,partNumber:n}});await ready();await put(signed.url,part,{onBytes:n=>{partial=n;emit();},onXHR:x=>{xhr=x;}});});confirmed+=part.size;partial=0;emit();}
   }
  }else{await retry(async()=>{const signed=await request(`/media/${ticket.id}/resume`,{method:'POST',body:{token:ticket.token}});await ready();await put(signed.url,file,{onBytes:n=>{partial=n;emit();},onXHR:x=>{xhr=x;}});});confirmed=file.size;partial=0;}
  emit('verifying');await retry(()=>request(`/media/${ticket.id}/complete`,{method:'POST',body:{token:ticket.token}}));finished=true;emit('done');return {id:ticket.id,token:ticket.token,localKey};
 }catch(e){if(cancelled&&ticket){try{await request(`/media/${ticket.id}`,{method:'DELETE',body:{token:ticket.token}});}catch{/* Limpieza programada si no hay conexión. */}forgetUpload({localKey});}throw e;}
 finally{finished=true;xhr=null;wake?.();if(!deps.online){window.removeEventListener('offline',offline);window.removeEventListener('online',back);}}
}
