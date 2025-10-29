# Environment Variables Checklist

Copy this checklist as you add each variable in Cloudflare Pages:

## Production Environment Variables

- [ ] `CF_TURNSTILE_SITE_KEY` = [Your Site Key] (Encrypted: Yes)
- [ ] `CF_TURNSTILE_SECRET` = [Your Secret Key] (Encrypted: Yes)
- [ ] `PUBLIC_TURNSTILE_SITE_KEY` = [Your Site Key] (Encrypted: No)
- [ ] `PUBLIC_LAUNCH_READY` = `false` (Encrypted: No)
- [ ] `PUBLIC_ENABLE_WAITLIST` = `true` (Encrypted: No)
- [ ] `PUBLIC_ENABLE_SOCIAL` = `false` (Encrypted: No)

## Preview Environment Variables

- [ ] `CF_TURNSTILE_SITE_KEY` = [Same as Production] (Encrypted: Yes)
- [ ] `CF_TURNSTILE_SECRET` = [Same as Production] (Encrypted: Yes)
- [ ] `PUBLIC_TURNSTILE_SITE_KEY` = [Same as Production] (Encrypted: No)
- [ ] `PUBLIC_LAUNCH_READY` = `false` (Encrypted: No)
- [ ] `PUBLIC_ENABLE_WAITLIST` = `true` (Encrypted: No)
- [ ] `PUBLIC_ENABLE_SOCIAL` = `false` (Encrypted: No)

## KV Namespace Bindings

- [ ] Production: `OPDX_WAITLIST` → `opdx-ai` namespace
- [ ] Preview: `OPDX_WAITLIST` → `opdx-ai-preview` namespace

