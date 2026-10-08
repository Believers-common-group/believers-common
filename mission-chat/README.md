# Commons Mission Chat — R0.2 sandbox proposal

This folder contains the **single-file, client-side R0.2 prototype** for location-owned mission windows, corporate-office navigation, side-by-side chat contexts, and demonstration Patch/Port operations.

**Status:** SANDBOX PROTOTYPE / NOT A LIVE COMMONS SERVICE.

## Public deployment restrictions

- Do **not** promote this branch to the live site before governance review, including public information classification, repository approval and a browser-side security review.
- Keep sample data only. Never enter private WhatsApp messages, personal information, client records, secrets, contract documents or legally relied-upon evidence in the public demonstration.
- This code uses browser-local storage and does not authenticate DigitalMe identities.
- It does **not** create Genesis locations, issue Warden authorizations, connect to VRChat or WhatsApp accounts, or write RiverOS evidence.
- VRChat world references are external links, not ownership or access validation.
- Browser SHA-256 supports comparison to an original file; it does not authenticate messages or establish a legal chain of custody.
- Patch/Port operations are locally simulated; no server-side transfer occurs.
- Browser storage is editable. Do not use it as a custody or legal evidence store.

## Architecture sequence

`DigitalMe identity → Warden authority → Genesis reachability → Synnergyze orchestration → authorized ARK/provider execution → RiverOS evidence`

MR-03 Translator preserves human intent and explains technical outcomes; it never grants authority.

## Acceptance checks before merging

1. Confirm the existing `/`, `/health`, and `/.well-known/estate-site` routes remain intact.
2. Test `/mission-chat/` on mobile and desktop.
3. Test location navigation, linked Corporate Office, multi-context window creation, and side-by-side view.
4. Test Patch and Port previews; verify no network writes and structure-only copying by default.
5. Verify invalid VRChat world URLs are rejected and registration is reference-only.
6. Verify authorized test file hashing over HTTPS with a separately calculated SHA-256.
7. Ensure no private data, credentials, trackers, user browser access, or Warden authority claims are introduced.
8. Complete Commons Registry origin/licence/code-reference review, then Warden release approval.

## Planned R0.3 gate

Integrate registered canonical locations and DigitalMe membership, Warden authorization for source disclosure and per-destination receiving, idempotent operations, and append-only RiverOS evidence. Do not simulate permission decisions as if authoritative.

The `main` branch remains the live public-site source. This change is proposed through a **draft pull request** and must not be auto-merged.
