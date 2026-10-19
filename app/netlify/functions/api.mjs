import {config,database,objectStore} from '../../server/infrastructure.mjs';
import {createService,json} from '../../server/service.mjs';
let service;
export default async function handler(request,context){try{const env=config();service??=database(env).then(db=>createService({db,store:objectStore(env),env})).catch(error=>{service=null;throw error;});return (await service).handle(request,context);}catch(error){return json({error:error.status?error.message:'No se pudo conectar con el servicio de datos.'},error.status||503);}}
