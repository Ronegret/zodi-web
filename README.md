# ZODI Hostinger Neon PWA

ZODI is a static PWA build for Hostinger with a PHP API bridge for AI readings, Firebase authentication, and local review support.

## Run locally

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:4173/
```

The in-app browser can block Google popups on localhost. For local UX review, `zodi-google-bridge.js` creates a local Google-style review profile. In production it uses Firebase Google sign-in.

## Production deploy

Upload the public files in this directory to the Hostinger public root:

- `index.html`
- `api.php`
- `manifest.webmanifest`
- `sw.js`
- `assets/`
- `signs/`
- media and image assets used by the app
- `zodi-google-bridge.js`
- `zodi-ux-polish.css`

After deploy, verify:

- Firebase Authentication has Google enabled.
- The production domain is listed in Firebase Authorized domains.
- The service worker cache version in `sw.js` changes when assets change.

## API secrets

Never commit API keys.

`api.php` reads the Anthropic/Claude key from one of these server-side locations:

1. `CLAUDE_API_KEY` environment variable.
2. `../.zodi-secret.php`, one level above the public web root.

Example secret file outside `public_html`:

```php
<?php
return ['CLAUDE_API_KEY' => 'replace_with_real_key'];
```

Do not place `.zodi-secret.php` inside this repository or the public web root.

## Notes

This folder currently contains the deployed build artifacts rather than the original React source project. Treat changes here as production patching unless/until the source app is restored.

