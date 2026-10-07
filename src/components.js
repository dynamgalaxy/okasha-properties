import { site } from './data.js';

export const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

export function uiIcon(name, className = '') {
  const paths = {
    'arrow-right': '<path d="M5 12h14M14 7l5 5-5 5"/>',
    'arrow-left': '<path d="M19 12H5m5 5-5-5 5-5"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    location: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    home: '<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    diamond: '<path d="m12 3 9 9-9 9-9-9Z"/>',
    star: '<path d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.19l-5.56 2.93 1.06-6.2L3 9.53l6.22-.9Z" fill="currentColor" stroke="none"/>'
  };
  return `<svg class="ui-icon ui-icon-${escapeHtml(name)}${className ? ` ${escapeHtml(className)}` : ''}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths['arrow-right']}</svg>`;
}

const nav = [
  ['Home', '/'], ['About', '/about/'], ['Properties', '/properties/'],
  ['Events', '/events/'], ['Blog', '/blog/'], ['Contact', '/contact/']
];
const legalNav = [['Privacy Policy', '/privacy/'], ['Terms & Conditions', '/terms/'], ['Sitemap', '/sitemap/']];

const propertyNav = [
  ['Rental', '/properties/rental/'], ['Sale', '/properties/sale/'],
  ['Plot', '/properties/plot/'], ['House', '/properties/house/'],
  ['Flat', '/properties/flat/'], ['Apartment', '/properties/apartment/']
];

export function header(current) {
  return `<header class="site-header site-header-home">
    <div class="container header-inner">
      <a class="header-wordmark" href="/" aria-label="Okasha Properties home"><span class="brand-mark" aria-hidden="true">O<span>P</span></span><span class="header-brand-name">Okasha Properties<span class="brand-period">.</span></span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu"><span></span><span></span><span></span></button>
      <nav class="primary-nav" id="primary-nav" aria-label="Primary navigation">${nav.filter(([, href]) => href !== '/contact/').map(([label, href]) => `<a href="${href}"${current === href || (href === '/properties/' && current.startsWith('/properties/')) || (href === '/blog/' && current.startsWith('/blog/')) ? ' aria-current="page"' : ''}>${label === 'About' ? 'About Us' : label}</a>`).join('')}<a class="nav-contact" href="/contact/"${current === '/contact/' ? ' aria-current="page"' : ''}>Contact Us</a><div class="mobile-nav-meta"><div><strong>Property enquiries</strong><a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a></div><div><strong>Office</strong><address>${escapeHtml(site.location)}</address></div></div></nav><div class="header-actions"><a class="header-cta" href="/contact/"${current === '/contact/' ? ' aria-current="page"' : ''}>Contact Us</a></div>
    </div>
  </header>`;
}

export function footer() {
  return `<footer class="site-footer"><div class="container footer-shell"><div class="footer-main"><div class="footer-brand"><a class="header-wordmark" href="/" aria-label="Okasha Properties home"><span class="brand-mark" aria-hidden="true">O<span>P</span></span><span class="header-brand-name">Okasha Properties<span class="brand-period">.</span></span></a><p>Property opportunities and local insight, rooted in Rawalpindi.</p></div><div><h2>Navigate</h2><ul>${nav.map(([label, href]) => `<li><a href="${href}">${label === 'About' ? 'About Us' : label === 'Contact' ? 'Contact Us' : label}</a></li>`).join('')}</ul></div><div><h2>Get in touch</h2><address>${escapeHtml(site.location)}</address>${site.email ? `<a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>` : ''}<a href="/contact/">Contact page ${uiIcon('arrow-up-right')}</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Okasha Properties. All rights reserved.</span><nav class="footer-legal" aria-label="Legal">${legalNav.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}</nav></div></div></footer>`;
}

export function goBackButton() {
  return `<button class="hero-outline-link page-hero-back" type="button" data-go-back data-fallback="/">${uiIcon('arrow-left')} <span>Go Back</span></button>`;
}

export function pageHero({ eyebrow, title, description, showBack = true }) {
  return `<section class="page-hero"><div class="container"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1>${description ? `<p class="page-hero-copy">${escapeHtml(description)}</p>` : ''}${showBack ? goBackButton() : ''}</div></section>`;
}

export function editorialIntroSection({ label = 'About us', title, emphasis = '', copy, points = [] }) {
  return `<section class="home-message" data-scroll-reveal aria-labelledby="editorial-intro-title"><div class="container home-message-inner"><span class="home-about-pill">${escapeHtml(label)}</span><h2 id="editorial-intro-title" data-reveal-copy>${escapeHtml(title)}${emphasis ? ` <em>${escapeHtml(emphasis)}</em>` : ''}</h2><p class="home-about-copy">${escapeHtml(copy)}</p>${points.length ? `<div class="home-about-points">${points.map((point) => `<div><span class="home-about-icon">${uiIcon(point.icon)}</span><span>${escapeHtml(point.label)}</span></div>`).join('')}</div>` : ''}</div></section>`;
}

export function sectionHeading({ eyebrow, title, description, link, linkLabel }) {
  return `<div class="section-heading"><div><p class="eyebrow">${escapeHtml(eyebrow)}</p><h2>${escapeHtml(title)}</h2>${description ? `<p>${escapeHtml(description)}</p>` : ''}</div>${link ? `<a class="text-link" href="${link}">${escapeHtml(linkLabel)}</a>` : ''}</div>`;
}

function imageSlot(image, alt, label) {
  return image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(alt)}" loading="lazy">` : `<div class="image-placeholder" role="img" aria-label="Image placeholder"><span>${escapeHtml(label)}</span><small>IMAGE TO BE ADDED</small></div>`;
}

export function projectCard(project) {
  const detail = project.slug && !project.placeholder ? `/projects/${encodeURIComponent(project.slug)}/` : '';
  return `<article class="content-card project-card"><div class="card-media">${imageSlot(project.image, project.title, 'Project visual')}</div><div class="card-body"><div class="card-meta"><span>${escapeHtml(project.type)}</span><span>${escapeHtml(project.location)}</span></div><h3>${detail ? `<a href="${detail}">${escapeHtml(project.title)}</a>` : escapeHtml(project.title)}</h3><p>${escapeHtml(project.summary)}</p>${detail ? `<a class="text-link" href="${detail}">View project</a>` : '<span class="pending-label">More information coming soon</span>'}</div></article>`;
}

export function listingsSection(listings) {
  const cards = listings.map((listing, index) => `<article class="listing-card" tabindex="0"${index > 2 ? ' hidden' : ''} aria-label="Illustrative ${escapeHtml(listing.type)} ${escapeHtml(listing.purpose.toLowerCase())} in ${escapeHtml(listing.area)}, Rawalpindi"><div class="listing-card-media"><img src="${escapeHtml(listing.image)}" alt="Illustrative architecture, not a photograph of this property" loading="lazy" decoding="async"><div class="listing-card-top"><span>${escapeHtml(listing.purpose)}</span></div></div><div class="listing-card-caption"><p>${escapeHtml(listing.area)} · Rawalpindi</p><h3>${escapeHtml(listing.type)} in ${escapeHtml(listing.area)}</h3></div></article>`).join('');
  return `<section class="section listings-section" aria-labelledby="listings-title"><div class="container"><div class="listings-heading"><div><p class="eyebrow">Property opportunities</p><h2 id="listings-title">Explore Rawalpindi listings.</h2><p>Explore residential and commercial possibilities across Rawalpindi. Images are for visual reference; contact us for current availability.</p></div><div class="listings-controls"><span class="listings-count" aria-live="polite">01–03 / ${String(listings.length).padStart(2, '0')}</span><div class="listings-arrows"><button type="button" class="listings-prev" aria-label="Previous listings">${uiIcon('arrow-left')}</button><button type="button" class="listings-next" aria-label="Next listings">${uiIcon('arrow-right')}</button></div></div></div><div class="listing-track">${cards}</div></div></section>`;
}

export function servicesSection() {
  const services = [
    { title: 'Property discovery', description: 'Compare residential and commercial opportunities across Rawalpindi with a clearer view of location, space and budget.', href: '/properties/' },
    { title: 'Buying and rental enquiries', description: 'Share what you are considering and receive a practical next step shaped around your priorities.', href: '/contact/' },
    { title: 'Local market perspective', description: 'Understand neighbourhoods and property types through guidance rooted in the local market.', href: '/contact/' },
    { title: 'Property presentation', description: 'Introduce a property with focused imagery, useful information and a direct path to enquiry.', href: '/contact/' }
  ];
  return `<section class="services-section services-editorial" aria-labelledby="services-title"><div class="container services-editorial-grid"><div class="services-editorial-intro"><p class="services-eyebrow">Our services</p><h2 id="services-title">Clear property guidance, from first look to next move.</h2><p>Local knowledge and straightforward support for people exploring property in Rawalpindi.</p><a class="services-editorial-cta" href="/contact/">Discuss your plans <span>${uiIcon('arrow-right')}</span></a></div><div class="services-editorial-list">${services.map((service, index) => `<a class="services-editorial-row" href="${service.href}"><span class="services-editorial-number">${String(index + 1).padStart(2, '0')}</span><span class="services-editorial-content"><strong>${service.title}</strong><span>${service.description}</span></span><span class="services-editorial-arrow">${uiIcon('arrow-right')}</span></a>`).join('')}</div></div></section>`;
}

export function winningListingSection() {
  return `<section class="winning-listing-section featured-property-promo" aria-labelledby="winning-listing-title"><div class="container"><article class="featured-property-promo-panel"><div class="featured-property-promo-copy"><p class="winning-listing-kicker">Featured property · Rawalpindi</p><h2 id="winning-listing-title">Modern living, <strong>considered in every detail.</strong></h2><p>A contemporary home shaped around generous light, composed spaces and practical everyday living.</p><div class="featured-property-promo-meta" aria-label="Property details"><span>House</span><span>For sale</span><span>Details on request</span></div><a class="featured-property-promo-cta" href="/contact/">Explore this property <span>${uiIcon('arrow-right')}</span></a></div><img class="featured-property-promo-house" src="/okasha-featured-house-3d.png" alt="Contemporary architectural house illustration" loading="lazy" decoding="async"></article></div></section>`;
}

export function visualStoriesSection(stories) {
  const cards = stories.map((story) => `<button class="visual-story-card" type="button" data-story-video="${escapeHtml(story.video)}" data-story-poster="${escapeHtml(story.poster)}" data-story-title="${escapeHtml(story.title)}" aria-label="Play ${escapeHtml(story.title)}"><img src="${escapeHtml(story.poster)}" alt="" loading="lazy" decoding="async"><span class="visual-story-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span><span class="visual-story-caption" aria-hidden="true"><strong>${escapeHtml(story.title)}</strong><small>@okashaproperties</small></span></button>`).join('');
  return `<section class="visual-stories-section" aria-labelledby="visual-stories-title" data-visual-stories><div class="container visual-stories-new-heading"><div><p class="visual-stories-eyebrow">Visual stories</p><h2 id="visual-stories-title">Places, details and perspective <em>in motion.</em></h2></div><div class="visual-stories-new-actions"><span>@okashaproperties</span><div class="visual-stories-navigation"><button class="visual-stories-arrow visual-stories-prev" type="button" aria-label="Previous visual story">${uiIcon('arrow-left')}</button><button class="visual-stories-arrow visual-stories-next" type="button" aria-label="Next visual story">${uiIcon('arrow-right')}</button></div></div></div><div class="visual-stories-stage" aria-label="Visual story previews">${cards}</div><dialog class="visual-story-dialog" aria-label="Visual story video"><button class="visual-story-close" type="button" aria-label="Close video">${uiIcon('close')}</button><button class="visual-story-dialog-arrow visual-story-dialog-prev" type="button" aria-label="Previous video">${uiIcon('arrow-left')}</button><video controls playsinline preload="none"></video><button class="visual-story-dialog-arrow visual-story-dialog-next" type="button" aria-label="Next video">${uiIcon('arrow-right')}</button><p class="visual-story-dialog-title">@okashaproperties</p></dialog></section>`;
}

export function eventCard(event) {
  const detail = event.slug && !event.placeholder ? `/events/${encodeURIComponent(event.slug)}/` : '';
  const date = event.date ? new Date(`${event.date}T00:00:00`).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date to be confirmed';
  return `<article class="content-card event-card"><div class="card-media">${imageSlot(event.image, event.title, 'Event visual')}</div><div class="card-body"><div class="card-meta"><span>${escapeHtml(date)}</span><span>${escapeHtml(event.location)}</span></div><h3>${detail ? `<a href="${detail}">${escapeHtml(event.title)}</a>` : escapeHtml(event.title)}</h3><p>${escapeHtml(event.summary)}</p>${detail ? `<a class="text-link" href="${detail}">View event</a>` : '<span class="pending-label">More information coming soon</span>'}</div></article>`;
}

export function featureSection({ eyebrow, title, items, className = '' }) {
  return `<section class="section feature-section ${className}"><div class="container">${sectionHeading({ eyebrow, title })}<div class="feature-grid">${items.map((item, index) => `<article class="feature"><span class="feature-index">0${index + 1}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join('')}</div></div></section>`;
}

export function ctaSection({ eyebrow = 'Connect with us', title = 'Let’s start a conversation.', description = 'Have a question about Okasha Properties? Reach out through our contact page.', button = 'Contact us', href = '/contact/', endcap = false } = {}) {
  if (endcap) return `<section class="cta-section cta-section-endcap" aria-labelledby="footer-cta-title"><div class="footer-cta-center"><span class="footer-cta-mark" aria-hidden="true">OP</span><p class="footer-cta-kicker">${escapeHtml(eyebrow)}</p><h2 id="footer-cta-title">${escapeHtml(title)}</h2><p class="footer-cta-copy">${escapeHtml(description)}</p><div class="footer-cta-actions"><a class="endcap-cta-link" href="${escapeHtml(href)}">${escapeHtml(button)} ${uiIcon('arrow-up-right')}</a><a class="footer-cta-secondary" href="/properties/">Explore Properties</a></div></div></section>`;
  return `<section class="cta-section"><div class="container cta-inner"><div><p class="eyebrow">${escapeHtml(eyebrow)}</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div><a class="button button-light" href="${escapeHtml(href)}">${escapeHtml(button)}</a></div></section>`;
}

export function socialReelsSection(reels = []) {
  const hasPublishedReels = reels.some((reel) => reel.url?.startsWith('https://'));
  const renderCard = (reel, index) => {
    const content = `<img src="${escapeHtml(reel.image)}" alt="${escapeHtml(reel.alt)}" loading="lazy" decoding="async"><div class="social-reel-caption"><span class="reel-card-kicker">${reel.url ? `Watch reel ${uiIcon('arrow-up-right')}` : 'Visual study'} · ${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(reel.title)}</h3><p>${escapeHtml(reel.caption)}</p></div>`;
    return reel.url?.startsWith('https://')
      ? `<a class="social-reel-card${index === 1 ? ' is-active' : ''}" href="${escapeHtml(reel.url)}" target="_blank" rel="noopener noreferrer"${index > 2 ? ' hidden' : ''}>${content}</a>`
      : `<article class="social-reel-card${index === 1 ? ' is-active' : ''}"${index > 2 ? ' hidden' : ''}>${content}</article>`;
  };
  return `<section class="section social-reels-section" aria-labelledby="social-reels-title"><div class="container"><div class="social-reels-heading"><span class="reels-pill">Visual journal</span><h2 id="social-reels-title">Property stories<br><em>in focus.</em></h2><p>${hasPublishedReels ? 'Explore visual stories from Okasha Properties.' : 'An editorial look at architecture, light and the spaces that inspire us.'}</p></div><div class="reels-slider"><div class="social-reels-grid">${reels.map(renderCard).join('')}</div><button class="reels-prev" type="button" aria-label="Previous reel previews">${uiIcon('chevron-left')}</button><button class="reels-next" type="button" aria-label="Next reel previews">${uiIcon('chevron-right')}</button></div></div></section>`;
}

export function testimonialPreviewSection({ videos = [], quotes = [] } = {}) {
  const columns = [2, 2, 1, 1, 1, 1, 2, 2];
  let videoIndex = 0;
  const collage = columns.map((count, column) => `<div class="testimonial-video-column testimonial-video-column-${column + 1}">${Array.from({ length: count }, () => {
    const source = videos[videoIndex++ % videos.length];
    return `<div class="testimonial-video-tile"><video data-testimonial-video data-src="${escapeHtml(source)}" muted loop playsinline preload="metadata" disablepictureinpicture aria-hidden="true" tabindex="-1"></video></div>`;
  }).join('')}</div>`).join('');
  const renderCard = (item, duplicate = false) => `<article class="testimonial-quote"${duplicate ? ' aria-hidden="true"' : ''}><div class="testimonial-stars" aria-hidden="true">${Array.from({ length: 5 }, () => uiIcon('star')).join('')}</div><blockquote>“${escapeHtml(item.quote)}”</blockquote><div class="testimonial-person"><span class="testimonial-avatar" aria-hidden="true">${escapeHtml(item.initials)}</span><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.city)}</span></div></div></article>`;
  const cards = quotes.map((item) => renderCard(item)).join('');
  const duplicates = quotes.map((item) => renderCard(item, true)).join('');
  return `<section class="testimonials-section" aria-labelledby="testimonials-title"><div class="container testimonials-shell"><div class="testimonial-mosaic" aria-hidden="true">${collage}</div><div class="testimonial-heading"><span class="testimonial-pill">Testimonials</span><h2 id="testimonials-title">Conversations that<br><em>shape the journey.</em></h2><p>Sample stories and preview footage. Customer testimonials will be added soon.</p></div><div class="testimonial-slider"><div class="testimonial-quotes" role="region" aria-label="Sample reviews; swipe or use arrow keys to browse" tabindex="0">${cards}${duplicates}</div></div></div></section>`;
}

export function blogCard(post, modal = false) {
  const href = `/blog/${encodeURIComponent(post.slug)}/`;
  const date = new Date(`${post.date}T00:00:00`).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' });
  const open = modal ? `button type="button" data-blog-open="${escapeHtml(post.slug)}"` : `a href="${href}"`;
  return `<article class="blog-card"><${open} class="blog-card-media" aria-label="Read ${escapeHtml(post.title)}"><img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.alt)}" loading="lazy" decoding="async"><span>${uiIcon('arrow-up-right')}</span></${modal ? 'button' : 'a'}><div class="blog-card-meta"><span>${escapeHtml(post.category)}</span><time datetime="${escapeHtml(post.date)}">${escapeHtml(date)}</time></div><h3><${open}>${escapeHtml(post.title)}</${modal ? 'button' : 'a'}></h3><p>${escapeHtml(post.excerpt)}</p><${open} class="blog-card-link">Read article <span>${uiIcon('arrow-up-right')}</span></${modal ? 'button' : 'a'}></article>`;
}

export function blogSection(posts, { standalone = false, modal = false } = {}) {
  const dialogs = modal ? posts.map((post) => { const date = new Date(`${post.date}T00:00:00`).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }); return `<dialog class="blog-reader" data-blog-dialog="${escapeHtml(post.slug)}" aria-labelledby="blog-reader-${escapeHtml(post.slug)}"><button class="blog-reader-close" type="button" aria-label="Close article">${uiIcon('close')}</button><div class="blog-reader-scroll"><div class="blog-article-meta"><span>${escapeHtml(post.category)}</span><time datetime="${escapeHtml(post.date)}">${escapeHtml(date)}</time></div><h2 id="blog-reader-${escapeHtml(post.slug)}">${escapeHtml(post.title)}</h2><p class="blog-reader-lead">${escapeHtml(post.excerpt)}</p><img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.alt)}">${post.sections.map((section) => `<section><h3>${escapeHtml(section.heading)}</h3>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`).join('')}</div></dialog>`; }).join('') : '';
  return `<section class="blog-section${standalone ? ' blog-section-standalone' : ''}" aria-labelledby="blog-title"><div class="container"><div class="blog-section-heading"><span class="blog-pill">Articles</span><h2 id="blog-title">Property insights, guides &amp;<br><em>considered perspectives.</em></h2><p>Ideas to help you look at property with greater clarity.</p></div><div class="blog-grid">${posts.map((post) => blogCard(post, modal)).join('')}</div></div>${dialogs}</section>`;
}

export function blogHero() {
  return propertyHeader({ title: 'Property insight for more considered decisions.', description: 'Practical perspectives on homes, neighbourhoods and everyday property choices in Rawalpindi.', eyebrow: 'Journal · Okasha Properties', showCategories: false });
}

export function faqSection(items) {
  return `<section class="faq-section" aria-labelledby="faq-title"><div class="container"><div class="faq-heading"><span class="blog-pill">FAQs</span><h2 id="faq-title">Property questions, <em>clear answers.</em></h2><p>Helpful information about enquiries, property previews and visiting our Rawalpindi office.</p></div><div class="faq-grid"><div class="faq-list">${items.map((item, index) => `<details class="faq-item"${index === 0 ? ' open' : ''}><summary><span>${escapeHtml(item.question)}</span><span class="faq-toggle" aria-hidden="true"></span></summary><div class="faq-answer"><p>${escapeHtml(item.answer)}</p></div></details>`).join('')}</div><div class="faq-visual"><img src="/faq-interior.webp" alt="Contemporary sitting room with a lounge chair and warm pendant light" loading="lazy" decoding="async"></div></div></div></section>`;
}

export function contactSection({ compact = false } = {}) {
  return `<section class="section contact-section"><div class="container contact-layout"><div>${sectionHeading({ eyebrow: 'Visit or enquire', title: compact ? 'Find us in Rawalpindi.' : 'We’d be glad to hear from you.', description: 'Our office is located in Allahabad, Westridge III, Rawalpindi.' })}<div class="contact-detail"><span>Office address</span><address>${escapeHtml(site.location)}</address></div>${site.phone ? `<div class="contact-detail"><span>Phone</span><a href="tel:${escapeHtml(site.phone)}">${escapeHtml(site.phone)}</a></div>` : ''}${site.email ? `<div class="contact-detail"><span>Email</span><a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a></div>` : ''}</div>${compact ? `<div class="contact-panel"><p class="eyebrow">Contact</p><h3>Questions about a project or event?</h3><p>Visit our contact page for office details and an enquiry form.</p><a class="button button-dark" href="/contact/">Contact us</a></div>` : contactForm()}</div></section>`;
}

function contactForm() {
  const ready = Boolean(site.email);
  return `<div class="form-panel"><p class="eyebrow">Property enquiry</p><h2>Tell us what you’re looking for.</h2><form id="contact-form" data-contact-email="${escapeHtml(site.email)}"><label>I want to<select name="intent" required><option value="">Choose an enquiry</option><option>Buy a property</option><option>Rent a property</option><option>Sell a property</option><option>Rent out my property</option><option>General enquiry</option></select></label><div data-contact-property-fields><div class="form-row"><label>Property type<select name="propertyType"><option value="">Choose a type</option><option>House</option><option>Apartment</option><option>Flat</option><option>Plot</option><option>Other</option></select></label><label>Preferred location<input name="location" type="text" autocomplete="address-level2"></label></div><label data-budget-label>Budget<input name="budget" type="text" inputmode="numeric"></label></div><div class="form-row"><label>Full name<input name="name" type="text" autocomplete="name" required></label><label>Email address<input name="email" type="email" autocomplete="email" required></label></div><label>Phone / WhatsApp<input name="phone" type="tel" autocomplete="tel"></label><label>Message<textarea name="message" rows="4" required></textarea></label><button class="button button-dark" type="submit"${ready ? '' : ' disabled aria-disabled="true"'}>Send enquiry</button><p class="form-note" id="form-status" role="status">${ready ? 'Submitting opens your email app with your enquiry ready to send.' : 'Online enquiries will be available once a contact email is provided.'}</p></form></div>`;
}

export function propertyHeader({ title, description, eyebrow = 'Properties · Rawalpindi', showCategories = true, showBack = true }) {
  return `${pageHero({ eyebrow, title, description, showBack })}${showCategories ? categoryNavigation() : ''}`;
}

export function categoryNavigation() {
  const categories = [['all', 'All properties', '/properties/'], ...propertyNav.map(([label, href]) => [label.toLowerCase(), label, href])];
  return `<nav class="property-category-nav container" aria-label="Property categories">${categories.map(([key, label, href]) => `<a href="${href}" data-property-category="${key}"${key === 'all' ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
}
export function propertyFilters({ active = 'all', count = 0 }) {
  return `<section class="property-discovery-bar"><div class="container"><div class="property-results-summary"><div><p class="eyebrow">Property collection</p><p class="property-collection-copy"><strong data-property-result-count>${count}</strong> <span data-property-result-label>${count === 1 ? 'property available' : 'properties available'}</span> in Rawalpindi.</p></div><button class="property-filter-toggle" type="button" aria-expanded="false" aria-controls="property-filters">Filters <span class="property-filter-toggle-icon"><span class="filter-icon-plus">${uiIcon('plus')}</span><span class="filter-icon-minus">${uiIcon('minus')}</span></span></button></div><form class="property-filters" id="property-filters" action="/properties/" method="get"><label class="property-filter-location hero-search-field">Location<select name="location"><option value="">All Rawalpindi</option><option>Westridge III</option><option>Bahria Town Phase 8</option><option>Satellite Town</option><option>Chaklala Scheme III</option><option>Gulraiz</option><option>Saddar</option></select></label><label class="property-filter-type hero-search-field">Property type<select name="type"><option value="">All types</option><option${active === 'house' ? ' selected' : ''}>House</option><option${active === 'plot' ? ' selected' : ''}>Plot</option><option${active === 'flat' ? ' selected' : ''}>Flat</option><option${active === 'apartment' ? ' selected' : ''}>Apartment</option><option>Commercial</option></select></label><label class="property-filter-purpose hero-search-field">Purpose<select name="purpose"><option value="">Buy or rent</option><option${active === 'sale' ? ' selected' : ''}>For sale</option><option${active === 'rental' ? ' selected' : ''}>For rent</option></select></label><label class="property-filter-bedrooms hero-search-field">Bedrooms<select name="bedrooms"><option value="">Any bedrooms</option><option>1+</option><option>2+</option><option>3+</option><option>4+</option></select></label><div class="property-filter-actions"><a class="text-link" href="/properties/" data-property-reset>Reset</a><button class="hero-search-button" type="submit">Apply filters</button></div></form></div></section>`;
}

export function propertyCard(property) {
  return `<article class="property-result-card" data-property-type="${escapeHtml(property.type.toLowerCase())}" data-property-purpose="${escapeHtml(property.purpose === 'For rent' ? 'rental' : 'sale')}" data-property-location="${escapeHtml(property.area.toLowerCase())}" data-property-bedrooms="${escapeHtml(property.bedrooms)}"><a class="property-result-media listing-card-media" href="/contact/" aria-label="Enquire about ${escapeHtml(property.title)}"><img src="${escapeHtml(property.image)}" alt="Illustrative ${escapeHtml(property.type.toLowerCase())} architecture in ${escapeHtml(property.area)}, Rawalpindi" loading="lazy" decoding="async"><span class="listing-card-top"><span>${escapeHtml(property.purpose)}</span></span></a><div class="property-result-body"><div class="property-result-context"><span>${escapeHtml(property.type)}</span><span>${escapeHtml(property.area)} · Rawalpindi</span></div><h2><a href="/contact/">${escapeHtml(property.title)}</a></h2><p class="property-result-price">${escapeHtml(property.price)}</p><div class="property-result-specs">${property.bedrooms ? `<span>${escapeHtml(property.bedrooms)} bed</span>` : ''}${property.bathrooms ? `<span>${escapeHtml(property.bathrooms)} bath</span>` : ''}<span>${escapeHtml(property.size)}</span></div><a class="property-result-action text-link" href="/contact/">View details <span>${uiIcon('arrow-right')}</span></a></div></article>`;
}

export function propertyGrid(properties) {
  return `<section class="property-results"><div class="container"><div class="property-result-grid">${properties.map(propertyCard).join('')}</div>${properties.length ? pagination() : '<p class="property-empty">No illustrative properties are currently assigned to this category.</p>'}<p class="property-results-note">Property images are for visual reference. Contact Okasha Properties for verified availability and current details.</p></div></section>`;
}

export function pagination() {
  return `<nav class="property-pagination listings-arrows" aria-label="Property result pages"><button type="button" disabled aria-label="Previous results">${uiIcon('arrow-left')}</button><span aria-current="page">1</span><button type="button" disabled aria-label="Next results">${uiIcon('arrow-right')}</button></nav>`;
}
export function layout({ title, description, path, body, footerCta = '' }) {
  const fullTitle = title === 'Home' ? site.name : `${title} | ${site.name}`;
  const bodyClass = path === '/' ? 'home-page' : `site-system-page shared-home-components${path === '/about/' ? ' about-page' : ''}${path.startsWith('/properties/') ? ' property-page' : path === '/blog/' ? ' blog-page' : ''}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#122d34"><meta name="description" content="${escapeHtml(description)}"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(fullTitle)}"><meta property="og:description" content="${escapeHtml(description)}"><title>${escapeHtml(fullTitle)}</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="stylesheet" href="/assets/styles.css"></head><body class="${bodyClass}"><a class="skip-link" href="#main-content">Skip to content</a>${header(path)}<main id="main-content">${body}</main>${footerCta ? `<div class="footer-scene">${footerCta}${footer()}</div>` : footer()}<script src="/assets/site.js" defer></script></body></html>`;
}
















