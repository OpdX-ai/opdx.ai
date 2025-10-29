/**
 * Configuration and feature flags
 */

import content from './content.json';

export const CONFIG = {
  // Feature flags (read from environment)
  LAUNCH_READY: import.meta.env.PUBLIC_LAUNCH_READY === 'true',
  ENABLE_WAITLIST: import.meta.env.PUBLIC_ENABLE_WAITLIST !== 'false',
  ENABLE_SOCIAL: import.meta.env.PUBLIC_ENABLE_SOCIAL === 'true',

  // Content (from content.json)
  content,
  
  // Hero content (for backward compatibility)
  headline: content.hero.headline,
  subHeadline: content.hero.subhead,
  ctaPrimary: content.hero.primaryCta,
  ctaSuccess: "You're in. We'll notify you on launch day.",
  countdownLabel: 'Launching on December 4, 2025',
  footerNote: content.footer.note,

  // URLs
  siteUrl: 'https://opdx.ai',
  contactEmail: content.footer.contact,
  
  // Social links (optional)
  twitterUrl: import.meta.env.PUBLIC_TWITTER_URL || '',
  linkedinUrl: import.meta.env.PUBLIC_LINKEDIN_URL || '',

  // Turnstile
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
} as const;

