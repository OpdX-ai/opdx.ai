import { useEffect, useState } from 'react';
import '../styles/cta-sticky.css';

interface CTAStickyProps {
  label: string;
  onClick?: () => void;
}

export default function CTASticky({ label, onClick }: CTAStickyProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero section
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsVisible(window.scrollY > heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Scroll to the email form in hero section
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="cta-sticky" role="banner" aria-label="Join the waitlist">
      <button
        className="cta-sticky__button"
        onClick={handleClick}
        aria-label={label}
      >
        {label}
      </button>
    </div>
  );
}

