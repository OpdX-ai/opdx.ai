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
git clone <your-repo-url>
cd opdx.ai
```

2. Open `index.html` in your browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Or use a local server (recommended):
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## 🌐 Deployment Options

### Option 1: Netlify (Recommended)

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Click "Deploy site"
6. Configure your custom domain (opdx.ai) in Netlify settings

### Option 2: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts
4. Configure your custom domain in Vercel dashboard

### Option 3: GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select the branch to deploy (usually `main`)
4. Save and wait for deployment
5. Configure your custom domain in GitHub Pages settings

### Option 4: Traditional Hosting (cPanel, etc.)

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

