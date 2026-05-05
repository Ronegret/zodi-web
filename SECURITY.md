# Security Notes

## Secrets

- Keep `CLAUDE_API_KEY` only on the server.
- Prefer server environment variables.
- If Hostinger does not expose environment variables, place `.zodi-secret.php` one level above the public web root.
- `.gitignore` excludes `.env`, `.env.*`, `.zodi-secret.php`, and common key/token files.

## Firebase

The Firebase web config in the bundled frontend is not a private server secret, but the Firebase project must be protected with:

- Authorized production domains.
- Google sign-in enabled only for intended apps.
- Firestore security rules that restrict profile, friendship, and message access to authenticated users.

## API bridge

`api.php` should remain server-side. For production hardening, consider:

- Restricting CORS to the production domain instead of `*`.
- Adding authentication/session checks before proxying AI calls.
- Adding rate limiting per IP/user.
- Logging API errors without logging prompts or secret headers.

