# OPDX.AI Landing Page

A high-performance "Launching Soon" landing page for OPDX.AI, built with Astro and deployed on Cloudflare Pages.

## Features

- ⚡ **Blazing Fast**: Static-first rendering with minimal JavaScript
- 🎯 **Countdown Timer**: Real-time countdown to launch date with timezone support
- 📧 **Waitlist Signup**: Email capture with Cloudflare Turnstile anti-spam
- 📊 **Analytics Ready**: Plausible integration support
- ♿ **Accessible**: WCAG 2.2 AA compliant
- 🚀 **Performance**: Optimized for Lighthouse scores ≥ 95

## Tech Stack

- [Astro](https://astro.build/) - Static-first framework
- [React](https://react.dev/) - For interactive components (islands)
- [Cloudflare Pages](https://pages.cloudflare.com/) - Hosting
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless functions
- [Cloudflare KV](https://developers.cloudflare.com/kv/) - Edge storage
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) - Bot protection

## Project Structure

```
opdx.ai/
├── public/
│   ├── favicon.svg
│   └── icons/
├── src/
│   ├── components/
│   │   ├── CountdownIsland.tsx    # Interactive countdown timer
│   │   ├── EmailForm.tsx          # Waitlist form with Turnstile
│   │   ├── Header.astro           # Site header
│   │   ├── Footer.astro           # Site footer
│   │   └── CalendarLinks.astro   # Calendar event links
│   ├── layouts/
│   │   └── BaseLayout.astro       # Base page layout
│   ├── lib/
│   │   ├── config.ts              # Configuration & feature flags
│   │   ├── time.ts                # Time utilities
│   │   └── validators.ts          # Validation utilities
│   ├── pages/
│   │   ├── index.astro            # Landing page
│   │   ├── privacy.astro          # Privacy policy
│   │   ├── terms.astro             # Terms of service
│   │   └── sitemap.xml.ts         # Sitemap generator
│   └── styles/
│       ├── global.css             # Global styles
│       ├── home.css               # Homepage styles
│       ├── countdown.css          # Countdown styles
│       ├── form.css               # Form styles
│       └── legal.css              # Legal page styles
├── functions/
│   └── api/
│       ├── waitlist.ts            # Waitlist API endpoint
│       ├── og.ts                  # OG image generator
│       └── calendar.ics.ts        # Calendar file generator
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── wrangler.toml
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account
- Cloudflare Turnstile site key and secret

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd opdx.ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Create a Cloudflare KV namespace:
```bash
npx wrangler kv:namespace create "OPDX_WAITLIST"
```

5. Update `wrangler.toml` with your KV namespace ID:
```toml
[[kv_namespaces]]
binding = "OPDX_WAITLIST"
id = "your-namespace-id"
```

### Development

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:4321` to see the site.

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Environment Variables

Create a `.env` file or set these in Cloudflare Pages:

### Required

- `CF_TURNSTILE_SITE_KEY` - Cloudflare Turnstile site key
- `CF_TURNSTILE_SECRET` - Cloudflare Turnstile secret key

### Optional

- `PUBLIC_LAUNCH_READY` - Set to `"true"` when ready to launch (enables indexing)
- `PUBLIC_ENABLE_WAITLIST` - Set to `"false"` to disable waitlist form (default: enabled)
- `PUBLIC_ENABLE_SOCIAL` - Set to `"true"` to show social links
- `PUBLIC_TURNSTILE_SITE_KEY` - Public Turnstile site key (for client-side)
- `PUBLIC_TWITTER_URL` - Twitter/X profile URL
- `PUBLIC_LINKEDIN_URL` - LinkedIn profile URL
- `PUBLIC_PLAUSIBLE_DOMAIN` - Plausible analytics domain
- `WEBHOOK_URL` - Optional webhook URL for waitlist submissions

### Setting Environment Variables in Cloudflare Pages

1. Go to your Cloudflare Pages project
2. Navigate to Settings → Environment variables
3. Add variables for Production, Preview, or both

## Deployment

### Cloudflare Pages

1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Add environment variables (see above)
5. Bind KV namespace:
   - Settings → Functions → KV Namespace Bindings
   - Add `OPDX_WAITLIST` binding

### DNS Setup

1. Add your domain in Cloudflare Pages
2. Point your domain's A record to Cloudflare Pages
3. Enable HTTPS and HSTS

## Configuration

### Launch Date

The launch date is configured in `src/lib/time.ts`:
```typescript
export const LAUNCH_DATE_IST = '2025-12-04T10:00:00+05:30';
```

### Content Customization

Edit `src/lib/config.ts` to customize:
- Headlines
- Feature descriptions
- Social links
- Contact information

### Branding

Update colors and fonts in `src/styles/global.css`:
```css
:root {
  --color-primary: #4C7DFF;
  --color-accent: #22CC88;
  /* ... */
}
```

### Logo Replacement

To replace the text logo with an SVG:
1. Place your logo at `public/logo.svg`
2. Update `src/components/Header.astro`:
```astro
<img src="/logo.svg" alt="OPDX.AI" class="logo-image" />
```

## Feature Flags

Control features using environment variables:

- **LAUNCH_READY**: When `true`, enables indexing (removes `noindex`) and shows "We're live" state
- **ENABLE_WAITLIST**: Toggle waitlist form visibility
- **ENABLE_SOCIAL**: Toggle social media links

## Testing

### Local Testing

Test the waitlist API locally with Wrangler:
```bash
npx wrangler pages dev dist --kv OPDX_WAITLIST=your-namespace-id
```

### Checklist

- [ ] Countdown shows correct time in different timezones
- [ ] Email form validates correctly
- [ ] Turnstile verification works
- [ ] KV storage persists entries
- [ ] OG image generates correctly
- [ ] Calendar ICS file downloads
- [ ] Robots meta toggles with `LAUNCH_READY`
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: screen reader announces countdown
- [ ] Performance: Lighthouse scores ≥ 95

## Performance Optimization

- Minimal JavaScript (only countdown and form islands)
- Inline critical CSS
- System font fallbacks
- Lazy loading for non-critical assets
- Optimized bundle size (target: < 50KB gzipped)

## Analytics

Plausible analytics is included (if `PUBLIC_PLAUSIBLE_DOMAIN` is set). Events tracked:
- `waitlist_submit` - User submits email
- `turnstile_fail` - Turnstile verification fails

## API Endpoints

### POST `/api/waitlist`

Submit email to waitlist.

**Request:**
```json
{
  "email": "user@example.com",
  "token": "turnstile-token"
}
```

**Response:**
```json
{
  "message": "Success"
}
```

### GET `/api/og`

Generate Open Graph image (returns SVG).

### GET `/api/calendar.ics`

Download calendar event file.

## Troubleshooting

### Turnstile not loading
- Check `PUBLIC_TURNSTILE_SITE_KEY` is set
- Verify Turnstile domain whitelist in Cloudflare dashboard

### KV writes failing
- Verify KV namespace is bound in Cloudflare Pages
- Check namespace ID in `wrangler.toml`

### Build errors
- Ensure Node.js version is 18+
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

## License

© 2025 OPDX.AI

## Support

For questions or issues, contact: hello@opdx.ai

