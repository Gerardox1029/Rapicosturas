import {loadEnv} from './env.mjs';
import {config,database,objectStore} from '../server/infrastructure.mjs';
await loadEnv();
const required=['APP_ORIGIN','MONGODB_URI','R2_ACCOUNT_ID','R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY','R2_BUCKET','SESSION_SECRET'];
const missing=required.filter(k=>!process.env[k]);
if(missing.length){console.error('Completar en el .env privado: '+missing.join(', '));process.exit(1);}
try{const env=config(),db=await database(env);await db.command({ping:1});const bytes=await objectStore(env).tutorialUsage();console.log(`Conexión a MongoDB y lectura de R2 correctas. Videos conservados: ${bytes} bytes. No se subieron archivos ni se crearon envíos.`);process.exit(0);}catch(error){console.error('No se pudo verificar el servicio. Revisa URI, permisos, red de Atlas y credenciales S3. Tipo: '+error.name);process.exit(1);}
