import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateSnapshot, linkedLocations, prepareTransferReview, authorizeExecution, CONTRACT} from '../governance-gate.mjs';

const fixture = JSON.parse(readFileSync(new URL('../fixtures/demo-locations.v1.json',import.meta.url), 'utf8'));
const copy = x => structuredClone(x);
const source='demo:location:believers-common', office='demo:location:corporate-office', creator='demo:location:creators-common';
const basic={mode:'PATCH',sourceLocationRef:source,windowRefs:['demo:window:bc-mission'],destinationLocationRefs:[office],includeMessages:false};
test('snapshot verifies the entire parent hierarchy and unique references',()=>assert.equal(validateSnapshot(fixture),true));
test('demo graph is a navigation hint, not a permission',()=>{
 assert.ok(linkedLocations(fixture,source).some(l=>l.ref===office));
 const review=prepareTransferReview(fixture,basic);
 assert.equal(review.contract,CONTRACT);
 assert.equal(review.targets[0].warden_source_disclosure,'NOT_EVALUATED');
 assert.equal(review.targets[0].warden_target_receive,'NOT_EVALUATED');
 assert.equal(review.targets[0].river_reservation,'NOT_PRESENT');
 assert.equal(review.execution_status,'DENIED_NO_TRUSTED_BACKEND');
});
test('batch patch returns separately denied destination records',()=>{
 const review=prepareTransferReview(fixture,{...basic,destinationLocationRefs:[office,creator]});
 assert.equal(review.targets.length,2);
 assert.ok(review.targets.every(t=>t.execution==='BLOCKED'));
});
test('port requires exactly one destination',()=>{
 assert.throws(()=>prepareTransferReview(fixture,{...basic,mode:'PORT',destinationLocationRefs:[office,creator]}),/PORT_SINGLE_TARGET_ONLY/);
});
test('copying message history is denied, even on linked locations',()=>{
 assert.throws(()=>prepareTransferReview(fixture,{...basic,includeMessages:true}),/MESSAGE_COPY_NOT_ADMITTED/);
});
test('duplicate references are denied',()=>{
 const d=copy(fixture);d.windows.push({...d.windows[0]});assert.throws(()=>validateSnapshot(d),/DUPLICATE_REFERENCE/);
});
test('cross-location room/window forgery is denied',()=>{
 const d=copy(fixture);d.windows[0].door_ref='demo:door:office-corporate';assert.throws(()=>validateSnapshot(d),/WINDOW_PARENT_MISMATCH/);
});
test('unknown destinations are denied',()=>{
 assert.throws(()=>prepareTransferReview(fixture,{...basic,destinationLocationRefs:['demo:location:unknown']}),/TARGET_LINK_NOT_VERIFIED/);
});
test('unlinked destinations are denied',()=>{
 const d=copy(fixture);d.links=d.links.filter(x=>x.target_ref!==office);
 assert.throws(()=>prepareTransferReview(d,basic),/TARGET_LINK_NOT_VERIFIED/);
});
test('source windows must belong to selected source',()=>{
 assert.throws(()=>prepareTransferReview(fixture,{...basic,windowRefs:['demo:window:office-mission']}),/WINDOW_NOT_IN_SOURCE/);
});
test('registry remains unregistered and cannot be promoted by client state',()=>{
 const d=copy(fixture);d.locations[0].registration_state='REGISTERED';assert.throws(()=>validateSnapshot(d),/LOCATION_NOT_REGISTERED_DEMO/);
});
test('a client-side authorization flag cannot cause execution',()=>{
 assert.deepEqual(authorizeExecution({digitalme:'VERIFIED',warden:'ALLOW',river:'RESERVED'}),{decision:'DENY',reason:'NO_TRUSTED_DIGITALME_WARDEN_RIVER_BACKEND',effects:0});
});
test('schema identifiers and fail-closed consts remain frozen',()=>{
 const schema=JSON.parse(readFileSync(new URL('../contracts/transfer-intent.v1.schema.json',import.meta.url),'utf8'));
 assert.equal(schema.properties.execution_status.const,'DENIED_NO_TRUSTED_BACKEND');
 assert.equal(schema.properties.include_messages.const,false);
});
