/**
 * Time utilities for countdown timer
 * Launch date: December 4, 2025, 10:00 IST (Asia/Kolkata, UTC+05:30)
 */

export const LAUNCH_DATE_IST = '2025-12-04T10:00:00+05:30';
export const LAUNCH_DATE_UTC = '2025-12-04T04:30:00Z';

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

/**
 * Get the launch date as a Date object in UTC
 */
export function getLaunchDate(): Date {
  return new Date(LAUNCH_DATE_UTC);
}

/**
 * Calculate time remaining until launch in the visitor's local timezone
 */
export function getTimeRemaining(): TimeRemaining {
  const now = new Date();
  const launch = getLaunchDate();
  const total = launch.getTime() - now.getTime();

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total };
}

/**
 * Check if launch date has passed
 */
export function isLaunchDatePassed(): boolean {
  return getTimeRemaining().total <= 0;
}

/**
 * Format launch date for display in visitor's locale
 */
export function formatLaunchDate(): string {
  const launch = getLaunchDate();
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(launch);
}

/**
 * Generate calendar event date in UTC for ICS
 */
export function getCalendarDateUTC(): string {
  const launch = getLaunchDate();
  return launch.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

