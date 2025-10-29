/**
 * Configuration and feature flags
 */

export const CONFIG = {
  // Feature flags (read from environment)
  LAUNCH_READY: import.meta.env.PUBLIC_LAUNCH_READY === 'true',
  ENABLE_WAITLIST: import.meta.env.PUBLIC_ENABLE_WAITLIST !== 'false',
  ENABLE_SOCIAL: import.meta.env.PUBLIC_ENABLE_SOCIAL === 'true',

  // Content
  headline: 'Streamline your OPD operations. OPDX.AI is launching soon.',
  subHeadline: 'A comprehensive platform for clinic doctors: appointments, patient records, and payments, all in one place.',
  ctaPrimary: 'Join the waitlist',
  ctaSuccess: "You're in. We'll notify you on launch day.",
  countdownLabel: 'Launching on December 4, 2025',
  footerNote: '© 2025 OPDX.AI — Transforming healthcare operations.',

  // URLs
  siteUrl: 'https://opdx.ai',
  contactEmail: 'hello@opdx.ai',
  
  // Social links (optional)
  twitterUrl: import.meta.env.PUBLIC_TWITTER_URL || '',
  linkedinUrl: import.meta.env.PUBLIC_LINKEDIN_URL || '',

  // Turnstile
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
} as const;

