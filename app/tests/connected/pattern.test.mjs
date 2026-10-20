import test from 'node:test';
import assert from 'node:assert/strict';
import {crossedPoints} from '../../src/web/pattern.js';
const centers=Array.from({length:9},(_,i)=>({id:i+1,x:50+i%3*100,y:50+Math.floor(i/3)*100}));
test('la diagonal 7→3 cruza sólo el centro y no los puntos laterales',()=>{assert.deepEqual(crossedPoints({x:50,y:250},{x:250,y:50},centers,23,[7]),[5,3]);});
test('la diagonal 1→9 cruza sólo 5 y 9 aun saltando eventos',()=>{assert.deepEqual(crossedPoints({x:50,y:50},{x:250,y:250},centers,23,[1]),[5,9]);});
test('el borde de una celda cuadrada no activa ningún punto',()=>{assert.deepEqual(crossedPoints({x:95,y:95},{x:95,y:95},centers,23),[]);});
test('tolera una pequeña desviación diagonal sin añadir vecinos',()=>{assert.deepEqual(crossedPoints({x:56,y:250},{x:247,y:55},centers,23,[7]),[5,3]);});
test('un trazo N rápido conserva el orden de siete puntos',()=>{let seq=[7];for(const [a,b] of [[7,1],[1,9],[9,3]])seq.push(...crossedPoints(centers[a-1],centers[b-1],centers,23,seq));assert.deepEqual(seq,[7,4,1,5,9,6,3]);});
import {mountPattern} from '../../src/web/pattern.js';
function fakeRoot(){const node=()=>({setAttribute(){}}),buttons=Array.from({length:9},node),line=node(),tail=node();return {isConnected:true,classList:{add(){}},setAttribute(){},setPointerCapture(){},querySelectorAll:()=>buttons,querySelector:s=>s==='polyline'?line:tail,getBoundingClientRect:()=>({left:0,top:0,width:300,height:300})};}
test('soltar el patrón valida automáticamente y el siguiente trazo empieza limpio',()=>{const root=fakeRoot(),completed=[],changes=[],grid=mountPattern(root,s=>changes.push(s),{onComplete:s=>completed.push(s)}),event=n=>({...centers[n-1],clientX:centers[n-1].x,clientY:centers[n-1].y,button:0,buttons:1,pointerId:1,preventDefault(){}});root.onpointerdown(event(7));for(const n of [1,9,3])root.onpointermove(event(n));root.onpointerup(event(3));assert.deepEqual(completed,[[7,4,1,5,9,6,3]]);root.onpointerdown(event(1));root.onpointerup(event(1));assert.deepEqual(completed.at(-1),[1]);grid.setDisabled(true);root.onpointerdown(event(9));assert.deepEqual(changes.at(-1),[1]);});
