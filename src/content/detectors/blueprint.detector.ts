import type { BlueprintSection, StoreBlueprint, BlueprintSectionType } from '@/types';

interface SectionDetector {
  type: BlueprintSectionType;
  label: string;
  selectors: string[];
  keywords: string[];
}

const sectionDetectors: SectionDetector[] = [
  { type: 'header', label: 'Header / Navigation', selectors: ['header', 'nav', '.header', '#header', '[role="banner"]', '.site-header'], keywords: ['header', 'navigation', 'navbar', 'menu'] },
  { type: 'hero', label: 'Hero Section', selectors: ['.hero', '.hero-section', '#hero', '[data-section-type="image-banner"]', '.banner', '.slider', '.slideshow', '.carousel'], keywords: ['hero', 'banner', 'slider', 'slideshow'] },
  { type: 'benefits', label: 'Benefits / Features', selectors: ['.benefits', '.features', '.usp', '[class*="benefit"]', '[class*="feature"]', '.icons-section', '.value-props'], keywords: ['beneficio', 'benefit', 'feature', 'advantage', 'why choose'] },
  { type: 'reviews', label: 'Reviews / Testimonials', selectors: ['.reviews', '.testimonials', '[class*="review"]', '[class*="testimonial"]', '.product-reviews', '.stamped-reviews', '.yotpo', '#reviews'], keywords: ['review', 'testimonial', 'rating', 'stars', 'opinion', 'verified', 'reseña'] },
  { type: 'faq', label: 'FAQ Section', selectors: ['.faq', '#faq', '.accordion', '[class*="faq"]', '[class*="accordion"]', 'details', 'summary'], keywords: ['faq', 'frequently asked', 'preguntas frecuentes', 'question', 'pregunta'] },
  { type: 'footer', label: 'Footer', selectors: ['footer', '.footer', '#footer', '[role="contentinfo"]', '.site-footer'], keywords: ['footer', 'copyright', 'terms', 'privacy'] },
  { type: 'trust_badges', label: 'Trust Badges', selectors: ['.trust', '.badges', '[class*="trust"]', '[class*="badge"]', '.secure', '.guarantee', '.payment-icons', '.ssl'], keywords: ['secure', 'trust', 'badge', 'guarantee', 'ssl', 'seguro', 'garantía'] },
  { type: 'newsletter', label: 'Newsletter / Email Capture', selectors: ['.newsletter', '[class*="newsletter"]', '.email-signup', '.subscribe', 'form[action*="subscribe"]'], keywords: ['newsletter', 'subscribe', 'suscribir', 'email', 'notify me'] },
  { type: 'upsells', label: 'Upsells / Cross-sells', selectors: ['.upsell', '.cross-sell', '.related-products', '.frequently-bought', '[class*="upsell"]', '.recommendations'], keywords: ['upsell', 'cross-sell', 'related', 'frequently bought', 'also like'] },
  { type: 'product_gallery', label: 'Product Gallery', selectors: ['.product-gallery', '.product-images', '.product__media', '[class*="product-gallery"]', '.thumbnails'], keywords: ['product gallery', 'zoom', 'lightbox'] },
  { type: 'countdown_timer', label: 'Countdown Timer', selectors: ['.countdown', '[class*="countdown"]', '.timer', '[class*="timer"]', '[data-countdown]'], keywords: ['countdown', 'timer', 'limited time', 'offer ends', 'tiempo limitado'] },
  { type: 'popup', label: 'Popup / Modal', selectors: ['.popup', '.modal', '[class*="popup"]', '[role="dialog"]', '.overlay', '.lightbox'], keywords: ['popup', 'modal', 'overlay', 'dialog'] },
  { type: 'sticky_bar', label: 'Sticky Bar', selectors: ['.sticky', '.sticky-bar', '[class*="sticky"]', '.announcement-bar'], keywords: ['sticky', 'announcement', 'free shipping'] },
];

function evaluateSection(detector: SectionDetector): BlueprintSection {
  const details: string[] = [];
  let score = 0;
  let position: number | undefined;
  for (const selector of detector.selectors) {
    try {
      const el = document.querySelector(selector);
      if (el) {
        score += 20;
        details.push(`Found: ${selector}`);
        const rect = el.getBoundingClientRect();
        const absTop = rect.top + window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        if (docHeight > 0) position = Math.round((absTop / docHeight) * 100);
        if (score >= 60) break;
      }
    } catch (_) {}
  }
  const bodyText = document.body?.innerText?.toLowerCase() ?? '';
  const htmlContent = document.documentElement.innerHTML?.toLowerCase() ?? '';
  for (const keyword of detector.keywords) {
    if (bodyText.includes(keyword) || htmlContent.includes(keyword)) { score += 10; details.push(`Keyword: "${keyword}"`) }
  }
  score = Math.min(100, score);
  return { type: detector.type, label: detector.label, detected: score > 0, score, details, position };
}

export function detectBlueprint(): StoreBlueprint {
  const sections = sectionDetectors.map(evaluateSection);
  sections.sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
  const detectedSections = sections.filter((s) => s.detected);
  const overallScore = detectedSections.length > 0 ? Math.round(detectedSections.reduce((acc, s) => acc + s.score, 0) / sections.length) : 0;
  const strengths: string[] = [];
  const opportunities: string[] = [];
  const has = (type: string) => sections.find((s) => s.type === type)?.detected;
  if (has('reviews')) strengths.push('Social proof (reviews) present');
  if (has('countdown_timer')) strengths.push('Urgency elements detected');
  if (has('trust_badges')) strengths.push('Trust badges visible');
  if (has('hero')) strengths.push('Strong hero section');
  if (has('faq')) strengths.push('FAQ section reduces objections');
  if (!has('reviews')) opportunities.push('Add social proof / reviews section');
  if (!has('newsletter')) opportunities.push('Implement email capture / newsletter');
  if (!has('trust_badges')) opportunities.push('Add trust badges (SSL, payments, guarantees)');
  if (!has('faq')) opportunities.push('Include FAQ to reduce objections');
  if (!has('upsells')) opportunities.push('Implement cross-sell / upsell section');
  if (!has('countdown_timer')) opportunities.push('Test urgency elements (countdown, limited stock)');
  return { sections, overallScore, strengths, opportunities, generatedAt: new Date().toISOString() };
}
