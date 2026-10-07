const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    navigation.classList.toggle('is-open', !open);
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || menuButton.getAttribute('aria-expanded') !== 'true') return;
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    menuButton.focus();
  });
}

const form = document.querySelector('#contact-form');
if (form) {
  const intent = form.elements.intent;
  const propertyFields = form.querySelector('[data-contact-property-fields]');
  const budgetLabel = form.querySelector('[data-budget-label]');
  const syncContactFields = () => {
    const general = intent.value === 'General enquiry';
    propertyFields.hidden = general;
    budgetLabel.firstChild.textContent = ['Sell a property', 'Rent out my property'].includes(intent.value) ? 'Expected price / rent' : 'Budget';
  };
  intent.addEventListener('change', syncContactFields);
  syncContactFields();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = form.dataset.contactEmail;
    if (!email || !form.reportValidity()) return;
    const data = new FormData(form);
    const subject = `[Okasha Properties] ${data.get('intent')}`;
    const details = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Phone / WhatsApp: ${data.get('phone') || 'Not provided'}`,
      `Enquiry: ${data.get('intent')}`,
      ...(data.get('intent') === 'General enquiry' ? [] : [
        `Property type: ${data.get('propertyType') || 'Not specified'}`,
        `Preferred location: ${data.get('location') || 'Not specified'}`,
        `Budget / expected price: ${data.get('budget') || 'Not specified'}`
      ]),
      '',
      String(data.get('message'))
    ];
    const body = details.join('\n');
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

document.querySelectorAll('[data-go-back]').forEach((button) => {
  button.addEventListener('click', () => {
    const fallback = button.dataset.fallback || '/';
    try {
      if (document.referrer && new URL(document.referrer).origin === window.location.origin && window.history.length > 1) {
        window.history.back();
        return;
      }
    } catch {}
    window.location.href = fallback;
  });
});

const heroSearch = document.querySelector('.hero-search');
if (heroSearch) {
  const chips = [...heroSearch.querySelectorAll('[data-filter-target]')];
  const syncChips = () => {
    for (const chip of chips) {
      const field = heroSearch.querySelector(`#${chip.dataset.filterTarget}`);
      chip.setAttribute('aria-pressed', String(field?.value === chip.dataset.filterValue));
    }
  };

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      const field = heroSearch.querySelector(`#${chip.dataset.filterTarget}`);
      if (!field) return;
      field.value = field.value === chip.dataset.filterValue ? '' : chip.dataset.filterValue;
      syncChips();
    });
  }
  heroSearch.querySelectorAll('select').forEach((field) => field.addEventListener('change', syncChips));
}

const listingSection = document.querySelector('.listings-section');
if (listingSection) {
  const cards = [...listingSection.querySelectorAll('.listing-card')];
  const previous = listingSection.querySelector('.listings-prev');
  const next = listingSection.querySelector('.listings-next');
  const count = listingSection.querySelector('.listings-count');
  const track = listingSection.querySelector('.listing-track');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let start = 0;
  let visible = 3;
  let moving = false;

  const updateListings = () => {
    visible = window.innerWidth <= 700 ? 1 : window.innerWidth <= 1050 ? 2 : 3;
    start = Math.min(start, cards.length - visible);
    cards.forEach((card, index) => { card.hidden = index < start || index >= start + visible; });
    previous.disabled = next.disabled = cards.length <= visible;
    count.textContent = `${String(start + 1).padStart(2, '0')}–${String(start + visible).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  };

  const moveListings = async (direction) => {
    if (moving || cards.length <= visible) return;
    moving = true;
    if (!reducedMotion.matches) {
      const exit = track.animate([
        { opacity: 1, transform: 'translateX(0)' },
        { opacity: 0, transform: `translateX(${direction * -14}px)` }
      ], { duration: 180, easing: 'ease-in', fill: 'forwards' });
      await exit.finished;
      exit.cancel();
    }
    start = (start + direction + cards.length - visible + 1) % (cards.length - visible + 1);
    updateListings();
    if (!reducedMotion.matches) {
      const enter = track.animate([
        { opacity: 0, transform: `translateX(${direction * 14}px)` },
        { opacity: 1, transform: 'translateX(0)' }
      ], { duration: 340, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      await enter.finished;
    }
    moving = false;
  };

  previous.addEventListener('click', () => moveListings(-1));
  next.addEventListener('click', () => moveListings(1));
  window.addEventListener('resize', updateListings);
  updateListings();

  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    listingSection.classList.add('is-reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      listingSection.classList.add('is-visible');
      observer.disconnect();
    }, { threshold: 0.12 });
    observer.observe(listingSection);
  }
}

const winningListing = document.querySelector('[data-winning-listing]');
if (winningListing) {
  const slides = [...winningListing.querySelectorAll('.winning-listing-slide')];
  winningListing.addEventListener('click', (event) => {
    const button = event.target.closest('[data-winning-prev], [data-winning-next]');
    if (!button) return;
    const current = slides.findIndex((slide) => !slide.hidden);
    const direction = button.hasAttribute('data-winning-next') ? 1 : -1;
    const next = (current + direction + slides.length) % slides.length;
    slides[current].hidden = true;
    slides[next].hidden = false;
    slides[next].querySelector(direction === 1 ? '[data-winning-next]' : '[data-winning-prev]').focus();
  });
}

const visualStories = document.querySelector('[data-visual-stories]');
if (visualStories) {
  const cards = [...visualStories.querySelectorAll('.visual-story-card')];
  const dialog = visualStories.querySelector('.visual-story-dialog');
  const video = dialog.querySelector('video');
  const closeButton = dialog.querySelector('.visual-story-close');
  const previous = visualStories.querySelector('.visual-stories-prev');
  const next = visualStories.querySelector('.visual-stories-next');
  const dialogPrevious = dialog.querySelector('.visual-story-dialog-prev');
  const dialogNext = dialog.querySelector('.visual-story-dialog-next');
  const stage = visualStories.querySelector('.visual-stories-stage');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let visible = false;
  let hovering = false;
  let opener = null;
  let dragStart = null;
  let dragged = false;

  const positionCards = () => {
    cards.forEach((card, index) => {
      let offset = (index - active + cards.length) % cards.length;
      if (offset > Math.floor(cards.length / 2)) offset -= cards.length;
      card.dataset.storyOffset = String(offset);
      card.style.setProperty('--story-offset', offset);
      card.tabIndex = Math.abs(offset) === 3 ? -1 : 0;
      card.setAttribute('aria-hidden', String(Math.abs(offset) === 3));
    });
  };
  positionCards();

  const moveStories = (direction) => {
    active = (active + direction + cards.length) % cards.length;
    positionCards();
  };

  const playStory = (index) => {
    active = (index + cards.length) % cards.length;
    positionCards();
    opener = cards[active];
    video.pause();
    video.poster = opener.dataset.storyPoster;
    video.src = opener.dataset.storyVideo;
    dialog.querySelector('.visual-story-dialog-title').textContent = '@okashaproperties';
    if (!dialog.open) dialog.showModal();
    video.play().catch(() => {});
  };

  if (!reducedMotion.matches) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.2 });
      observer.observe(visualStories);
    } else visible = true;
    window.setInterval(() => {
      if (!visible || hovering || document.hidden || dialog.open || (visualStories.contains(document.activeElement) && document.activeElement.matches(':focus-visible'))) return;
      moveStories(1);
    }, 4000);
  }

  visualStories.addEventListener('pointerenter', () => { hovering = true; });
  visualStories.addEventListener('pointerleave', () => { hovering = false; });
  previous.addEventListener('click', () => moveStories(-1));
  next.addEventListener('click', () => moveStories(1));
  stage.addEventListener('pointerdown', (event) => {
    dragStart = event.clientX;
    dragged = false;
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', (event) => {
    if (dragStart === null) return;
    if (Math.abs(event.clientX - dragStart) > 8) dragged = true;
  });
  const finishStoryDrag = (event) => {
    if (dragStart === null) return;
    const distance = event.clientX - dragStart;
    if (Math.abs(distance) > 42) moveStories(distance > 0 ? -1 : 1);
    dragStart = null;
    stage.classList.remove('is-dragging');
    window.setTimeout(() => { dragged = false; }, 0);
  };
  stage.addEventListener('pointerup', finishStoryDrag);
  stage.addEventListener('pointercancel', finishStoryDrag);
  cards.forEach((card, index) => card.addEventListener('click', (event) => {
    if (dragged) { event.preventDefault(); return; }
    playStory(index);
  }));
  dialogPrevious.addEventListener('click', () => playStory(active - 1));
  dialogNext.addEventListener('click', () => playStory(active + 1));
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
    opener?.focus();
  });
}

const reelsSection = document.querySelector('.social-reels-section');
if (reelsSection) {
  const cards = [...reelsSection.querySelectorAll('.social-reel-card')];
  const track = reelsSection.querySelector('.social-reels-grid');
  const previous = reelsSection.querySelector('.reels-prev');
  const next = reelsSection.querySelector('.reels-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let start = 0;
  let visible = 3;
  let moving = false;

  const updateReels = () => {
    visible = window.innerWidth <= 700 ? 1 : 3;
    const last = Math.max(0, cards.length - visible);
    start = Math.min(start, last);
    const active = start + Math.floor(visible / 2);
    cards.forEach((card, index) => {
      card.hidden = index < start || index >= start + visible;
      card.classList.toggle('is-active', index === active);
      card.classList.toggle('is-before', index < active);
      card.classList.toggle('is-after', index > active);
    });
    previous.disabled = next.disabled = cards.length <= visible;
  };

  const moveReels = async (direction) => {
    const last = cards.length - visible;
    if (moving || last <= 0) return;
    moving = true;
    if (!reducedMotion.matches) {
      const exit = track.animate([
        { opacity: 1, transform: 'translateX(0)' },
        { opacity: 0, transform: `translateX(${direction * -14}px)` }
      ], { duration: 180, easing: 'ease-in', fill: 'forwards' });
      await exit.finished;
      exit.cancel();
    }
    start = (start + direction + last + 1) % (last + 1);
    updateReels();
    if (!reducedMotion.matches) {
      const enter = track.animate([
        { opacity: 0, transform: `translateX(${direction * 14}px)` },
        { opacity: 1, transform: 'translateX(0)' }
      ], { duration: 340, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      await enter.finished;
    }
    moving = false;
  };

  previous.addEventListener('click', () => moveReels(-1));
  next.addEventListener('click', () => moveReels(1));
  window.addEventListener('resize', updateReels);
  updateReels();
}

const faqItems = [...document.querySelectorAll('.faq-item')];
if (faqItems.length) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new WeakMap();
  const intendedStates = new WeakMap();

  const setFaqOpen = (item, expand) => {
    const currentHeight = item.getBoundingClientRect().height;
    animations.get(item)?.cancel();
    intendedStates.set(item, expand);
    if (reducedMotion.matches) {
      item.open = expand;
      item.style.removeProperty('height');
      item.style.removeProperty('overflow');
      return;
    }

    item.style.height = `${currentHeight}px`;
    item.style.overflow = 'hidden';
    if (expand) item.open = true;
    const summary = item.querySelector('summary');
    const answer = item.querySelector('.faq-answer');
    const borders = parseFloat(getComputedStyle(item).borderTopWidth) + parseFloat(getComputedStyle(item).borderBottomWidth);
    const targetHeight = summary.offsetHeight + borders + (expand ? answer.offsetHeight : 0);
    const animation = item.animate(
      [{ height: `${currentHeight}px` }, { height: `${targetHeight}px` }],
      { duration: 280, easing: 'cubic-bezier(.22, 1, .36, 1)' }
    );
    animations.set(item, animation);
    animation.onfinish = () => {
      if (!expand) item.open = false;
      item.style.removeProperty('height');
      item.style.removeProperty('overflow');
      animations.delete(item);
    };
  };

  faqItems.forEach((item) => {
    item.querySelector('summary').addEventListener('click', (event) => {
      event.preventDefault();
      const expand = !(intendedStates.get(item) ?? item.open);
      if (expand) faqItems.forEach((other) => {
        if (other !== item && (intendedStates.get(other) ?? other.open)) setFaqOpen(other, false);
      });
      setFaqOpen(item, expand);
    });
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) faqItems.forEach((item) => animations.get(item)?.finish());
  });
}

const scrollScaleSections = document.querySelectorAll('.cta-section-endcap');
if (scrollScaleSections.length) {
  const canAnimate = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const initialScale = 1.02 - 0.1667 * 0.12;

  for (const section of scrollScaleSections) {
    if (canAnimate.matches) {
      section.style.transform = `scale(${initialScale})`;
      section.style.transition = 'transform 0.3s ease-out';
    }
  }

  let scrollFrame = 0;
  const updateScale = () => {
    scrollFrame = 0;
    for (const section of scrollScaleSections) {
      if (!canAnimate.matches) {
        section.style.removeProperty('transform');
        section.style.removeProperty('transition');
        continue;
      }

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollProgress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ));
      const scale = 1.02 - scrollProgress * 0.12;

      section.style.transform = `scale(${scale})`;
      section.style.transition = 'transform 0.3s ease-out';
    }
  };

  const handleScroll = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScale);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  canAnimate.addEventListener('change', handleScroll);
  handleScroll();
}

function setUpScrollReveal(section) {
  const copy = section.querySelector('[data-reveal-copy]') || section.querySelector('p');
  if (!copy) return;

  const textNodes = [];
  const walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeValue.trim()) textNodes.push(node);
  }

  const words = [];
  for (const node of textNodes) {
    const fragment = document.createDocumentFragment();
    for (const part of node.nodeValue.match(/\s+|\S+/gu) || []) {
      if (/^\s+$/u.test(part)) {
        fragment.append(document.createTextNode(part));
      } else {
        const word = document.createElement('span');
        word.className = 'reveal-word';
        word.textContent = part;
        words.push(word);
        fragment.append(word);
      }
    }
    node.replaceWith(fragment);
  }

  if (!words.length) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;

  function update() {
    scheduled = false;
    if (reducedMotion.matches) {
      for (const word of words) word.style.removeProperty('opacity');
      return;
    }

    const viewportHeight = window.innerHeight;
    const start = viewportHeight * 0.88;
    const finish = viewportHeight * 0.46;
    const top = section.getBoundingClientRect().top;
    const progress = Math.max(0, Math.min(1, (start - top) / (start - finish)));
    const total = words.length;

    words.forEach((word, index) => {
      // Each word fades over four word slots, so adjacent fades overlap.
      const amount = Math.max(0, Math.min(1, (progress * (total + 3) - index) / 4));
      const eased = amount * amount * (3 - 2 * amount);
      word.style.opacity = (0.26 + 0.74 * eased).toFixed(3);
    });
  }

  function requestUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  reducedMotion.addEventListener('change', requestUpdate);
  update();
}

document.querySelectorAll('[data-scroll-reveal]').forEach(setUpScrollReveal);

const introCounters = document.querySelectorAll('.home-message-stat [data-count]');
if (introCounters.length) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const showFinalValues = () => introCounters.forEach((counter) => { counter.textContent = counter.dataset.count; });

  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    introCounters.forEach((counter) => { counter.textContent = '0'; });
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 1100;
      const tick = (now) => {
        if (reducedMotion.matches) { showFinalValues(); return; }
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        introCounters.forEach((counter) => {
          counter.textContent = String(Math.round(Number(counter.dataset.count) * eased));
        });
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    observer.observe(document.querySelector('.home-message-stats'));
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) { observer.disconnect(); showFinalValues(); }
    });
  }
}

const testimonialVideos = [...document.querySelectorAll('[data-testimonial-video]')];
if (testimonialVideos.length) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const section = document.querySelector('.testimonials-section');
  const pauseVideos = () => testimonialVideos.forEach((video) => video.pause());
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) { pauseVideos(); return; }
      testimonialVideos.forEach((video) => {
        if (!video.src) video.src = video.dataset.src;
      });
    }, { rootMargin: '180px 0px' }).observe(section);
  } else {
    testimonialVideos.forEach((video) => { video.src = video.dataset.src; });
  }
  testimonialVideos.forEach((video) => {
    const tile = video.closest('.testimonial-video-tile');
    tile.addEventListener('mouseenter', () => {
      if (reducedMotion.matches || document.hidden) return;
      pauseVideos();
      if (!video.src) video.src = video.dataset.src;
      video.play().catch(() => {});
    });
    tile.addEventListener('mouseleave', () => video.pause());
  });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) pauseVideos(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseVideos(); });
}

const testimonialTrack = document.querySelector('.testimonial-quotes');
if (testimonialTrack) {
  const originalCards = [...testimonialTrack.querySelectorAll('.testimonial-quote:not([aria-hidden])')];
  const allCards = [...testimonialTrack.querySelectorAll('.testimonial-quote')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let timer;
  const stop = () => window.clearInterval(timer);
  const advance = () => {
    if (originalCards.length < 2) return;
    const step = originalCards[1].offsetLeft - originalCards[0].offsetLeft;
    if (!step) return;
    let index = Math.round(testimonialTrack.scrollLeft / step);
    // The first duplicate is identical to the first card, so the reset is invisible.
    if (index >= originalCards.length) {
      testimonialTrack.scrollLeft = 0;
      index = 0;
    }
    const nextIndex = index + 1;
    testimonialTrack.scrollTo({ left: allCards[nextIndex].offsetLeft - allCards[0].offsetLeft, behavior: 'smooth' });
  };
  const start = () => {
    stop();
    if (visible && !reducedMotion.matches && !document.hidden && !testimonialTrack.matches(':focus-within')) {
      timer = window.setInterval(advance, 5000);
    }
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    }, { threshold: 0.2 }).observe(testimonialTrack);
  } else { visible = true; start(); }
  testimonialTrack.addEventListener('focusin', stop);
  testimonialTrack.addEventListener('focusout', start);
  reducedMotion.addEventListener('change', start);
  document.addEventListener('visibilitychange', start);
  window.addEventListener('resize', () => { testimonialTrack.scrollLeft = 0; start(); });
}

const propertyDropdown = document.querySelector('.nav-dropdown');
if (propertyDropdown) {
  const toggle = propertyDropdown.querySelector('.nav-dropdown-trigger button');
  toggle?.addEventListener('click', () => {
    const open = propertyDropdown.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    propertyDropdown.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
}

const propertyFilterToggle = document.querySelector('.property-filter-toggle');
const propertyFilters = document.querySelector('.property-filters');
if (propertyFilterToggle && propertyFilters) {
  propertyFilterToggle.addEventListener('click', () => {
    const open = propertyFilters.classList.toggle('is-open');
    propertyFilterToggle.setAttribute('aria-expanded', String(open));
    propertyFilterToggle.querySelector('span').textContent = open ? '−' : '＋';
  });
}

const propertyGrid = document.querySelector('.property-result-grid');
if (propertyGrid) {
  const cards = [...propertyGrid.querySelectorAll('.property-result-card')];
  const categoryLinks = [...document.querySelectorAll('[data-property-category]')];
  const filtersForm = document.querySelector('.property-filters');
  const resultCount = document.querySelector('[data-property-result-count]');
  const resultLabel = document.querySelector('[data-property-result-label]');
  const reset = document.querySelector('[data-property-reset]');
  const pathCategory = window.location.pathname.match(/^\/properties\/(rental|sale|plot|house|flat|apartment)\/?$/)?.[1];
  let category = new URLSearchParams(window.location.search).get('category') || pathCategory || 'all';

  const syncCategoryControls = () => {
    categoryLinks.forEach((link) => {
      const active = link.dataset.propertyCategory === category;
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (!filtersForm) return;
    const type = filtersForm.elements.type;
    const purpose = filtersForm.elements.purpose;
    const typeCategory = ['plot', 'house', 'flat', 'apartment'].includes(category);
    const purposeCategory = ['rental', 'sale'].includes(category);
    type.value = typeCategory ? `${category[0].toUpperCase()}${category.slice(1)}` : '';
    purpose.value = category === 'rental' ? 'For rent' : category === 'sale' ? 'For sale' : '';
    filtersForm.querySelector('.property-filter-type')?.classList.toggle('is-category-controlled', typeCategory);
    filtersForm.querySelector('.property-filter-purpose')?.classList.toggle('is-category-controlled', purposeCategory);
  };

  const applyPropertyFilters = () => {
    const location = filtersForm?.elements.location.value.toLowerCase() || '';
    const type = filtersForm?.elements.type.value.toLowerCase() || '';
    const purposeValue = filtersForm?.elements.purpose.value || '';
    const purpose = purposeValue === 'For rent' ? 'rental' : purposeValue === 'For sale' ? 'sale' : '';
    const bedroomsValue = filtersForm?.elements.bedrooms.value || '';
    const minimumBedrooms = bedroomsValue ? Number.parseInt(bedroomsValue, 10) : 0;
    let visible = 0;
    cards.forEach((card) => {
      const matches = (!location || card.dataset.propertyLocation === location) && (!type || card.dataset.propertyType === type) && (!purpose || card.dataset.propertyPurpose === purpose) && (!minimumBedrooms || Number(card.dataset.propertyBedrooms || 0) >= minimumBedrooms);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    if (resultCount) resultCount.textContent = String(visible);
    if (resultLabel) { const noun = category === 'house' ? 'house' : category === 'plot' ? 'plot' : category === 'flat' ? 'flat' : category === 'apartment' ? 'apartment' : 'property'; const plural = noun === 'property' ? 'properties' : noun + 's'; resultLabel.textContent = (visible === 1 ? noun : plural) + ' available'; }
  };

  categoryLinks.forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    category = link.dataset.propertyCategory;
    const url = category === 'all' ? '/properties/' : '/properties/' + category + '/';
    window.history.replaceState({}, '', url);
    syncCategoryControls();
    applyPropertyFilters();
  }));

  filtersForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    category = 'all';
    categoryLinks.forEach((link) => link.removeAttribute('aria-current'));
    categoryLinks[0]?.setAttribute('aria-current', 'page');
    window.history.replaceState({}, '', '/properties/');
    applyPropertyFilters();
    filtersForm.classList.remove('is-open');
    propertyFilterToggle?.setAttribute('aria-expanded', 'false');
  });
  reset?.addEventListener('click', (event) => {
    event.preventDefault();
    filtersForm?.reset();
    category = 'all';
    window.history.replaceState({}, '', '/properties/');
    syncCategoryControls();
    applyPropertyFilters();
  });
  syncCategoryControls();
  applyPropertyFilters();
}

document.querySelectorAll('[data-blog-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const dialog = document.querySelector(`[data-blog-dialog="${CSS.escape(trigger.dataset.blogOpen)}"]`);
    dialog?.showModal();
  });
});
document.querySelectorAll('.blog-reader').forEach((dialog) => {
  dialog.querySelector('.blog-reader-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
});





