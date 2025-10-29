import { useState, useEffect } from 'react';
import { isValidEmail } from '../lib/validators';
import '../styles/form.css';

interface EmailFormProps {
  turnstileSiteKey: string;
  primaryCta: string;
  successMessage: string;
}

declare global {
  interface Window {
    turnstile?: {
      reset: (widgetId: string) => void;
      render: (element: HTMLElement, options: any) => string;
    };
    plausible?: (event: string) => void;
  }
}

export default function EmailForm({ turnstileSiteKey, primaryCta, successMessage }: EmailFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);

  useEffect(() => {
    if (!turnstileSiteKey) return;

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      const container = document.getElementById('turnstile-container');
      if (container && window.turnstile) {
        const id = window.turnstile.render(container, {
          sitekey: turnstileSiteKey,
          callback: (token: string) => {
            setTurnstileToken(token);
          },
          'error-callback': () => {
            setTurnstileToken(null);
            setErrorMessage('Verification failed. Please try again.');
          },
        });
        setWidgetId(id);
      }
    };

    return () => {
      // Cleanup
      if (widgetId && window.turnstile) {
        window.turnstile.reset(widgetId);
      }
    };
  }, [turnstileSiteKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    if (!isValidEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!turnstileToken) {
      setStatus('error');
      setErrorMessage('Please complete the verification.');
      return;
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          token: turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setEmail('');
      setTurnstileToken(null);
      
      // Reset Turnstile widget
      if (widgetId && window.turnstile) {
        window.turnstile.reset(widgetId);
      }

      // Analytics event
      if (window.plausible) {
        window.plausible('waitlist_submit');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      
      if (window.plausible) {
        window.plausible('turnstile_fail');
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <p className="success-message">{successMessage}</p>
      </div>
    );
  }

  return (
    <form className="email-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          aria-required="true"
          aria-invalid={status === 'error'}
          aria-describedby={status === 'error' ? 'error-message' : 'consent-message'}
          className="form-input"
          disabled={status === 'loading'}
        />
        {status === 'error' && (
          <p id="error-message" className="error-message" role="alert" aria-live="polite">
            {errorMessage}
          </p>
        )}
        <p id="consent-message" className="consent-message">
          By joining, you agree to receive one launch update. No spam.
        </p>
      </div>

      {turnstileSiteKey && (
        <div className="turnstile-container">
          <div id="turnstile-container" />
        </div>
      )}

      <button
        type="submit"
        className="form-submit"
        disabled={status === 'loading' || !turnstileToken}
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? 'Submitting...' : primaryCta}
      </button>
    </form>
  );
}

