# Gate 2 — Commons Location and Warden Integration Contract R0.3 (proposal)

**Status:** UI / schema / client-side fail-closed proof only. Not registered, authorized or deployed to `main`.

## Purpose and canonical boundary

A Commons Location owns Doors → Rooms → Windows. Each Location may have different contexts and an optional linked Corporate Office Location. The canonical hierarchy remains:

`Earth → Virtual Estate → Place → Location → Door → Room → Window / Stage → Activity`.

Links between locations can support **navigation** or later **proposed** operations, but a link is not evidence that locations are connected to shared infrastructure or to each other's data. A VRChat world, WhatsApp group and Mission Chat are presentation/evidence channels attached to an authorized canonical location, not authority sources.

Existing canonical contract references to preserve:

- `Believers-common-group/genesis-stack/README.md` — Genesis parent & federated integration model.
- `Believers-common-group/Virtual-Silk-road/contracts/registry/README.md` — R1–R5 paper spine, Registry context resolution, independent Warden admission and River reservations.
- `Believers-common-group/Virtual-Silk-road/contracts/registry/v1/registry-contract.schema.json` — digital-me principal and authority resolution semantics.
- `Believers-common-group/DigitalMe/contracts/README.md` — identity/context continuity is separate from execution authority.

## Bounded files

- `contracts/location-snapshot.v1.schema.json`: demo-only location, door, room and window hierarchy.
- `fixtures/demo-locations.v1.json`: public entry points and unverified office placeholder, explicitly UNREGISTERED.
- `contracts/transfer-intent.v1.schema.json`: **review only**, per-target DENIED decisions.
- `governance-gate.mjs`: pure client-side validation and transfer preview; no grant or execution code.
- `governance-review.html`: location navigation and proposed transfer scope visualization.
- `tests/governance-gate.test.mjs`: negative-path conformance checks.

## Prospective back-end adapters (NOT implemented)

1. **GET /api/commons/locations** — after authenticated requester context, return only Registry-resolved locations and Doors/Rooms/Windows they are permitted to discover. Proof: trusted provenance and freshness; avoid leaking private locations.
2. **POST /api/commons/transfer-intents** — accept source window refs, destination refs, mode, content-scope, reason, correlation ID and idempotency key. Validate DigitalMe principal/session at trusted boundary; never accept self-declared roles.
3. **POST /internal/warden/admission** — evaluate source read/disclosure and each destination receive/write separately, with licence, consent, residency, data-classification and mandate checks. Decision is bound to requester, purpose, payload hash, exact destinations, expiry and policy version; verify through a trusted server-to-server mechanism.
4. **POST /internal/river/reservations** — reserve evidence for each admitted effect, preserving request, Warden decision proof, source lineage, timestamp and expected outcome.
5. **POST /internal/synnergyze/dispatch** — only on authorized, unexpired, destination-specific decision and reserved evidence. Execute via registered ARK/provider, with idempotency and rejection of partial/duplicate dispatch.
6. **POST /internal/river/receipts** — append-only result/exception/provenance. Partial failures are recorded per destination; do not fabricate a complete batch success.
7. **GET /api/commons/operations/:id** — authenticated, purpose-limited projection of each destination status, not a substitute for River custody.

These are proposed paths, not claims that endpoints exist. API authentication, transport, schema versioning, threat modelling, and service ownership must be determined before implementation.

## Invariants / non-negotiable rejection cases

- Unknown/missing identity, expired authority, untrusted response, missing registry identity, invalid source room, unsupported provider, private destination, missing River reservation, duplicate idempotency key with changed payload, or failed per-target admission → **deny**.
- Client-browser `ALLOW`, cached authorization, public snapshot or DigitalMe member assertion alone is not sufficient.
- A `PORT` requires one destination; source archive occurs **only** after a successful, evidenced transfer acknowledgment, never on an attempted transfer.
- A `PATCH` may address several targets but each has independent consent, authorization, evidence reservation, result and retry semantics.
- Default payload is window **structure and lineage only**; never include message bodies, attachments or WhatsApp exports without separate explicit grants for every disclosure/recipient.
- No browser localStorage audit trail is relied upon as evidence. RiverOS governs durable receipts.
- WhatsApp electronic records must be independently authenticated, preserved and admitted; VRChat world URLs do not confer membership.
- A corporate office placeholder cannot be promoted to an active office solely through public UI selection.
- MR-03 Translator may preserve intent and derive action specifications but may not grant Warden privileges.

## Required promotion evidence

- Registry-reviewed canonical location IDs and link types, with provenance and appropriate custodian.
- Real DigitalMe authentication and verified organizational role/acting capacity.
- Server-trusted Warden decision receipts and policy-version/expiry enforcement.
- River reservation and receipt implementation, per-target partial-failure tests and reversible rollback behavior.
- Provider connection authentication, entitlement checks and secrets custody.
- Public-data classification, privacy review, security scanning, tests, and delegated release approval.

Only after these gates should any operation appear as `AUTHORIZED`, `SENT` or `EVIDENCED`. Until then the only executable client result is `DENY` with zero effects.
