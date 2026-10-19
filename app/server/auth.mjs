import {randomBytes,scrypt as scryptCallback,timingSafeEqual,createHmac,createHash} from 'node:crypto';
import {promisify} from 'node:util';
import {ensure,pattern} from './domain.mjs';
const scrypt=promisify(scryptCallback);
export async function hashPattern(value){const salt=randomBytes(16).toString('hex');const hash=await scrypt(value,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024});return {salt,hash:hash.toString('hex')};}
export async function verifyPattern(value,stored){if(!stored?.salt||!stored?.hash)return false;const hash=await scrypt(value,stored.salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024});const original=Buffer.from(stored.hash,'hex');return hash.length===original.length&&timingSafeEqual(hash,original);}
export function proofHash(value){return createHash('sha256').update(String(value)).digest('hex');}
export function secureMatch(a,b){const x=Buffer.from(a||''),y=Buffer.from(b||'');return x.length===y.length&&timingSafeEqual(x,y);}
export function makeAuth(db,env,clock=()=>new Date()){
 const digest=t=>createHmac('sha256',env.SESSION_SECRET).update(t).digest('hex');
 async function settings(){let value=await db.collection('settings').findOne({_id:'owner'});if(!value){const initial=String(env.OWNER_INITIAL_PATTERN||'7415963').split('').map(Number);const key=await hashPattern(pattern(initial));await db.collection('settings').updateOne({_id:'owner'},{$setOnInsert:{...key,version:1,changedAt:clock(),initial:true}},{upsert:true});value=await db.collection('settings').findOne({_id:'owner'});}return value;}
 function cookie(request){const raw=request.headers.get('cookie')||'';return raw.split(';').map(s=>s.trim()).find(s=>s.startsWith('rc_owner='))?.slice(9)||'';}
 async function owner(request){const token=cookie(request);if(!/^[a-f0-9]{64}$/.test(token))return false;const current=await settings();return !!await db.collection('sessions').findOne({_id:digest(token),version:current.version,expiresAt:{$gt:clock()}});}
 function cookieValue(request,token,maxAge=8*3600){return `rc_owner=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${new URL(request.url).protocol==='https:'?'; Secure':''}`;}
 async function session(request,version){const token=randomBytes(32).toString('hex');await db.collection('sessions').insertOne({_id:digest(token),version,expiresAt:new Date(+clock()+8*3600000)});return cookieValue(request,token);}
 async function rate(ip,scope='login',max=8){const bucket=Math.floor(+clock()/300000),id=proofHash(`${scope}:${ip}:${bucket}`);const entry=await db.collection('rateLimits').findOneAndUpdate({_id:id},{$inc:{count:1},$setOnInsert:{expiresAt:new Date(+clock()+600000)}},{upsert:true,returnDocument:'after',includeResultMetadata:false});ensure(entry.count<=max,429,'Demasiados intentos. Espera cinco minutos y vuelve a intentar.');}
 async function login(request,body,ip){await rate(ip);const selected=pattern(body.pattern),current=await settings();ensure(await verifyPattern(selected,current),401,'El patrón no coincide.');return {cookie:await session(request,current.version),initial:current.initial};}
 async function change(request,body,ip){ensure(await owner(request),401,'Abre el modo dueña para cambiar el patrón.');await rate(ip,'change',8);const current=await settings();ensure(await verifyPattern(pattern(body.currentPattern),current),401,'El patrón actual no coincide.');const next=await hashPattern(pattern(body.newPattern));const result=await db.collection('settings').findOneAndUpdate({_id:'owner',version:current.version},{$set:{...next,initial:false,changedAt:clock()},$inc:{version:1}},{returnDocument:'after',includeResultMetadata:false});ensure(result,409,'El patrón cambió en otra sesión. Vuelve a abrir el modo dueña.');return {cookie:await session(request,result.version)};}
 async function logout(request){const token=cookie(request);if(token)await db.collection('sessions').deleteOne({_id:digest(token)});return cookieValue(request,'',0);}
 return {owner,login,change,logout,rate};
}
