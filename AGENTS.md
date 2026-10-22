<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Accessibility preferences live in the browser (src/lib/acessibilidade.tsx, applied as <html> classes + inline pre-paint script); notification preferences live in the profiles table — device-local vs account-wide.
- Keep calendar and WhatsApp sharing in browser-safe URL helpers: Google event creation requires user confirmation and WhatsApp never sends automatically. Companion contact is account-wide in profiles under existing own-user policies.
