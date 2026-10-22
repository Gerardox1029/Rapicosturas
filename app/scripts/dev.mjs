import {loadEnv} from './env.mjs';
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),publicRoot=path.join(root,'public');
await loadEnv();
const port=Number(process.env.PORT||4173);process.env.APP_ORIGIN||=`http://127.0.0.1:${port}`;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,process.env.APP_ORIGIN);if(url.pathname.startsWith('/api/v1/')){const {default:handler}=await import('../netlify/functions/api.mjs');const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>100000){res.writeHead(413).end();return;}chunks.push(chunk);}const body=Buffer.concat(chunks);const r=new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body}: {})});const response=await handler(r,{ip:'127.0.0.1'});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
 const pathname=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname),file=path.resolve(publicRoot,'.'+pathname);if(!file.startsWith(publicRoot+path.sep)){res.writeHead(403).end();return;}
 try{const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);}catch{if(!/^\/(envios|videos|admin(?:\/bot)?)\/?$/.test(url.pathname)){res.writeHead(404).end('No encontrado');return;}const data=await readFile(path.join(publicRoot,'index.html'));res.writeHead(200,{'Content-Type':mime['.html'],'Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:data);}
 }catch{res.writeHead(503,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify({error:'La API local todavía no está configurada. Puedes revisar la interfaz en /?demo=1.'}));}}).listen(port,'127.0.0.1',()=>console.log(`Rapicostura: http://127.0.0.1:${port} · prototipo: /?demo=1`));
