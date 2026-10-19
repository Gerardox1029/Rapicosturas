export async function cleanup({db,store,clock=()=>new Date()}){
 const files=db.collection('media'),now=clock();
 // Archivos reclamados cuyo registro no llegó a guardarse, o adjuntos perdedores
 // de dos confirmaciones simultáneas, también deben tener una salida de limpieza.
 for(const f of await files.find({status:'attached',attachedAt:{$lte:new Date(+now-86400000)}}).limit(150).toArray()){
  const parent=await db.collection(f.kind==='tutorial'?'videos':'shipments').findOne({_id:f.kind==='tutorial'?f.videoId:f.shipmentId});
  const linked=parent&&(f.kind==='tutorial'?parent.mediaId===f._id&&parent.status==='active':[parent.evidenceId,parent.receiptEvidenceId].includes(f._id));
  if(!linked)await files.updateOne({_id:f._id},{$set:{expiresAt:now}});
 }
 // Repara una interrupción ocurrida después de guardar la recepción pero antes de
 // actualizar el vencimiento de sus archivos. El acceso ya respeta el registro.
 for(const s of await db.collection('shipments').find({status:'received',evidenceExpiresAt:{$lte:now}}).limit(100).toArray())await files.updateMany({shipmentId:s._id,status:'attached'},{$set:{expiresAt:new Date(s.evidenceExpiresAt)}});
 const expired=await files.find({status:{$in:['attached','uploaded','ticket','verifying','deleting']},expiresAt:{$lte:now,$ne:null}}).limit(150).toArray();
 let removed=0,failed=0;
 for(let offset=0;offset<expired.length;offset+=5)await Promise.all(expired.slice(offset,offset+5).map(async file=>{try{await store.delete(file.objectKey);if(file.stagingKey)await store.delete(file.stagingKey);await files.updateOne({_id:file._id},{$set:{status:file.kind==='evidence'?'expired':'deleted',deletedAt:clock()}});removed++;}catch{failed++;}}));
 // Una URL PUT antigua sólo puede recrear un objeto temporal; nunca sobreescribe
 // la copia definitiva. Suprimir esos temporales después de vencer la URL.
 for(const file of await files.find({stagingKey:{$exists:true},stagingCleanupAt:{$lte:now},stagingCleanedAt:{$exists:false}}).limit(100).toArray()){try{await store.delete(file.stagingKey);await files.updateOne({_id:file._id},{$set:{stagingCleanedAt:clock()}});}catch{failed++;}}
 return {removed,failed};
}
