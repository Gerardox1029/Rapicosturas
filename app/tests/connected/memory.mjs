const clone=x=>structuredClone(x);
function equal(a,b){return a instanceof Date||b instanceof Date?+new Date(a)===+new Date(b):a===b;}
function matches(doc,query){return Object.entries(query).every(([key,v])=>{if(key==='$or')return v.some(q=>matches(doc,q));if(key==='$and')return v.every(q=>matches(doc,q));const actual=doc[key];if(v&&typeof v==='object'&&!(v instanceof Date)&&!Array.isArray(v))return Object.entries(v).every(([op,expected])=>{if(op==='$ne')return !equal(actual,expected);if(op==='$in')return expected.some(x=>equal(x,actual));if(op==='$exists')return (actual!==undefined)===expected;if(op==='$gt')return actual>expected;if(op==='$lt')return actual<expected;if(op==='$lte')return actual<=expected;throw Error('Unsupported test query '+op);});return equal(actual,v);});}
export class MemoryDB{
 constructor(){this.tables=new Map();}
 collection(name){if(!this.tables.has(name))this.tables.set(name,[]);const rows=this.tables.get(name);function apply(row,update,inserted=false){if(inserted)Object.assign(row,clone(update.$setOnInsert||{}));Object.assign(row,clone(update.$set||{}));for(const [k,v]of Object.entries(update.$inc||{}))row[k]=(row[k]||0)+v;}
  return {async findOne(q){return clone(rows.find(r=>matches(r,q))||null);},find(q={}){let selected=rows.filter(r=>matches(r,q));return {sort(spec){selected.sort((a,b)=>{for(const[k,dir]of Object.entries(spec)){if(a[k]>b[k])return dir;if(a[k]<b[k])return -dir;}return 0;});return this;},limit(n){selected=selected.slice(0,n);return this;},async toArray(){return clone(selected);}};},async insertOne(row){if(rows.some(r=>r._id===row._id||row.requestId&&r.requestId===row.requestId)){const e=Error('duplicate');e.code=11000;throw e;}rows.push(clone(row));return {insertedId:row._id};},async updateOne(q,update,{upsert=false}={}){let row=rows.find(r=>matches(r,q)),inserted=false;if(!row&&upsert){row=clone(q);rows.push(row);inserted=true;}if(row)apply(row,update,inserted);return {matchedCount:row?1:0};},async updateMany(q,update){for(const row of rows.filter(r=>matches(r,q)))apply(row,update);},async findOneAndUpdate(q,update,{upsert=false}={}){let row=rows.find(r=>matches(r,q)),inserted=false;if(!row&&upsert){row=clone(q);rows.push(row);inserted=true;}if(!row)return null;apply(row,update,inserted);return clone(row);},async deleteOne(q){const i=rows.findIndex(r=>matches(r,q));if(i>=0)rows.splice(i,1);},async createIndex(){}};
 }
}
export class MemoryStore{
 constructor(){this.objects=new Map();this.deleted=[];this.reads=[];}
 async uploadURL(f){return 'https://storage.example/'+f.stagingKey;}
 async readURL(f,seconds){this.reads.push({key:f.objectKey,seconds});return 'https://storage.example/'+f.objectKey;}
 async head(key){if(!this.objects.has(key))throw Error('not found');return clone(this.objects.get(key));}
 async copy(from,to){this.objects.set(to,await this.head(from));}
 async delete(key){this.deleted.push(key);this.objects.delete(key);}
 async tutorialUsage(){return [...this.objects].filter(([k])=>k.startsWith('tutorials/')).reduce((n,[,o])=>n+o.sizeBytes,0);}
}
