import {loadEnv} from './env.mjs';
import {hashPattern} from '../server/auth.mjs';
import {pattern} from '../server/domain.mjs';
import {config,database} from '../server/infrastructure.mjs';
// Herramienta de recuperación operada por quien tiene las credenciales privadas.
// No recibe el patrón por argumento (evita dejarlo en el historial del terminal).
await loadEnv();
if(!process.env.OWNER_RECOVERY_PATTERN)throw Error('Define OWNER_RECOVERY_PATTERN en el .env privado antes de ejecutar esta herramienta.');
const value=pattern(process.env.OWNER_RECOVERY_PATTERN.split('').map(Number)),env=config(),db=await database(env);
await db.collection('settings').updateOne({_id:'owner'},{$set:{...await hashPattern(value),initial:false,changedAt:new Date()},$inc:{version:1}},{upsert:true});
console.log('Patrón restablecido; las sesiones anteriores ya no son válidas. Retira OWNER_RECOVERY_PATTERN del .env.');
process.exit(0);
