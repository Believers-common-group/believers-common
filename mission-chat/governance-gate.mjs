// Commons Mission Chat Gate 2 — R0.3 contract prototype.
// This is public-client REVIEW logic only. It NEVER grants authorization or performs transfers.
// Genesis/Registry resolution and graph links are not Warden permission.
// The canonical server sequence is Identity -> Authority -> Reachability -> Orchestration -> Execution -> Evidence.
export const CONTRACT = 'commons.mission.transfer-intent.v1';
const MODES = new Set(['PATCH','PORT']);
function fail(code) { throw new Error(code); }
function unique(a) { return Array.isArray(a) && new Set(a).size===a.length; }
function nonblank(s) { return typeof s==='string' && s.trim().length>0; }
export function validateSnapshot(data) {
  if (!data || data.contract!=='commons.location.snapshot.v1' || data.environment!=='DEMO_ONLY' || data.issuer!=='LOCAL_DEMONSTRATION_NOT_GENESIS') fail('SNAPSHOT_NOT_TRUSTED_DEMO');
  if (!Array.isArray(data.locations)||!Array.isArray(data.windows)||!Array.isArray(data.links)) fail('SNAPSHOT_STRUCTURE_INVALID');
  const locRefs=data.locations.map(l=>l.ref),winRefs=data.windows.map(w=>w.ref),linkRefs=data.links.map(l=>l.ref);
  if (!unique(locRefs)||!unique(winRefs)||!unique(linkRefs)) fail('DUPLICATE_REFERENCE');
  const locations=new Map(data.locations.map(l=>[l.ref,l]));
  for (const l of data.locations) {
    if (!nonblank(l.ref)||!nonblank(l.estate_ref)||!nonblank(l.place_ref)||!nonblank(l.name)||!Array.isArray(l.doors)||l.registration_state!=='UNREGISTERED') fail('LOCATION_NOT_REGISTERED_DEMO');
    const doorRefs=l.doors.map(d=>d.ref);
    if(!unique(doorRefs)) fail('DUPLICATE_DOOR');
    for(const d of l.doors) {
      if(!nonblank(d.ref)||!Array.isArray(d.rooms)||!unique(d.rooms.map(r=>r.ref))||d.rooms.some(r=>!nonblank(r.ref))) fail('INVALID_ROOM');
    }
  }
  for(const w of data.windows) {
    const l=locations.get(w.location_ref);
    if(!l||!nonblank(w.ref)||!l.doors.some(d=>d.ref===w.door_ref&&d.rooms.some(r=>r.ref===w.room_ref))) fail('WINDOW_PARENT_MISMATCH');
  }
  for(const link of data.links) {
    if(!locations.has(link.source_ref)||!locations.has(link.target_ref)||link.source_ref===link.target_ref||link.type!=='DEMO_NAVIGATION') fail('LINK_INVALID');
  }
  return true;
}
export function linkedLocations(snapshot,sourceRef) {
  validateSnapshot(snapshot);
  if (!snapshot.locations.some(l=>l.ref===sourceRef)) fail('SOURCE_UNKNOWN');
  const targets=new Set(snapshot.links.filter(l=>l.source_ref===sourceRef).map(l=>l.target_ref));
  return snapshot.locations.filter(l=>targets.has(l.ref));
}
export function prepareTransferReview(snapshot, input) {
  validateSnapshot(snapshot);
  if (!input || !MODES.has(input.mode)) fail('MODE_INVALID');
  if (!snapshot.locations.some(l=>l.ref===input.sourceLocationRef)) fail('SOURCE_UNKNOWN');
  if (!Array.isArray(input.windowRefs)||!input.windowRefs.length||!unique(input.windowRefs)) fail('WINDOW_SELECTION_INVALID');
  if (!Array.isArray(input.destinationLocationRefs)||!input.destinationLocationRefs.length||!unique(input.destinationLocationRefs)) fail('TARGET_SELECTION_INVALID');
  if (input.mode==='PORT'&&input.destinationLocationRefs.length!==1) fail('PORT_SINGLE_TARGET_ONLY');
  if (input.includeMessages===true) fail('MESSAGE_COPY_NOT_ADMITTED');
  if (input.windowRefs.some(ref=>!snapshot.windows.some(w=>w.ref===ref&&w.location_ref===input.sourceLocationRef))) fail('WINDOW_NOT_IN_SOURCE');
  const targets=new Set(linkedLocations(snapshot,input.sourceLocationRef).map(l=>l.ref));
  if (input.destinationLocationRefs.some(ref=>!targets.has(ref))) fail('TARGET_LINK_NOT_VERIFIED');
  return Object.freeze({
    contract:CONTRACT,
    mode:input.mode,
    source_location_ref:input.sourceLocationRef,
    source_window_refs:[...input.windowRefs],
    targets:input.destinationLocationRefs.map(ref=>({
      target_location_ref:ref,
      registry_resolution:'DEMO_UNREGISTERED',
      digitalme_identity:'UNVERIFIED',
      warden_source_disclosure:'NOT_EVALUATED',
      warden_target_receive:'NOT_EVALUATED',
      river_reservation:'NOT_PRESENT',
      execution:'BLOCKED'
    })),
    include_messages:false,
    intent_status:'REVIEW_ONLY',
    execution_status:'DENIED_NO_TRUSTED_BACKEND',
    note:'Navigation link is NOT transfer authority; independent Warden checks per source and target required.'
  });
}
// No permit path exists in this client-side module. Production admission must be
// implemented server-side using trusted DigitalMe verification, Warden signature/
// scope/expiry checks, provider entitlement and River reservation. A JSON response
// or a browser flag is never sufficient.
export function authorizeExecution() {
  return Object.freeze({decision:'DENY',reason:'NO_TRUSTED_DIGITALME_WARDEN_RIVER_BACKEND',effects:0});
}
