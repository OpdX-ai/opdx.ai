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
    if (!turnstileSiteKey) {
      console.warn('Turnstile site key not configured');
      return;
    }

    // Check if script already exists
    let script = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]') as HTMLScriptElement;
    
    const renderTurnstile = () => {
      const container = document.getElementById('turnstile-container');
      if (!container) {
        console.error('Turnstile container not found');
        return;
      }
      
      if (!window.turnstile) {
        console.error('Turnstile not loaded');
        return;
      }

      // Clear container first
      container.innerHTML = '';
      
      try {
        const id = window.turnstile.render(container, {
          sitekey: turnstileSiteKey,
          callback: (token: string) => {
            console.log('Turnstile verification successful');
            setTurnstileToken(token);
            setErrorMessage('');
          },
          'error-callback': () => {
            console.error('Turnstile verification error');
            setTurnstileToken(null);
            setErrorMessage('Verification failed. Please try again.');
          },
          'expired-callback': () => {
            console.log('Turnstile token expired');
            setTurnstileToken(null);
          },
        });
        setWidgetId(id);
      } catch (error) {
        console.error('Error rendering Turnstile:', error);
        setErrorMessage('Failed to load verification. Please refresh the page.');
      }
    };

    if (script) {
      // Script already loaded
      if (window.turnstile) {
        renderTurnstile();
      } else {
        script.addEventListener('load', renderTurnstile);
      }
    } else {
      // Load script
      script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;
      script.onerror = () => {
        console.error('Failed to load Turnstile script');
        setErrorMessage('Failed to load verification. Please refresh the page.');
      };
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (e) {
          // Ignore cleanup errors
        }
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
      console.log('Submitting email:', email.trim().toLowerCase());
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

      console.log('Response status:', response.status, response.statusText);

      let data;
      try {
        const responseText = await response.text();
        console.log('Response text:', responseText);
        data = JSON.parse(responseText);
      } catch (jsonError) {
        // If response is not JSON, throw with the text
        throw new Error('Invalid response from server. Please try again.');
      }

      if (!response.ok) {
        console.error('API error:', data);
        throw new Error(data.error || data.message || `Server error: ${response.status}`);
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

  const handleReset = () => {
    setStatus('idle');
    setEmail('');
    setErrorMessage('');
    setTurnstileToken(null);
    // Reset Turnstile widget
    if (widgetId && window.turnstile) {
      try {
        window.turnstile.reset(widgetId);
      } catch (e) {
        // If reset fails, re-render the widget
        setWidgetId(null);
        const container = document.getElementById('turnstile-container');
        if (container) {
          container.innerHTML = '';
          setTimeout(() => {
            if (window.turnstile && turnstileSiteKey) {
              const id = window.turnstile.render(container, {
                sitekey: turnstileSiteKey,
                callback: (token: string) => {
                  setTurnstileToken(token);
                  setErrorMessage('');
                },
                'error-callback': () => {
                  setTurnstileToken(null);
                  setErrorMessage('Verification failed. Please try again.');
                },
              });
              setWidgetId(id);
            }
          }, 100);
        }
      }
    } else {
      // If no widget ID, clear container to trigger re-render
      const container = document.getElementById('turnstile-container');
      if (container) {
        container.innerHTML = '';
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <p className="success-message">{successMessage}</p>
        <button
          type="button"
          className="form-reset-button"
          onClick={handleReset}
          aria-label="Submit another email"
        >
          Submit another email
        </button>
      </div>
    );
  }

  return (
    <form className="email-form" onSubmit={handleSubmit} method="POST" action="/api/waitlist" noValidate>
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

