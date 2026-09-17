/* ================================================================
   NEXGROW CORE ENGINE
   - Header Blur Dynamics & Shrink on Scroll
   - Mobile Navigation Drawer
   - Staggered Intersection Observer Scroll Reveal
   - Smooth Anchor Navigation
   ================================================================ */

// 1. Header scroll effect
function initHeaderShrink() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 2. Mobile burger navigation drawer
function initBurger() {
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('nav.links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const icon = burger.querySelector('i');
    const isOpen = navLinks.classList.contains('mobile-active');

    if (isOpen) {
      navLinks.classList.remove('mobile-active');
      navLinks.style.display = '';
      if (icon) icon.className = 'fa-solid fa-bars';
    } else {
      navLinks.classList.add('mobile-active');
      navLinks.style.display = 'flex';
      navLinks.style.position = 'absolute';
      navLinks.style.top = 'calc(100% + 12px)';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.width = '100%';
      navLinks.style.flexDirection = 'column';
      navLinks.style.gap = '6px';
      navLinks.style.background = 'rgba(9, 15, 11, 0.88)';
      navLinks.style.backdropFilter = 'blur(24px) saturate(180%)';
      navLinks.style.webkitBackdropFilter = 'blur(24px) saturate(180%)';
      navLinks.style.padding = '18px 16px';
      navLinks.style.borderRadius = '24px';
      navLinks.style.border = '1px solid rgba(255, 255, 255, 0.12)';
      navLinks.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 20px rgba(242, 199, 92, 0.1)';
      navLinks.style.zIndex = '99';

      Array.from(navLinks.children).forEach(a => {
        a.style.padding = '12px 16px';
        a.style.fontSize = '1.02rem';
        a.style.borderRadius = '14px';
        a.style.borderBottom = 'none';
        a.style.transition = 'background 0.2s ease, color 0.2s ease';
        a.addEventListener('click', () => {
          navLinks.classList.remove('mobile-active');
          navLinks.style.display = '';
          if (icon) icon.className = 'fa-solid fa-bars';
        });
      });

      if (icon) icon.className = 'fa-solid fa-xmark';
    }
  });
}

// 3. Staggered scroll reveal observer
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => io.observe(el));
}

// 4. Smooth Anchor Link Scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// 5. Hero Green Dot Waves & Particle Mesh (Strictly Scoped ONLY to Hero Section)
function initHeroDots() {
  const canvas = document.getElementById('heroDotsCanvas');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animId = null;
  let isVisible = true;
  let time = 0;

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouse.tx = nx * 50;
    mouse.ty = ny * 35;
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.parentElement.offsetHeight || window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Floating ambient spark dots
  const sparksCount = 35;
  const sparks = [];
  for (let i = 0; i < sparksCount; i++) {
    sparks.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.5,
      r: 0.8 + Math.random() * 1.6,
      baseAlpha: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2
    });
  }

  // 3D Perspective Wave Grid configuration (matching official brand banner)
  const cols = 52;
  const rows = 36;
  const spacingZ = 16;

  function render() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, width, height);

    // Smooth mouse interpolation
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    time += 0.016;

    const centerX = width * 0.5 + mouse.x;
    const centerY = height * 0.52 + mouse.y;
    const fov = 340;

    for (let iz = 0; iz < rows; iz++) {
      const z = iz * spacingZ + 60;
      const scale = fov / (fov + z);
      const zProgress = iz / rows; // 0 (front) to 1 (back)

      for (let ix = 0; ix < cols; ix++) {
        const normX = (ix - cols * 0.5) / (cols * 0.5); // -1 (left) to 1 (right)
        const x3d = normX * (width * 0.72);

        // Undulating wave ripples + lateral wing rise (wings rise on left & right as in reference image)
        const wave1 = Math.sin(normX * 3.2 + time * 1.1 + iz * 0.12) * 42;
        const wave2 = Math.cos(normX * 5.4 - time * 0.8 + iz * 0.18) * 26;
        const wave3 = Math.sin(time * 0.6 + normX * 1.8) * 20;

        const wingRise = Math.pow(Math.abs(normX), 2.2) * 110;
        const y3d = wave1 + wave2 + wave3 - wingRise + (iz * 2.8) - 15;

        // Projected 2D screen coordinates
        const px = centerX + x3d * scale;
        const py = centerY + y3d * scale;

        // Soft center clearance so central logo & title stay prominent with high contrast
        const distFromCenter = Math.hypot(px - width * 0.5, py - height * 0.45);
        const centerMask = Math.min(Math.max((distFromCenter - 140) / 220, 0.12), 1.0);

        const crestFactor = (wave1 + wave2 + 68) / 136;
        const alpha = (0.2 + crestFactor * 0.55) * (1 - zProgress * 0.75) * centerMask;

        if (alpha > 0.03 && px >= -10 && px <= width + 10 && py >= -10 && py <= height + 10) {
          const r = Math.max((1.0 + (1 - zProgress) * 1.6 + crestFactor * 0.6), 0.6);

          if (crestFactor > 0.7) {
            ctx.fillStyle = `rgba(124, 255, 178, ${Math.min(alpha * 1.2, 0.95)})`;
          } else if (crestFactor > 0.4) {
            ctx.fillStyle = `rgba(0, 255, 119, ${Math.min(alpha, 0.85)})`;
          } else {
            ctx.fillStyle = `rgba(34, 197, 94, ${Math.min(alpha * 0.8, 0.65)})`;
          }

          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Floating ambient spark dots
    for (let i = 0; i < sparks.length; i++) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.phase += 0.03;

      if (s.y < -10) {
        s.y = height + 10;
        s.x = Math.random() * width;
      }
      if (s.x < -10) s.x = width + 10;
      if (s.x > width + 10) s.x = -10;

      const flickerAlpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.phase));
      ctx.fillStyle = `rgba(0, 255, 119, ${flickerAlpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    animId = requestAnimationFrame(render);
  }

  // IntersectionObserver: automatically pauses rendering when hero scrolls out of view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        if (!animId) animId = requestAnimationFrame(render);
      } else {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    });
  }, { threshold: 0.05 });

  observer.observe(hero);

  animId = requestAnimationFrame(render);
}

function initShared() {
  initHeaderShrink();
  initBurger();
  initReveal();
  initSmoothScroll();
  initHeroDots();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShared);
} else {
  initShared();
}
