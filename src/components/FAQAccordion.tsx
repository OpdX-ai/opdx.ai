import { useState } from 'react';
import '../styles/faq.css';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="container">
        <h2 id="faq-heading" className="faq-section__title">FAQ</h2>
        <div className="faq-list">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="faq-item">
                <button
                  className="faq-item__button"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="faq-item__question">{item.q}</span>
                  <svg
                    className={`faq-item__icon ${isOpen ? 'faq-item__icon--open' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`faq-item__answer ${isOpen ? 'faq-item__answer--open' : ''}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  aria-hidden={!isOpen}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

