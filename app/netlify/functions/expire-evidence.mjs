import {config as loadConfig,database,objectStore} from '../../server/infrastructure.mjs';
import {cleanup} from '../../server/cleanup.mjs';
export default async function(){const env=loadConfig(),result=await cleanup({db:await database(env),store:objectStore(env)});return new Response(JSON.stringify(result),{status:result.failed?503:200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}
export const config={schedule:'@hourly'};
