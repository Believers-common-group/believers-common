# Believers Common

Canonical source repository for the Believers Common public web surface.

## Site federation

This site participates in `REG-SITE-001` with Creators Common and Virtual Silk Road.

- Site id: `bc`
- Canonical domain: `https://believerscommon.com`
- Containing node: `ALPHA-NODE-001`
- Authority boundary: `WARDEN`
- Federation metadata: `/.well-known/estate-site`
- Health: `/health`

The site is a public projection and must not self-issue identity, authority or Warden grants.

## Deployment contract

- Production source branch: `main`
- Hosting target: static deployment
- Project root: repository root (`.`)
- Public entry point: `index.html`

No database, model-provider or private Registry credentials are required for this static first slice.
