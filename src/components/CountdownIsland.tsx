import { useEffect, useState } from 'react';
import { getTimeRemaining, isLaunchDatePassed, formatLaunchDate } from '../lib/time';
import type { TimeRemaining } from '../lib/time';
import '../styles/countdown.css';

interface CountdownIslandProps {
  label: string;
  launchReady?: boolean;
}

export default function CountdownIsland({ label, launchReady = false }: CountdownIslandProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(getTimeRemaining());
  const [launchPassed, setLaunchPassed] = useState(isLaunchDatePassed());

  useEffect(() => {
    const updateTimer = () => {
      const remaining = getTimeRemaining();
      setTimeRemaining(remaining);
      if (remaining.total <= 0) {
        setLaunchPassed(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);

    return () => clearInterval(interval);
  }, []);

  if (launchPassed || launchReady) {
    return (
      <div className="countdown-container launch-live" role="status" aria-live="polite">
        <p className="countdown-label">{label}</p>
        <div className="launch-message">
          <p className="launch-title">We&apos;re live!</p>
          <p className="launch-subtitle">Check back soon for updates.</p>
        </div>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeRemaining;
  const countdownText = `Launch in ${days} ${days === 1 ? 'day' : 'days'}, ${hours} ${hours === 1 ? 'hour' : 'hours'}, ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}, ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;

  return (
    <div className="countdown-container" role="status" aria-live="polite" aria-label={countdownText}>
      <p className="countdown-label">{label}</p>
      <div className="countdown-grid">
        <div className="countdown-item">
          <span className="countdown-value" aria-label={`${days} days`}>
            {String(days).padStart(2, '0')}
          </span>
          <span className="countdown-unit">days</span>
        </div>
        <div className="countdown-separator" aria-hidden="true">:</div>
        <div className="countdown-item">
          <span className="countdown-value" aria-label={`${hours} hours`}>
            {String(hours).padStart(2, '0')}
          </span>
          <span className="countdown-unit">hrs</span>
        </div>
        <div className="countdown-separator" aria-hidden="true">:</div>
        <div className="countdown-item">
          <span className="countdown-value" aria-label={`${minutes} minutes`}>
            {String(minutes).padStart(2, '0')}
          </span>
          <span className="countdown-unit">min</span>
        </div>
        <div className="countdown-separator" aria-hidden="true">:</div>
        <div className="countdown-item">
          <span className="countdown-value" aria-label={`${seconds} seconds`}>
            {String(seconds).padStart(2, '0')}
          </span>
          <span className="countdown-unit">sec</span>
        </div>
      </div>
      <span className="sr-only">{countdownText}</span>
    </div>
  );
}

