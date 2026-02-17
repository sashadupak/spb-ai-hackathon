/* ============================================
   AI & BUSINESS HACKATHON v2 — PREMIUM SCRIPTS
   GSAP + Canvas + Immersive Animations
   ============================================ */

'use strict';

/* --- Register GSAP plugins --- */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ============================================
   PRELOADER
   ============================================ */
const preloader = document.querySelector('.preloader');
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    preloader.classList.add('loading');
    setTimeout(() => {
      preloader.classList.add('done');
      initAnimations();
    }, 1800);
  });
});

/* ============================================
   GLOBAL BACKGROUND ORBS (appended to body)
   ============================================ */
function createSiteBg() {
  const bg = document.createElement('div');
  bg.className = 'site-bg';
  bg.innerHTML = `
    <div class="site-bg__orb site-bg__orb--1"></div>
    <div class="site-bg__orb site-bg__orb--2"></div>
    <div class="site-bg__orb site-bg__orb--3"></div>
  `;
  document.body.prepend(bg);
}
createSiteBg();

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progressBar.style.width = (scrolled / maxScroll * 100) + '%';
}, { passive: true });

/* ============================================
   HERO CANVAS — NEURAL NETWORK ANIMATION
   ============================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let nodes = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createNodes(count) {
    count = count || 60;
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach(function(n) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(167,139,250,' + n.alpha + ')';
      ctx.fill();
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(124,58,237,' + (0.15 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createNodes();
  draw();

  window.addEventListener('resize', function() {
    resize();
    createNodes();
  });
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNav() {
  const nav = document.getElementById('nav');
  const burger = nav ? nav.querySelector('.nav__burger') : null;
  const mobile = document.querySelector('.nav__mobile');

  // Solid on scroll
  window.addEventListener('scroll', function() {
    if (nav) nav.classList.toggle('nav--solid', window.scrollY > 40);
  }, { passive: true });

  // Burger toggle
  if (burger && mobile) {
    burger.addEventListener('click', function() {
      const isOpen = mobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        mobile.style.display = 'flex';
      }
    });

    mobile.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        mobile.classList.remove('open');
        mobile.style.display = '';
      });
    });
  }

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 70 },
        duration: 1.0,
        ease: 'power3.inOut'
      });
      if (mobile) {
        mobile.classList.remove('open');
        mobile.style.display = '';
      }
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[data-spy]');

  const spy = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function(l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(function(s) { spy.observe(s); });
}

/* ============================================
   GSAP SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  // Reveal elements
  gsap.utils.toArray('.gs-reveal').forEach(function(el) {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Scale reveal
  gsap.utils.toArray('.gs-reveal-scale').forEach(function(el) {
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Stagger children
  gsap.utils.toArray('.gs-stagger').forEach(function(container) {
    const children = container.children;
    gsap.to(children, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Fade only
  gsap.utils.toArray('.gs-fade').forEach(function(el) {
    gsap.to(el, {
      opacity: 1,
      duration: 1.0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Hero entrance animation
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    const heroDate = heroContent.querySelector('.hero__date');
    const heroTitle = heroContent.querySelector('.hero__title');
    const heroSub = heroContent.querySelector('.hero__sub');
    const heroTags = heroContent.querySelector('.hero__tags');
    const heroCta = heroContent.querySelector('.hero__cta');

    const tl = gsap.timeline({ delay: 1.9 });
    if (heroDate) tl.fromTo(heroDate, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    if (heroTitle) tl.fromTo(heroTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');
    if (heroSub) tl.fromTo(heroSub, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4');
    if (heroTags) tl.fromTo(heroTags, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    if (heroCta) tl.fromTo(heroCta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
  }

  // Parallax effect on hero orbs
  document.querySelectorAll('.hero__orb').forEach(function(orb, i) {
    gsap.to(orb, {
      y: (i + 1) * 60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // Mission section
  const missionStatement = document.querySelector('.mission__statement');
  if (missionStatement) {
    gsap.fromTo(missionStatement,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: missionStatement, start: 'top 85%' }
      }
    );
  }

  const missionQuote = document.querySelector('.mission__quote');
  if (missionQuote) {
    gsap.fromTo(missionQuote,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: missionQuote, start: 'top 85%' }
      }
    );
  }

  const missionDesc = document.querySelector('.mission__desc');
  if (missionDesc) {
    gsap.fromTo(missionDesc,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: missionDesc, start: 'top 88%' }
      }
    );
  }
}

/* ============================================
   ANIMATED TIMELINE
   ============================================ */
function initTimeline() {
  const timelineEl = document.querySelector('.timeline');
  if (!timelineEl) return;

  const progressEl = timelineEl.querySelector('.timeline__progress');
  const steps = timelineEl.querySelectorAll('.timeline__step');

  if (!progressEl || !steps.length) return;

  // Animate the progress fill and step activation based on scroll
  ScrollTrigger.create({
    trigger: timelineEl,
    start: 'top 80%',
    end: 'bottom 20%',
    onUpdate: function(self) {
      var progress = self.progress;
      progressEl.style.height = (progress * 100) + '%';

      // Activate steps progressively
      steps.forEach(function(step, i) {
        var threshold = (i + 1) / (steps.length + 1);
        step.classList.toggle('active', progress >= threshold * 0.9);
      });
    }
  });

  // Entrance animation for each step card
  steps.forEach(function(step, i) {
    const card = step.querySelector('.timeline__step-card');
    if (!card) return;
    gsap.fromTo(card,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
        delay: 0.05 * i,
        scrollTrigger: {
          trigger: step,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
function initFaq() {
  const items = document.querySelectorAll('.faq__item');
  items.forEach(function(item) {
    const btn = item.querySelector('.faq__q');
    if (!btn) return;
    btn.addEventListener('click', function() {
      const isOpen = item.classList.contains('open');
      items.forEach(function(i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ============================================
   MODAL
   ============================================ */
function initModal() {
  const modals = document.querySelectorAll('.modal');

  document.querySelectorAll('[data-modal]').forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const id = trigger.getAttribute('data-modal');
      const modal = document.getElementById('modal-' + id);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modals.forEach(function(modal) {
    const overlay = modal.querySelector('.modal__overlay');
    const close = modal.querySelector('[data-modal-close]');

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (overlay) overlay.addEventListener('click', closeModal);
    if (close) close.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modals.forEach(function(m) { m.classList.remove('open'); });
      document.body.style.overflow = '';
    }
  });
}

/* ============================================
   CARD MAGNETIC GLOW (Mouse tracking)
   ============================================ */
function initCardGlow() {
  document.querySelectorAll('.card, .case-card, .criteria-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
}

/* ============================================
   PARTNERS MARQUEE
   ============================================ */
function initMarquee() {
  const track = document.querySelector('.marquee__track');
  if (!track) return;

  const partners = [
    'Компания A', 'Компания B', 'Компания C',
    'Компания D', 'Компания E', 'Компания F',
    'Партнёр G', 'Партнёр H'
  ];

  const allItems = partners.concat(partners).map(function(p) {
    return '<span>' + p + '</span>';
  }).join('');
  track.innerHTML = allItems;
}

/* ============================================
   NUMBER COUNTER ANIMATION
   ============================================ */
function initCounters() {
  document.querySelectorAll('[data-count]').forEach(function(el) {
    const target = parseInt(el.getAttribute('data-count'));
    let counted = false;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: function() {
        if (counted) return;
        counted = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = Math.round(obj.val);
          }
        });
      }
    });
  });
}

/* ============================================
   CURSOR GLOW (subtle, desktop only)
   ============================================ */
function initCursorGlow() {
  if (window.innerWidth <= 768) return;

  const glow = document.createElement('div');
  glow.style.cssText = [
    'position:fixed',
    'width:300px',
    'height:300px',
    'border-radius:50%',
    'pointer-events:none',
    'z-index:0',
    'background:radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
    'transform:translate(-50%,-50%)',
    'transition:opacity 0.3s',
    'opacity:0',
    'top:0',
    'left:0'
  ].join(';');
  document.body.appendChild(glow);

  document.addEventListener('mousemove', function(e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', function() { glow.style.opacity = '0'; });
}

/* ============================================
   INIT ALL
   ============================================ */
function initAnimations() {
  initHeroCanvas();
  initNav();
  initScrollAnimations();
  initTimeline();
  initFaq();
  initModal();
  initCardGlow();
  initMarquee();
  initCounters();
  initCursorGlow();
  initAudienceMobilePanel();

  // Refresh ScrollTrigger after all DOM is ready
  setTimeout(function() { ScrollTrigger.refresh(); }, 150);
}

/* ============================================
   AUDIENCE MOBILE DESCRIPTION PANEL
   ============================================ */
function initAudienceMobilePanel() {
  var panel = document.getElementById('audience-desc-panel');
  if (!panel) return;

  var cards = document.querySelectorAll('#audience-grid .audience-card');
  if (!cards.length) return;

  function isMobile() { return window.innerWidth <= 768; }

  function activateCard(card) {
    cards.forEach(function(c) { c.classList.remove('audience-card--active'); });
    card.classList.add('audience-card--active');
    var desc = card.getAttribute('data-desc') || card.querySelector('.audience-card__text').textContent;
    panel.textContent = desc;
    panel.style.opacity = '0';
    panel.style.display = 'block';
    requestAnimationFrame(function() { panel.style.opacity = '1'; });
  }

  function setupMobile() {
    if (isMobile()) {
      panel.style.display = 'block';
      // Show first card desc by default
      activateCard(cards[0]);

      cards.forEach(function(card) {
        card.addEventListener('mouseenter', function() { activateCard(card); });
        card.addEventListener('touchstart', function(e) {
          e.preventDefault();
          activateCard(card);
        }, { passive: false });
      });
    } else {
      panel.style.display = 'none';
      cards.forEach(function(c) { c.classList.remove('audience-card--active'); });
    }
  }

  setupMobile();
  window.addEventListener('resize', setupMobile);
}
