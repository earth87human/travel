/* ===================================================
   Hokkaido Journey · Interactions
=================================================== */

(function() {
  'use strict';

  // ============== LOADER ==============
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
          loader.style.display = 'none';
        }, 800);
      }, 1600);
    }
  });

  // ============== NAVIGATION SCROLL ==============
  const nav = document.getElementById('nav');
  const scrollProgress = document.getElementById('scrollProgress');

  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = scrollPercent + '%';
    }

    if (nav) {
      if (scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ============== MOBILE MENU ==============
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // ============== SMOOTH SCROLL ==============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============== REVEAL ON SCROLL ==============
  const revealElements = document.querySelectorAll(
    '.day-card, .highlight-card, .hotel-card, .note-card, .food-item, .timeline-item, .stat, .overview-text, .overview-stats, .route-map, .budget-summary, .budget-table, .map-card, .memory-card, .weather-tip, .weather-chart-wrap, .memory-finale, .day-route-svg'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ============== NUMBER COUNTER ==============
  const counters = document.querySelectorAll('[data-count]');
  let counterStarted = new WeakSet();

  function animateCount(el, target, duration = 1800) {
    const start = 0;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(start + (target - start) * easeOut);
      el.textContent = value.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counterStarted.has(entry.target)) {
          const target = parseInt(entry.target.dataset.count, 10);
          if (!isNaN(target)) {
            animateCount(entry.target, target);
            counterStarted.add(entry.target);
          }
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  } else {
    counters.forEach(c => {
      const target = parseInt(c.dataset.count, 10);
      if (!isNaN(target)) c.textContent = target.toLocaleString();
    });
  }

  // ============== HERO PARALLAX ==============
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBgImg.style.transform = `scale(1.08) translateY(${scrollY * 0.3}px)`;
      }
    }, { passive: true });
  }

  // ============== IMAGE LOAD ERROR HANDLING ==============
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      const parent = this.parentElement;
      if (parent) {
        parent.classList.add('no-img');
        this.style.display = 'none';
      }
    });

    if (img.complete && img.naturalHeight === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });

  // ============== DAY CARD INTERACTION ==============
  document.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const day = card.dataset.day;
      if (day) {
        card.setAttribute('data-active', 'true');
      }
    });
    card.addEventListener('mouseleave', () => {
      card.removeAttribute('data-active');
    });
  });

  // ============== KEYBOARD ACCESSIBILITY ==============
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
    }
  });

  // ============== CONSOLE GREETING ==============
  console.log('%cHokkaido Journey · 2026', 'font-family: serif; font-size: 24px; color: #c9a875; padding: 16px;');
  console.log('%c旭岳溫泉 × 支笏湖 · 六日五夜放空之旅', 'font-family: serif; font-size: 14px; color: #1a2332;');

})();
