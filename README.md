# OPDX.ai - Coming Soon Landing Page

A beautiful, modern landing page for OPDX.ai - Where Healthcare Meets Innovation.

## 🚀 Features

- **Countdown Timer** - Live countdown to launch date (December 4th, 2025)
- **Email Notifications** - Visitors can sign up to be notified at launch
- **Responsive Design** - Works perfectly on all devices
- **Modern UI/UX** - Beautiful gradient background with smooth animations
- **Feature Preview** - Showcases key features of the platform

## 🛠️ Technologies Used

- HTML5
- CSS3 (with modern features like Grid, Flexbox, and CSS Variables)
- Vanilla JavaScript (no dependencies!)
- Google Fonts (Inter)

## 📁 Project Structure

```
opdx.ai/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Countdown timer and form handling
└── README.md          # This file
```

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/OpdX-ai/opdx.ai.git
cd opdx.ai
```

2. Start a local server:
```bash
# Using npm scripts
npm run serve

# Or using Python 3
python3 -m http.server 8000

# Or using npx directly
npx serve .
```

Then visit `http://localhost:3000` (or `http://localhost:8000` for Python) in your browser.

## 🌐 Deployment Options

### Quick Deploy Commands

```bash
# Deploy to Cloudflare Pages (recommended - fastest global CDN)
npm run deploy

# Or using npx directly
npx wrangler pages deploy . --project-name=opdx-ai

# Other options:
npm run deploy:vercel
npm run deploy:netlify
npm run deploy:surge
```

### Option 1: Cloudflare Pages (Recommended - Global CDN)

**One-Command Deploy:**
```bash
npm run deploy
# or
npx wrangler pages deploy . --project-name=opdx-ai
```

**First-time setup:**
1. Install Wrangler (optional - npx will handle it):
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   npx wrangler login
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

4. Configure custom domain in Cloudflare dashboard:
   - Go to your [Cloudflare Pages dashboard](https://dash.cloudflare.com/?to=/:account/pages)
   - Select your project
   - Go to "Custom domains"
   - Add `opdx.ai` and `www.opdx.ai`

**OR Connect GitHub (Automatic Deployments):**
1. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click "Connect to Git"
3. Select `OpdX-ai/opdx.ai` repository
4. Configure:
   - Build command: (leave empty)
   - Build output directory: `/`
5. Click "Save and Deploy"
6. Add custom domain `opdx.ai` in settings

### Option 2: Vercel (Fast & Easy)

**One-Command Deploy:**
```bash
npx vercel --prod
```

Or using the dashboard:
1. Go to [Vercel](https://vercel.com/new)
2. Import from GitHub → Select `OpdX-ai/opdx.ai`
3. Click "Deploy"
4. Configure your custom domain (opdx.ai) in project settings

### Option 3: Netlify

**One-Command Deploy:**
```bash
npx netlify-cli deploy --prod --dir=.
```

Or using the dashboard:
1. Go to [Netlify](https://app.netlify.com/start)
2. Click "Import from Git" → GitHub
3. Select `OpdX-ai/opdx.ai` repository
4. Click "Deploy site"
5. Configure your custom domain (opdx.ai) in site settings

### Option 4: GitHub Pages

1. Go to: https://github.com/OpdX-ai/opdx.ai/settings/pages
2. Source: Deploy from a branch → `main` → `/root`
3. Save and wait ~5 minutes
4. Configure custom domain `opdx.ai`

### Option 5: Surge (Quick Testing)

```bash
npx surge . opdx.ai
```

### Option 6: Traditional Hosting (cPanel, etc.)

1. Upload all files via FTP/SFTP to your hosting provider
2. Point your domain to the hosting server
3. Ensure `index.html` is in the public_html or www directory

## 🎨 Customization

### Change Launch Date

Edit `script.js` line 3:
```javascript
const launchDate = new Date('December 4, 2025 00:00:00').getTime();
```

### Update Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #60a5fa;
    /* ... */
}
```

### Modify Content

Edit the text directly in `index.html`.

## 📧 Email Collection

Currently, emails are stored in localStorage (client-side only). For production, you should integrate with:

- **Mailchimp** - Email marketing platform
- **SendGrid** - Email API service
- **Your own backend** - Store in database
- **Google Sheets** - Via Google Forms API
- **Netlify Forms** - Built-in form handling

Example backend integration in `script.js`:
```javascript
// Replace localStorage with API call
fetch('https://your-api.com/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email })
});
```

## 🔒 Custom Domain Setup

1. Log in to your domain registrar (where you bought opdx.ai)
2. Find DNS settings
3. Add the following records (example for Netlify):
   - Type: `A` Record, Host: `@`, Value: `75.2.60.5`
   - Type: `CNAME`, Host: `www`, Value: `your-site.netlify.app`
4. Wait for DNS propagation (can take up to 48 hours, usually much faster)

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📝 License

Copyright © 2025 OPDX.ai. All rights reserved.

## 📞 Contact

For questions or support, email: hello@opdx.ai

---

Built with ❤️ for doctors and healthcare professionals

