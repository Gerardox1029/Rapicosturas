import test from 'node:test';
import assert from 'node:assert/strict';
import {crossedPoints} from '../../src/web/pattern.js';
const centers=Array.from({length:9},(_,i)=>({id:i+1,x:50+i%3*100,y:50+Math.floor(i/3)*100}));
test('la diagonal 7→3 cruza sólo el centro y no los puntos laterales',()=>{assert.deepEqual(crossedPoints({x:50,y:250},{x:250,y:50},centers,23,[7]),[5,3]);});
test('la diagonal 1→9 cruza sólo 5 y 9 aun saltando eventos',()=>{assert.deepEqual(crossedPoints({x:50,y:50},{x:250,y:250},centers,23,[1]),[5,9]);});
test('el borde de una celda cuadrada no activa ningún punto',()=>{assert.deepEqual(crossedPoints({x:95,y:95},{x:95,y:95},centers,23),[]);});
test('tolera una pequeña desviación diagonal sin añadir vecinos',()=>{assert.deepEqual(crossedPoints({x:56,y:250},{x:247,y:55},centers,23,[7]),[5,3]);});
test('un trazo N rápido conserva el orden de siete puntos',()=>{let seq=[7];for(const [a,b] of [[7,1],[1,9],[9,3]])seq.push(...crossedPoints(centers[a-1],centers[b-1],centers,23,seq));assert.deepEqual(seq,[7,4,1,5,9,6,3]);});
