// ===== Wait for DOM =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== DOM Elements =====
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const scrollTopBtn = document.getElementById('scroll-top');

  // ===== Mobile Navigation =====
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  }

  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobileMenu);

  // Dropdown toggle on click (desktop & mobile)
  navMenu.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const parent = this.parentElement;
      // Close other dropdowns
      navMenu.querySelectorAll('.dropdown').forEach(d => {
        if (d !== parent) d.classList.remove('active');
      });
      parent.classList.toggle('active');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown')) {
      navMenu.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
    }
  });

  // Close mobile menu on non-dropdown link click
  navMenu.querySelectorAll('li:not(.dropdown) > a').forEach(link => {
    link.addEventListener('click', function () {
      if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // Close mobile menu on dropdown sub-link click
  navMenu.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', function () {
      navMenu.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
      if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // ===== Scroll To Top =====
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== Scroll Animations (Intersection Observer) =====
  const animElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animElements.forEach(el => animObserver.observe(el));

  // ===== Counter Animation =====
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    function update() {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString() + '+';
        return;
      }
      el.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // ===== Video Play =====
  const videoWrapper = document.getElementById('video-wrapper');

  if (videoWrapper) {
    videoWrapper.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
      iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;border-radius:12px;';
      iframe.allow = 'autoplay; encrypted-media';
      iframe.allowFullscreen = true;
      videoWrapper.innerHTML = '';
      videoWrapper.style.background = '#000';
      videoWrapper.appendChild(iframe);
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = this.getAttribute('href');
      if (target && target !== '#' && target.length > 1) {
        const element = document.querySelector(target);
        if (element) {
          e.preventDefault();
          const offset = document.querySelector('.navbar').offsetHeight || 60;
          const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });

  // ===== Active Nav Link on Scroll =====
  // Only apply scroll-based highlighting on the home page (index.html)
  const isHomePage = window.location.pathname.endsWith('index.html') || 
                     window.location.pathname.endsWith('/') ||
                     window.location.pathname === '';
  
  if (isHomePage) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = navMenu.querySelectorAll('li:not(.dropdown) > a, .dropdown > a');

    function highlightNav() {
      let current = '';
      const offset = 120;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - offset;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (current && href && href.length > 1 && href === `#${current}`) {
          link.classList.add('active');
        }
      });

      // If no section matched (at very top), activate Home
      if (!current || current === 'hero') {
        navLinks.forEach(link => link.classList.remove('active'));
        const homeLink = document.getElementById('nav-home');
        if (homeLink) homeLink.classList.add('active');
      }
    }

    window.addEventListener('scroll', highlightNav);
  }

  // ===== Navbar Shrink on Scroll =====
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.boxShadow = '0 6px 30px rgba(11, 122, 109, 0.4)';
    } else {
      navbar.style.boxShadow = '0 4px 20px rgba(11, 122, 109, 0.3)';
    }
  });

  // ===== Gallery Lightbox Effect =====
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      // Create lightbox
      const lightbox = document.createElement('div');
      lightbox.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(8px);
      `;

      const clone = document.createElement('img');
      clone.src = img.src;
      clone.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        transform: scale(0.8);
        transition: transform 0.3s ease;
      `;

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        color: white;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
      `;

      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(240,168,48,0.8)';
      });

      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255,255,255,0.15)';
      });

      lightbox.appendChild(clone);
      lightbox.appendChild(closeBtn);
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      // Animate in
      requestAnimationFrame(() => {
        lightbox.style.opacity = '1';
        clone.style.transform = 'scale(1)';
      });

      // Close on click
      function closeLightbox() {
        lightbox.style.opacity = '0';
        clone.style.transform = 'scale(0.8)';
        setTimeout(() => {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }, 300);
      }

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === closeBtn || closeBtn.contains(e.target)) {
          closeLightbox();
        }
      });

      // Close on Escape key
      function onKeyDown(e) {
        if (e.key === 'Escape') {
          closeLightbox();
          document.removeEventListener('keydown', onKeyDown);
        }
      }
      document.addEventListener('keydown', onKeyDown);
    });
  });

  // ===== Parallax-like Effect on Hero Stats =====
  const heroStats = document.querySelectorAll('.hero-stat');
  heroStats.forEach((stat, i) => {
    stat.style.transitionDelay = `${i * 0.1}s`;
  });

  // ===== Typing Effect for Hero Badge =====
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    heroBadge.style.opacity = '0';
    heroBadge.style.transform = 'translateY(10px)';
    setTimeout(() => {
      heroBadge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      heroBadge.style.opacity = '1';
      heroBadge.style.transform = 'translateY(0)';
    }, 300);
  }

  console.log('✅ Gyandeep Public School website loaded successfully!');
});