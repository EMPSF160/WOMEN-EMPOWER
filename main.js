/**
 * AURA WOMEN EMPOWERMENT ORGANIZATION
 * High-Performance Editorial Web Experience
 * Stack: Lenis Smooth Scroll, GSAP, ScrollTrigger, Swiper 11, Three.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initCustomCursor();
  initHeader();
  initMobileDrawer();
  initThreeHero();
  initGSAPAnimations();
  initWhatWeDoCards();
  initStoriesSwiper();
  initImpactCounters();
  initImpactMap();
  initModals();
  initDonationCalculator();
  initFormsAndToasts();
  initImpactInboxForm();
  initNewsLikesAndModal();
});

/* ==========================================================================
   01. LENIS SMOOTH SCROLLING + GSAP SCROLLTRIGGER SYNC
   ========================================================================== */
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  // Connect Lenis to GSAP ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Smooth scroll on anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, { offset: -60 });
          // Close mobile menu if open
          const mobileDrawer = document.getElementById('mobileDrawer');
          if (mobileDrawer && mobileDrawer.classList.contains('active')) {
            toggleMobileMenu(false);
          }
        }
      }
    });
  });
}

/* ==========================================================================
   02. CUSTOM CURSOR (Desktop Only)
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const trail = document.getElementById('cursorTrail');
  if (!cursor || !trail || window.innerWidth < 1024) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = mouseX;
  let trailY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function renderTrail() {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    trail.style.left = `${trailX}px`;
    trail.style.top = `${trailY}px`;
    requestAnimationFrame(renderTrail);
  }
  renderTrail();

  // Hover states on interactive elements
  const interactives = document.querySelectorAll('a, button, input, select, textarea, .pillar-card, .stat-card, .map-pin-hotspot');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   03. STICKY HEADER
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   04. FULLSCREEN MOBILE DRAWER
   ========================================================================== */
function toggleMobileMenu(open) {
  const drawer = document.getElementById('mobileDrawer');
  const hamburger = document.getElementById('hamburgerBtn');
  if (!drawer || !hamburger) return;

  if (open) {
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();

    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.drawer-link', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out', delay: 0.1 }
      );
    }
  } else {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }
}

function initMobileDrawer() {
  const hamburger = document.getElementById('hamburgerBtn');
  const closeBtn = document.getElementById('drawerCloseBtn');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      toggleMobileMenu(!isOpen);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => toggleMobileMenu(false));
  }
}

/* ==========================================================================
   05. THREE.JS SUBTLE HERO PARTICLES & ETHEREAL RIBBON
   ========================================================================== */
function initThreeHero() {
  const canvas = document.getElementById('heroThreeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle System
  const particleCount = 120;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 140;     // X
    positions[i + 1] = (Math.random() - 0.5) * 90;  // Y
    positions[i + 2] = (Math.random() - 0.5) * 60;  // Z
    scales[i / 3] = Math.random() * 2 + 1;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  // Glowing soft circle texture
  const particleCanvas = document.createElement('canvas');
  particleCanvas.width = 32;
  particleCanvas.height = 32;
  const ctx = particleCanvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(201, 92, 120, 1)');
  gradient.addColorStop(0.4, 'rgba(201, 92, 120, 0.4)');
  gradient.addColorStop(1, 'rgba(201, 92, 120, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(particleCanvas);

  const material = new THREE.PointsMaterial({
    size: 2.8,
    map: texture,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Ethereal Wave Ribbon Mesh
  const ribbonGeo = new THREE.PlaneGeometry(160, 100, 32, 24);
  const ribbonMat = new THREE.MeshBasicMaterial({
    color: 0xC95C78,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });
  const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
  ribbonMesh.rotation.x = -Math.PI / 3;
  ribbonMesh.position.y = -20;
  scene.add(ribbonMesh);

  // Animation Loop
  let clock = new THREE.Clock();
  let mouseEffect = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    mouseEffect.x = (e.clientX / window.innerWidth - 0.5) * 15;
    mouseEffect.y = (e.clientY / window.innerHeight - 0.5) * 15;
  }, { passive: true });

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Gentle particle drift
    particles.rotation.y = elapsedTime * 0.03;
    particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

    // Gentle ribbon undulation
    const pos = ribbonGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const z = Math.sin(u * 0.05 + elapsedTime * 0.8) * 4 + Math.cos(v * 0.05 + elapsedTime * 0.6) * 3;
      pos.setZ(i, z);
    }
    ribbonGeo.computeVertexNormals();
    pos.needsUpdate = true;

    // Smooth camera mouse follow
    camera.position.x += (mouseEffect.x - camera.position.x) * 0.03;
    camera.position.y += (-mouseEffect.y - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    const width = canvas.parentElement.offsetWidth;
    const height = canvas.parentElement.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/* ==========================================================================
   06. GSAP SCROLL ENTRANCE REVEALS
   ========================================================================== */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Staggered Entrance
  const heroTL = gsap.timeline({ delay: 0.2 });
  heroTL
    .fromTo('.hero-badge', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .fromTo('.hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.4')
    .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6')
    .fromTo('.hero-cta-group', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .fromTo('.hero-footer-bar', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');

  // Parallax on Mission Image
  const parallaxImg = document.querySelector('.parallax-img');
  if (parallaxImg && typeof ScrollTrigger !== 'undefined') {
    gsap.to(parallaxImg, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section-mission',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });
  }

  // Section Headers Reveal
  document.querySelectorAll('.reveal-text').forEach((el) => {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(el, 
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
  });

  document.querySelectorAll('.reveal-fade').forEach((el) => {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(el, 
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
  });
}

/* ==========================================================================
   07. WHAT WE DO — INTERACTIVE PILLARS
   ========================================================================== */
function initWhatWeDoCards() {
  const cards = document.querySelectorAll('.pillar-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      cards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
    });

    card.addEventListener('click', () => {
      const modal = document.getElementById('genericActionModal');
      const title = card.querySelector('.pillar-title')?.innerText || 'Pathway';
      openGenericModal('pathway', `Explore ${title}`, `Learn more about our initiatives and partnerships within the ${title} pathway.`);
    });
  });
}

/* ==========================================================================
   08. STORIES OF CHANGE — SWIPER 11 HORIZONTAL SLIDER
   ========================================================================== */
function initStoriesSwiper() {
  const swiperElem = document.getElementById('storiesSwiper');
  if (!swiperElem || typeof Swiper === 'undefined') return;

  new Swiper('#storiesSwiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 700,
    loop: true,
    grabCursor: true,
    autoplay: {
      delay: 7000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '#storiesPagination',
      clickable: true,
    },
    navigation: {
      nextEl: '#storyNextBtn',
      prevEl: '#storyPrevBtn',
    },
  });
}

/* ==========================================================================
   09. IMPACT COUNTERS (ScrollTrigger Eased Count)
   ========================================================================== */
function initImpactCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  let animated = false;

  const triggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 2200; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // EaseOutExpo curve
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = Math.floor(easeProgress * target);
            
            counter.innerText = currentVal.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = target.toLocaleString();
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.getElementById('impact');
  if (statsSection) {
    triggerObserver.observe(statsSection);
  }
}

/* ==========================================================================
   10. INTERACTIVE IMPACT MAP & COMMUNITY DETAILS
   ========================================================================== */
const mapHubData = {
  'hub-nairobi': {
    id: 'HUB #EA-01',
    region: 'east-africa',
    title: 'Nairobi Regional Innovation Hub',
    desc: 'Focusing on clean energy entrepreneurship and digital finance syndicates. Serving 18 rural satellite micro-centers across the Rift Valley.',
    grads: '3,420',
    capital: '$460K',
    rate: '94%',
    tags: ['Solar Energy', 'Microfinance', 'Agritech']
  },
  'hub-kampala': {
    id: 'HUB #EA-02',
    region: 'east-africa',
    title: 'Great Lakes Vocational Center',
    desc: 'Specialized in regenerative agro-business, artisan exports, and maternal healthcare advocacy networks across Western Uganda.',
    grads: '2,150',
    capital: '$280K',
    rate: '91%',
    tags: ['Artisan Exports', 'Agro-forestry', 'Health']
  },
  'hub-dhaka': {
    id: 'HUB #SA-01',
    region: 'south-asia',
    title: 'Dhaka NextGen Tech Guild',
    desc: 'Immersive coding bootcamps, remote engineering job placement, and digital literacy hubs for young women in urban communities.',
    grads: '3,100',
    capital: '$520K',
    rate: '96%',
    tags: ['Web Dev', 'Data Science', 'Tech Fellowships']
  },
  'hub-rajasthan': {
    id: 'HUB #SA-02',
    region: 'south-asia',
    title: 'Rajasthan Artisan & Weaving Syndicate',
    desc: 'Connecting traditional block-print and textile creators with direct international e-commerce channels to eliminate exploitative middlemen.',
    grads: '1,840',
    capital: '$210K',
    rate: '89%',
    tags: ['Textile Guild', 'Direct Trade', 'Financial Literacy']
  },
  'hub-oaxaca': {
    id: 'HUB #LA-01',
    region: 'latin-america',
    title: 'Oaxaca Indigenous Weavers Union',
    desc: 'Preserving ancestral weaving heritage while building collective health clinics and sovereign credit unions owned 100% by women.',
    grads: '1,280',
    capital: '$190K',
    rate: '95%',
    tags: ['Indigenous Rights', 'Credit Union', 'Health Clinic']
  },
  'hub-peru': {
    id: 'HUB #LA-02',
    region: 'latin-america',
    title: 'Andean Alpaca & Agriculture Guild',
    desc: 'Empowering high-altitude communities through sustainable wool harvesting, fair-trade processing cooperatives, and eco-tourism.',
    grads: '960',
    capital: '$140K',
    rate: '92%',
    tags: ['Fair Trade', 'Eco-Tourism', 'Cooperative Banking']
  },
  'hub-manila': {
    id: 'HUB #SEA-01',
    region: 'southeast-asia',
    title: 'Visayas Digital Career Outreach',
    desc: 'Providing decentralized virtual assistant and creative media training for women caregivers and single mothers across coastal islands.',
    grads: '1,450',
    capital: '$180K',
    rate: '90%',
    tags: ['Remote Work', 'Creative Media', 'Single Mothers']
  }
};

function initImpactMap() {
  const pins = document.querySelectorAll('.map-pin-hotspot');
  const filterBtns = document.querySelectorAll('.map-filter-btn');
  const panel = document.getElementById('communityInfoPanel');

  if (!pins.length) return;

  function updatePanelData(hubId) {
    const data = mapHubData[hubId];
    if (!data) return;

    document.getElementById('hubIdText').innerText = data.id;
    document.getElementById('hubTitle').innerText = data.title;
    document.getElementById('hubDesc').innerText = data.desc;
    document.getElementById('hubGrads').innerText = data.grads;
    document.getElementById('hubCap').innerText = data.capital;
    document.getElementById('hubRate').innerText = data.rate;

    const tagsContainer = document.getElementById('hubTags');
    tagsContainer.innerHTML = '';
    data.tags.forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'h-tag';
      span.innerText = tag;
      tagsContainer.appendChild(span);
    });
  }

  // Pin Click Handlers
  pins.forEach((pin) => {
    pin.addEventListener('click', () => {
      pins.forEach((p) => p.classList.remove('active'));
      pin.classList.add('active');
      const hubId = pin.getAttribute('data-id');
      updatePanelData(hubId);
    });
  });

  // Filter Buttons Handler
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const region = btn.getAttribute('data-region');

      let firstMatch = null;

      pins.forEach((pin) => {
        const pinRegion = pin.getAttribute('data-region');
        if (region === 'all' || pinRegion === region) {
          pin.style.display = 'block';
          if (!firstMatch) firstMatch = pin;
        } else {
          pin.style.display = 'none';
        }
      });

      if (firstMatch) {
        pins.forEach((p) => p.classList.remove('active'));
        firstMatch.classList.add('active');
        updatePanelData(firstMatch.getAttribute('data-id'));
      }
    });
  });
}

/* ==========================================================================
   11. MODAL WORKFLOWS (Donate & Generic Application)
   ========================================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (lenis) lenis.stop();
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lenis) lenis.start();
}

function openGenericModal(type, title, subtitle) {
  const modal = document.getElementById('genericActionModal');
  if (!modal) return;

  const tagElem = document.getElementById('genericModalTag');
  const titleElem = document.getElementById('genericModalTitle');
  const subElem = document.getElementById('genericModalSubtitle');
  const typeInput = document.getElementById('actionFormType');

  if (tagElem) tagElem.innerText = `✦ ${type.toUpperCase()} INITIATIVE`;
  if (titleElem) titleElem.innerText = title;
  if (subElem) subElem.innerText = subtitle;
  if (typeInput) typeInput.value = type;

  openModal('genericActionModal');
}

function initModals() {
  // Modal Triggers
  document.querySelectorAll('[data-modal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      
      if (modalId === 'volunteerModal') {
        openGenericModal('volunteer', 'Join as a Volunteer', 'Offer your technical, artistic, or grassroots skills to our worldwide hubs.');
      } else if (modalId === 'mentorModal') {
        openGenericModal('mentor', 'Become an Executive Mentor', 'Guide an aspiring female leader through 9 months of transformative career mentorship.');
      } else if (modalId === 'partnerModal') {
        openGenericModal('partner', 'Partner With Our Alliance', 'Collaborate on institutional ESG, corporate philanthropy, or university research programs.');
      } else {
        openModal(modalId);
      }
    });
  });

  // Modal Close buttons & Backdrop Click
  document.querySelectorAll('.modal-backdrop').forEach((modal) => {
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Escape Key Close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach((modal) => {
        closeModal(modal);
      });
      toggleMobileMenu(false);
    }
  });
}

/* ==========================================================================
   12. DYNAMIC DONATION CALCULATOR & PRESETS
   ========================================================================== */
function initDonationCalculator() {
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmountInput');
  const freqBtns = document.querySelectorAll('.freq-btn');
  const feedbackMsg = document.getElementById('feedbackMessage');
  const submitLabel = document.getElementById('submitDonateLabel');

  let currentAmount = 50;
  let currentFreq = 'monthly';

  const impactRules = [
    { max: 35, msg: 'Provides essential textbooks, digital learning tools, and nutrition support for 2 young scholars.' },
    { max: 75, msg: 'Fully funds 1 woman’s vocational STEM certification and workstation hardware grant.' },
    { max: 150, msg: 'Disburses a zero-interest micro-enterprise seed grant to launch a local artisan collective.' },
    { max: 500, msg: 'Sponsors an entire community village savings syndicate starter fund powering 20+ households.' },
    { max: Infinity, msg: 'Catalyzes an entire regional tech innovation lab equipped with solar power and satellite web access.' }
  ];

  function updateFeedback() {
    const rule = impactRules.find((r) => currentAmount <= r.max);
    if (feedbackMsg && rule) {
      feedbackMsg.innerText = `Your $${currentAmount} ${currentFreq === 'monthly' ? 'monthly' : 'one-time'} contribution ${rule.msg}`;
    }
    if (submitLabel) {
      submitLabel.innerText = `Donate $${currentAmount} ${currentFreq === 'monthly' ? 'Monthly' : 'Now'}`;
    }
  }

  amountBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      amountBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentAmount = parseInt(btn.getAttribute('data-val'), 10);
      if (customInput) customInput.value = currentAmount;
      updateFeedback();
    });
  });

  if (customInput) {
    customInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        currentAmount = val;
        amountBtns.forEach((b) => {
          if (parseInt(b.getAttribute('data-val'), 10) === val) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
        updateFeedback();
      }
    });
  }

  freqBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      freqBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFreq = btn.getAttribute('data-freq');
      updateFeedback();
    });
  });

  updateFeedback();
}

/* ==========================================================================
   13. FORM SUBMISSIONS & TOAST FEEDBACK
   ========================================================================== */
function showToast(title, message) {
  const toast = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastMsg = document.getElementById('toastMsg');

  if (!toast) return;

  if (toastTitle) toastTitle.innerText = title;
  if (toastMsg) toastMsg.innerText = message;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

function initFormsAndToasts() {
  // Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail')?.value;
      showToast('Welcome to the Dispatch', `Thank you! Impact briefings will be sent to ${email}.`);
      newsletterForm.reset();
    });
  }

  // Donor Checkout Form
  const donorForm = document.getElementById('donorCheckoutForm');
  if (donorForm) {
    donorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('donorFirstName')?.value;
      closeModal(document.getElementById('donateModal'));
      showToast('Heartfelt Gratitude', `Thank you, ${name}! Your tax-deductible gift has been successfully authorized.`);
      donorForm.reset();
    });
  }

  // Generic Action Form (Volunteer/Mentor/Partner)
  const actionForm = document.getElementById('genericActionForm');
  if (actionForm) {
    actionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('actionName')?.value;
      closeModal(document.getElementById('genericActionModal'));
      showToast('Application Received', `Thank you, ${name}! Our regional director will be in contact within 48 hours.`);
      actionForm.reset();
    });
  }
}

/* ==========================================================================
   14. SIGNATURE INBOX FORM (IMAGE 1 DESIGN)
   ========================================================================== */
function initImpactInboxForm() {
  const inboxForm = document.getElementById('impactInboxForm');
  if (!inboxForm) return;

  inboxForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('inboxFirstName')?.value || 'Friend';
    const email = document.getElementById('inboxEmail')?.value;
    showToast('Impact Added to Your Inbox!', `Welcome ${firstName}! Monthly stories and updates will be delivered to ${email}.`);
    inboxForm.reset();
  });
}

/* ==========================================================================
   15. SIGNATURE 3-CARD NEWS GRID INTERACTION (IMAGE 3 DESIGN)
   ========================================================================== */
function initNewsLikesAndModal() {
  // Interactive Likes
  document.querySelectorAll('.like-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const countSpan = this.querySelector('.like-count');
      const icon = this.querySelector('.meta-icon');
      let count = parseInt(this.getAttribute('data-count'), 10) || 0;
      let isLiked = this.getAttribute('data-liked') === 'true';

      if (isLiked) {
        count = Math.max(0, count - 1);
        this.setAttribute('data-liked', 'false');
        this.classList.remove('active');
        if (icon) {
          icon.setAttribute('fill', 'none');
          icon.setAttribute('stroke', '#888');
        }
      } else {
        count += 1;
        this.setAttribute('data-liked', 'true');
        this.classList.add('active');
        if (icon) {
          icon.setAttribute('fill', '#C95C78');
          icon.setAttribute('stroke', '#C95C78');
        }
      }

      this.setAttribute('data-count', count);
      if (countSpan) countSpan.textContent = count;
    });
  });

  // Read More Modal Links
  const newsArticles = {
    '1': {
      title: 'Follow Our Latest News & Grassroots Advocacy',
      tag: '✦ COMMUNITY EMPOWERMENT',
      body: 'At AURA for Women, we are committed to empowering women and girls through education, advocacy, community outreach, and practical support. Throughout 2026, we organise regional awareness seminars, legal clinics, and vocational workshops.'
    },
    '2': {
      title: 'Making a Difference Together in 2026',
      tag: '✦ COOPERATIVE SOLIDARITY',
      body: 'The first half of 2026 has seen over 2,400 new graduates across our artisan guilds and tech accelerators. Together with our local partners, we have established four new child-care cooperatives and micro-grant circles.'
    },
    '3': {
      title: 'Women’s Rights and Menstrual Health Workshops',
      tag: '✦ HEALTH & DIGNITY',
      body: 'AURAforWomen and MINA Foundation are very happy to announce the collaborative project to support young female students in Dar-es-Salaam this week. Providing organic sanitary products, reproductive education, and dignity kits to over 1,200 girls.'
    }
  };

  document.querySelectorAll('.news-readmore-link').forEach((link) => {
    link.addEventListener('click', function () {
      const newsId = this.getAttribute('data-news');
      const article = newsArticles[newsId];
      if (article) {
        const modal = document.getElementById('genericActionModal');
        const modalTag = document.getElementById('genericModalTag');
        const modalTitle = document.getElementById('genericModalTitle');
        const modalSubtitle = document.getElementById('genericModalSubtitle');
        
        if (modal && modalTitle) {
          if (modalTag) modalTag.textContent = article.tag;
          modalTitle.textContent = article.title;
          if (modalSubtitle) modalSubtitle.textContent = article.body;
          openModal(modal);
        }
      }
    });
  });
}

