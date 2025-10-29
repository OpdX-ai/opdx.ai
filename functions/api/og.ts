/**
 * OG Image generator endpoint
 * Returns a simple branded PNG image with headline and date
 */

export const onRequest: PagesFunction = async () => {
  // Simple SVG-based OG image (can be upgraded to use Satori/@vercel/og later)
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0B0F14;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0E1116;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad)"/>
  <text x="600" y="280" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="700" fill="#4C7DFF" text-anchor="middle">
    OPDX.AI
  </text>
  <text x="600" y="360" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="600" fill="#EAF0FF" text-anchor="middle">
    Less hype, more shipping.
  </text>
  <text x="600" y="420" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="400" fill="#22CC88" text-anchor="middle">
    Launching December 4, 2025
  </text>
</svg>`;

  // Convert SVG to PNG using a simple approach
  // For production, use @vercel/og or Satori if available for Cloudflare Workers
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

