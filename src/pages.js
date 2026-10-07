import { site, projects, events, listings, blogPosts, faqs, testimonialPreview, visualStories } from './data.js';
import { blogHero, blogSection, ctaSection, contactSection, editorialIntroSection, eventCard, faqSection, featureSection, layout, listingsSection, servicesSection, winningListingSection, visualStoriesSection, pageHero, projectCard, sectionHeading, testimonialPreviewSection, propertyHeader, propertyFilters, propertyGrid, escapeHtml } from './components.js';

const featureItems = [
  { title: 'A local point of contact', description: 'Find Okasha Properties in Allahabad, Westridge III, Rawalpindi.' },
  { title: 'Project information', description: 'Browse confirmed project details here as they become available.' },
  { title: 'Event updates', description: 'See upcoming announcements and past events in one place.' }
];

const cards = (items, render, className = '') => `<div class="card-grid ${className}">${items.map(render).join('')}</div>`;
const sharedFooterCta = () => ctaSection({ eyebrow: 'Okasha Properties', title: 'Your next place starts here.', description: 'Connect with our Rawalpindi team to discuss your plans and current property opportunities.', button: 'Contact Us', endcap: true });

export function homePage() {
  return layout({ title: 'Home', path: '/', description: `Explore property opportunities and architectural stories with Okasha Properties in ${site.location}.`, body: `
    <section class="home-hero"><div class="home-hero-media"><picture><source media="(max-width: 650px)" srcset="/home-hero-future-mobile.png"><img class="home-hero-image" src="/home-hero-future.png" alt="Illustrative futuristic architecture concept" fetchpriority="high"></picture></div><div class="home-hero-top"><p class="hero-local-context">Okasha Properties · Rawalpindi</p><h1><span>Real Estate With</span><span><em>Local Perspective.</em></span></h1><a class="hero-outline-link" href="/properties/">See Properties <span aria-hidden="true">↗</span></a></div><form class="hero-search" action="/properties/" method="get" role="search" aria-label="Search properties"><div class="hero-search-fields"><div class="hero-search-field"><label for="hero-location">Location</label><select id="hero-location" name="location"><option value="">Enter your city</option><option value="westridge">Westridge</option><option value="bahria-town-rawalpindi">Bahria Town Rawalpindi</option><option value="dha-islamabad">DHA Islamabad</option><option value="gulberg-greens">Gulberg Greens</option><option value="islamabad">Islamabad</option><option value="rawalpindi">Rawalpindi</option><option value="murree-road">Murree Road</option></select></div><div class="hero-search-field"><label for="hero-type">Type</label><select id="hero-type" name="type"><option value="">Property type</option><option value="house">House</option><option value="apartment">Apartment</option><option value="plot">Plot</option><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="office">Office</option><option value="shop">Shop</option></select></div><div class="hero-search-field"><label for="hero-price">Price</label><select id="hero-price" name="price"><option value="">Any price</option><option value="under-5m">Under PKR 5 Million</option><option value="5m-10m">PKR 5M – 10M</option><option value="10m-25m">PKR 10M – 25M</option><option value="25m-50m">PKR 25M – 50M</option><option value="50m-100m">PKR 50M – 100M</option><option value="100m-plus">PKR 100M+</option></select></div><div class="hero-search-field"><label for="hero-bedrooms">Bedrooms</label><select id="hero-bedrooms" name="bedrooms"><option value="">Select bedrooms</option><option value="1">1 bedroom</option><option value="2">2 bedrooms</option><option value="3">3 bedrooms</option><option value="4">4 bedrooms</option><option value="5-plus">5+ bedrooms</option></select></div></div><div class="hero-search-bottom"><span class="hero-filter-label">Filter</span><div class="hero-filter-chips" aria-label="Quick filters"><button type="button" data-filter-target="hero-location" data-filter-value="rawalpindi" aria-pressed="false">City</button><button type="button" data-filter-target="hero-type" data-filter-value="house" aria-pressed="false">House</button><button type="button" data-filter-target="hero-type" data-filter-value="residential" aria-pressed="false">Residential</button><button type="button" data-filter-target="hero-type" data-filter-value="apartment" aria-pressed="false">Apartment</button></div><button class="hero-search-button" type="submit"><svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.7"/><path d="m13 13 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>Search</button></div></form></section>
    ${editorialIntroSection({ label: 'About us', title: 'Built on trust and local perspective,', emphasis: 'we guide you through every stage of your property journey.', copy: 'Based in Allahabad, Westridge III, Rawalpindi, Okasha Properties brings property opportunities and personal guidance together.', points: [{ icon: '⌖', label: 'Local perspective' }, { icon: '⌂', label: 'Property opportunities' }, { icon: '↗', label: 'Personal guidance' }] })}
    ${listingsSection(listings)}
    ${servicesSection()}
    ${winningListingSection(listings)}
    ${testimonialPreviewSection(testimonialPreview)}
    ${visualStoriesSection(visualStories)}
    ${blogSection(blogPosts)}
    ${faqSection(faqs)}
    `, footerCta: sharedFooterCta() });
}

export function blogPage() {
  return layout({ title: 'Blog', path: '/blog/', description: 'Property insights, viewing guides and design perspectives from Okasha Properties.', body: `${blogHero()}${blogSection(blogPosts, { standalone: true, modal: true })}${visualStoriesSection(visualStories)}${faqSection(faqs)}`, footerCta: sharedFooterCta() });
}

export function blogArticlePage(post) {
  const date = new Date(`${post.date}T00:00:00`).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' });
  return layout({ title: post.title, path: `/blog/${post.slug}/`, description: post.excerpt, body: `${pageHero({ eyebrow: `${post.category} · ${date}`, title: post.title, description: post.excerpt })}<article class="blog-article"><div class="container blog-article-shell"><img class="blog-article-image" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.alt)}" fetchpriority="high"><div class="blog-article-body">${post.sections.map((section) => `<section><h2>${escapeHtml(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`).join('')}</div><a class="blog-back-link" href="/blog/">← More articles</a></div></article>`, footerCta: sharedFooterCta() });
}

export function aboutPage() {
  return layout({ title: 'About', path: '/about/', description: `Learn about Okasha Properties, based in ${site.location}.`, body: `
    ${pageHero({ eyebrow: 'About Okasha Properties', title: 'Local perspective. Considered property decisions.', description: 'A Rawalpindi property company built around trust, clear communication and a practical understanding of the local market.' })}
    ${editorialIntroSection({ label: 'About Okasha', title: 'Property is personal,', emphasis: 'and local perspective matters.', copy: 'Okasha Properties helps people explore opportunities with greater clarity through honest conversations, careful attention and knowledge of Rawalpindi.', points: [{ icon: '⌖', label: 'Local perspective' }, { icon: '◇', label: 'Trust in every conversation' }, { icon: '↗', label: 'Personal guidance' }] })}
    <section class="section leadership-section"><div class="container leadership-profile leadership-profile-ceo"><figure><img src="/abdul-qudoos-portrait.png" alt="Editorial portrait preview for Abdul Qudoos" loading="lazy" decoding="async"><figcaption>Portrait preview</figcaption></figure><div class="leadership-copy"><p class="eyebrow">Chief Executive Officer</p><h2>Abdul Qudoos</h2><p class="leadership-lead">Leading Okasha Properties with a clear focus on trust, local understanding and long-term client relationships.</p><p>Abdul brings a considered approach to property conversations, helping clients move from early questions to more focused decisions with confidence.</p><div class="person-links"><a href="/contact/">Contact</a><a href="mailto:${escapeHtml(site.email)}">Email</a><span>LinkedIn · To be added</span></div></div></div></section>
    <section class="section section-tint leadership-section"><div class="container leadership-profile leadership-profile-director"><div class="leadership-copy"><p class="eyebrow">Director</p><h2>Afaq Khan</h2><p class="leadership-lead">Connecting market awareness with a calm, practical approach to each property brief.</p><p>Afaq supports the direction of the company and works to keep every interaction clear, responsive and grounded in the needs of the client.</p><div class="person-links"><a href="/contact/">Contact</a><a href="mailto:${escapeHtml(site.email)}">Email</a><span>LinkedIn · To be added</span></div></div><figure><img src="/afaq-khan-portrait.png" alt="Editorial portrait preview for Afaq Khan" loading="lazy" decoding="async"><figcaption>Portrait preview</figcaption></figure></div></section>
    <section class="section about-team-section"><div class="container"><div class="section-heading"><div><p class="eyebrow">Our team</p><h2>People behind the perspective.</h2></div></div><div class="about-team-list"><article><span>01</span><h3>Abdul Qudoos</h3><p>CEO</p><div class="person-links"><a href="/contact/">Contact</a><a href="mailto:${escapeHtml(site.email)}">Email</a><span>LinkedIn · To be added</span></div></article><article><span>02</span><h3>Afaq Khan</h3><p>Director</p><div class="person-links"><a href="/contact/">Contact</a><a href="mailto:${escapeHtml(site.email)}">Email</a><span>LinkedIn · To be added</span></div></article><article><span>03</span><h3>Hamza Ali</h3><p>Property Consultant</p><div class="person-links"><a href="/contact/">Contact</a><a href="mailto:${escapeHtml(site.email)}">Email</a><span>LinkedIn · To be added</span></div></article><article><span>04</span><h3>Sara Ahmed</h3><p>Client Relations</p><div class="person-links"><a href="/contact/">Contact</a><a href="mailto:${escapeHtml(site.email)}">Email</a><span>LinkedIn · To be added</span></div></article></div></div></section>
    ${visualStoriesSection(visualStories)}
    ${faqSection(faqs)}`,
    footerCta: sharedFooterCta() });
}

export function propertiesPage(category = 'all') {
  const title = 'Find a property that fits your next move.';
  const description = 'Explore property opportunities across Rawalpindi, with clear information to help you begin a more focused enquiry.';
  const path = category === 'all' ? '/properties/' : `/properties/${category}/`;
  const pageTitle = category === 'all' ? 'Properties' : `${category[0].toUpperCase()}${category.slice(1)} Properties`;
  return layout({ title: pageTitle, path, description, body: `${propertyHeader({ title, description })}${propertyFilters({ count: listings.length })}${propertyGrid(listings)}${testimonialPreviewSection(testimonialPreview)}${faqSection(faqs)}`, footerCta: sharedFooterCta() });
}export function projectsPage() {
  return layout({ title: 'Projects', path: '/projects/', description: 'Explore projects from Okasha Properties in Rawalpindi. Confirmed project details will be added here.', body: `
    ${pageHero({ eyebrow: 'Our projects', title: 'Places with a purpose.', description: 'Explore our project collection. Confirmed details and imagery will be added as they become available.' })}
    <section class="section"><div class="container">${sectionHeading({ eyebrow: 'Portfolio', title: 'Project collection', description: 'Each project will have its own page when its details are ready.' })}${cards(projects, projectCard)}<p class="collection-note">Interested in a project? Contact our team for the latest confirmed information.</p></div></section>`, footerCta: sharedFooterCta() });
}

export function eventsPage() {
  return layout({ title: 'Events', path: '/events/', description: 'Events from Okasha Properties are coming soon.', body: `${pageHero({ eyebrow: 'Events', title: 'Coming soon.', description: 'Property events, announcements and gatherings will be shared here.' })}`, footerCta: sharedFooterCta() });
}

export function contactPage() {
  return layout({ title: 'Contact', path: '/contact/', description: `Contact Okasha Properties. Office location: ${site.location}.`, body: `
    ${pageHero({ eyebrow: 'Contact', title: 'Let’s talk property.', description: 'Tell us what you are looking for and our Rawalpindi team can help you take the next step.' })}
    ${contactSection()}
    <section class="contact-route-promo" aria-labelledby="contact-route-title"><div class="container"><article class="contact-route-panel"><div class="contact-route-copy"><p class="contact-route-kicker">Prefer to talk directly?</p><h2 id="contact-route-title">Choose the contact route <strong>that suits you.</strong></h2><p>Speak with the Okasha Properties team about buying, renting, selling or presenting a property in Rawalpindi.</p><div class="contact-route-meta"><span>Property enquiries</span><span>Rawalpindi</span><span>Direct support</span></div><div class="contact-route-actions">${site.phone ? `<a class="contact-route-cta" href="https://wa.me/${escapeHtml(site.phone.replace(/\D/g, ''))}">WhatsApp Us <span aria-hidden="true">→</span></a>` : '<span class="contact-route-cta is-disabled" aria-disabled="true" title="WhatsApp number to be added">WhatsApp Us <span aria-hidden="true">→</span></span>'}<a class="contact-route-cta" href="mailto:${escapeHtml(site.email)}">Email Us <span aria-hidden="true">→</span></a></div></div><img class="contact-route-house" src="/okasha-featured-house-3d.png" alt="Contemporary architectural house illustration" loading="lazy" decoding="async"></article></div></section>
    <section class="section section-tint" id="location"><div class="container">${sectionHeading({ eyebrow: 'Our location', title: 'Find us in Westridge III', description: site.location })}<div class="map-embed"><iframe title="Okasha Properties location in Rawalpindi" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(site.location)}&amp;output=embed"></iframe></div></div></section>`, footerCta: sharedFooterCta() });
}

const policySection = (sections) => `<section class="section policy-page"><div class="container policy-shell">${sections.map((section) => `<section><h2>${escapeHtml(section.title)}</h2>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`).join('')}</div></section>`;

export function privacyPage() {
  const sections = [
    { title: 'Information we collect', paragraphs: ['We may collect information you provide through enquiries, including your name, contact details, property interests, preferred location, budget and message.', 'Basic technical information may also be collected by our hosting or analytics services to keep the website secure and understand how it is used.'] },
    { title: 'How we use information', paragraphs: ['We use enquiry information to respond, discuss relevant property opportunities, arrange contact and improve our services. We do not sell personal information.', 'Information is retained only for as long as reasonably needed for these purposes or to meet legal obligations.'] },
    { title: 'Sharing and security', paragraphs: ['Information may be shared with service providers that support website hosting, communications or professional property processes when necessary. We take reasonable steps to protect the information we hold.'] },
    { title: 'Your choices', paragraphs: [`You may ask to access, correct or delete personal information by contacting ${site.email}. You can also ask us to stop non-essential communications.`] },
    { title: 'Updates', paragraphs: ['This policy may be updated when our services or legal obligations change. The latest version will remain available on this page.'] }
  ];
  return layout({ title: 'Privacy Policy', path: '/privacy/', description: 'Privacy policy for Okasha Properties.', body: `${pageHero({ eyebrow: 'Privacy', title: 'Privacy policy.', description: 'How Okasha Properties handles information shared through this website.' })}${policySection(sections)}`, footerCta: sharedFooterCta() });
}

export function termsPage() {
  const sections = [
    { title: 'Website information', paragraphs: ['Content is provided for general information and property discovery. Availability, pricing, specifications and imagery must be independently confirmed before making a decision.', 'Illustrative images and sample content are identified where appropriate and should not be treated as verified property particulars.'] },
    { title: 'Enquiries and property decisions', paragraphs: ['Submitting an enquiry does not create an agency, reservation or contractual relationship. Any property transaction remains subject to verification, documentation and agreement between the relevant parties.', 'Users should obtain appropriate legal, financial, technical and tax advice before entering a transaction.'] },
    { title: 'Acceptable use', paragraphs: ['You may use this website for lawful personal and business enquiries. You must not interfere with its operation, attempt unauthorised access or reuse its content in a misleading way.'] },
    { title: 'Liability and external services', paragraphs: ['We aim to keep website information useful and current but cannot guarantee uninterrupted access or complete accuracy. External services and links are governed by their own terms and privacy practices.'] },
    { title: 'Contact', paragraphs: [`Questions about these terms can be sent to ${site.email}.`] }
  ];
  return layout({ title: 'Terms & Conditions', path: '/terms/', description: 'Website terms and conditions for Okasha Properties.', body: `${pageHero({ eyebrow: 'Website terms', title: 'Terms & conditions.', description: 'The terms that apply when using the Okasha Properties website.' })}${policySection(sections)}`, footerCta: sharedFooterCta() });
}

export function sitemapPage() {
  const links = [['Home', '/'], ['Properties', '/properties/'], ['Rental', '/properties/rental/'], ['Sale', '/properties/sale/'], ['Plot', '/properties/plot/'], ['House', '/properties/house/'], ['Flat', '/properties/flat/'], ['Apartment', '/properties/apartment/'], ['About', '/about/'], ['Events', '/events/'], ['Blog', '/blog/'], ['Contact', '/contact/'], ['Privacy Policy', '/privacy/'], ['Terms & Conditions', '/terms/'], ['Sitemap', '/sitemap/']];
  return layout({ title: 'Sitemap', path: '/sitemap/', description: 'Browse the main pages of the Okasha Properties website.', body: `${pageHero({ eyebrow: 'Navigation', title: 'Website sitemap.', description: 'A clear route to every main area of the Okasha Properties website.' })}<section class="section sitemap-section"><div class="container sitemap-list">${links.map(([label, href], index) => `<a href="${href}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${label}</strong><b aria-hidden="true">→</b></a>`).join('')}</div></section>`, footerCta: sharedFooterCta() });
}

export function detailPage(kind, item) {
  const title = item.title;
  const path = kind === 'project' ? '/projects/' : '/events/';
  return layout({ title, path, description: item.summary, body: `${pageHero({ eyebrow: kind === 'project' ? 'Project' : 'Event', title, description: item.summary })}<section class="section"><div class="container detail-layout"><div><p class="eyebrow">Details</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(item.summary)}</p><p>${escapeHtml(item.location)}</p></div><div class="detail-media">${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(title)}">` : '<span>IMAGE TO BE ADDED</span>'}</div></div></section>`, footerCta: sharedFooterCta() });
}




