// La detección se hace sobre círculos, no sobre las celdas cuadradas del layout.
export function crossedPoints(from,to,centers,radius,excluded=[]){
  const dx=to.x-from.x,dy=to.y-from.y,length2=dx*dx+dy*dy;
  return centers.map(c=>{
    const t=length2?Math.max(0,Math.min(1,((c.x-from.x)*dx+(c.y-from.y)*dy)/length2)):0;
    return {...c,t,distance:Math.hypot(c.x-from.x-t*dx,c.y-from.y-t*dy)};
  }).filter(c=>!excluded.includes(c.id)&&c.distance<=radius).sort((a,b)=>a.t-b.t).map(c=>c.id);
}

export function mountPattern(root,onChange,{onComplete=()=>{}}={}){
  let sequence=[],dragging=false,previous=null,disabled=false,keyTimer;
  root.classList.add('pattern-grid');
  root.innerHTML=`<svg class="pattern-lines" viewBox="0 0 300 300" aria-hidden="true"><polyline fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><line class="pattern-tail" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".4" visibility="hidden"/></svg>${Array.from({length:9},(_,i)=>`<button type="button" data-point="${i+1}" aria-label="Punto ${i+1}" aria-pressed="false"><span></span></button>`).join('')}`;
  const buttons=[...root.querySelectorAll('button')],line=root.querySelector('polyline'),tail=root.querySelector('line');
  const coordinate=n=>({x:50+((n-1)%3)*100,y:50+Math.floor((n-1)/3)*100});
  const geometry=()=>{const r=root.getBoundingClientRect();return {rect:r,centers:buttons.map((b,i)=>{const c=coordinate(i+1);return {id:i+1,x:r.left+c.x*r.width/300,y:r.top+c.y*r.height/300};}),radius:Math.min(r.width,r.height)/3*.23};};
  function add(n){if(sequence.includes(n))return;sequence.push(n);buttons[n-1].setAttribute('aria-pressed','true');line.setAttribute('points',sequence.map(n=>{const c=coordinate(n);return `${c.x},${c.y}`;}).join(' '));onChange([...sequence]);}
  function clear(){clearTimeout(keyTimer);sequence=[];dragging=false;previous=null;buttons.forEach(b=>b.setAttribute('aria-pressed','false'));line.setAttribute('points','');tail.setAttribute('visibility','hidden');onChange([]);}
  function move(e){
    const current={x:e.clientX,y:e.clientY},g=geometry();for(const id of crossedPoints(previous||current,current,g.centers,g.radius,sequence))add(id);previous=current;
    if(sequence.length){const last=coordinate(sequence.at(-1));tail.setAttribute('x1',last.x);tail.setAttribute('y1',last.y);tail.setAttribute('x2',Math.max(0,Math.min(300,(current.x-g.rect.left)/g.rect.width*300)));tail.setAttribute('y2',Math.max(0,Math.min(300,(current.y-g.rect.top)/g.rect.height*300)));tail.setAttribute('visibility','visible');}
  }
  root.onpointerdown=e=>{if(disabled||e.button!==0)return;const current={x:e.clientX,y:e.clientY},g=geometry();const points=crossedPoints(current,current,g.centers,g.radius);if(!points.length)return;e.preventDefault();if(sequence.length)clear();dragging=true;previous=current;add(points[0]);root.setPointerCapture(e.pointerId);};
  root.onpointermove=e=>{if(dragging&&e.buttons)move(e);};
  root.onpointerup=e=>{const completed=dragging;if(dragging)move(e);dragging=false;previous=null;tail.setAttribute('visibility','hidden');if(completed&&sequence.length)onComplete([...sequence]);};
  root.onlostpointercapture=()=>{dragging=false;previous=null;tail.setAttribute('visibility','hidden');};root.onpointercancel=clear;
  root.onkeydown=e=>{if(disabled||!['Enter',' '].includes(e.key))return;const b=e.target.closest('[data-point]');if(b){e.preventDefault();add(Number(b.dataset.point));clearTimeout(keyTimer);keyTimer=setTimeout(()=>{if(root.isConnected)onComplete([...sequence]);},900);}};
  return {clear,setDisabled(value){disabled=value;root.setAttribute('aria-busy',String(value));}};
}
