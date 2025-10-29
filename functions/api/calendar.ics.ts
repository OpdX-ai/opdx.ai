/**
 * Calendar ICS file generator
 * Returns an .ics file for the launch date
 * Launch date: December 4, 2025, 10:00 IST = 2025-12-04T04:30:00Z UTC
 */

export const onRequest: PagesFunction = async () => {
  const launchDate = new Date('2025-12-04T04:30:00Z');
  const startDate = launchDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDate = new Date(launchDate.getTime() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//OPDX.AI//Launch Event//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:opdx-launch-2025-12-04@opdx.ai
DTSTAMP:${startDate}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:OPDX.AI Launch
DESCRIPTION:OPDX.AI is launching! Visit https://opdx.ai
LOCATION:https://opdx.ai
URL:https://opdx.ai
END:VEVENT
END:VCALENDAR`;

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="opdx-launch.ics"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

