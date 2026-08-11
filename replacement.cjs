const fs = require('fs');

let js = fs.readFileSync('src/main.js', 'utf8');

// Find the scroll reveal observer and fix it to:
// 1. Immediately reveal elements already in viewport on page load
// 2. Observer for rest

const oldRevealObs = `  // 3. Multi-directional Scroll Reveal + Stats Counter Animation
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Trigger counter animation for stat-number elements inside
          entry.target.querySelectorAll('.stat-number[data-count]').forEach(el => _animateCounter(el));
          // Also handle if this element IS a stat-number
          if (entry.target.matches('.stat-number[data-count]')) _animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // Also observe stat-numbers that might not be in reveal-on-scroll
  document.querySelectorAll('.stat-number[data-count]').forEach(el => revealObserver.observe(el));

  // Stats counter animation engine
  function _animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const elapsed = Math.min(now - start, duration);
      const progress = 1 - Math.pow(1 - elapsed / duration, 4); // ease-out-quart
      const value = Math.round(progress * target);
      el.textContent = (target === 0 ? '0' : value) + suffix;
      if (elapsed < duration) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }`;

const newRevealObs = `  // 3. Multi-directional Scroll Reveal + Stats Counter Animation
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  // Stats counter animation engine
  function _animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const elapsed = Math.min(now - start, duration);
      const progress = 1 - Math.pow(1 - elapsed / duration, 4);
      const value = Math.round(progress * target);
      el.textContent = (target === 0 ? '0' : value) + suffix;
      if (elapsed < duration) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  function _revealEl(el) {
    el.classList.add('revealed');
    el.querySelectorAll('.stat-number[data-count]').forEach(s => _animateCounter(s));
    if (el.matches && el.matches('.stat-number[data-count]')) _animateCounter(el);
  }

  // Use IntersectionObserver if available, fallback to showing all
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            _revealEl(entry.target);
            revealObserver.unobserve(entry.target); // Only reveal once
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
    document.querySelectorAll('.stat-number[data-count]').forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately if no IntersectionObserver support
    revealElements.forEach(el => _revealEl(el));
  }

  // Safety net: after 2.5s force-reveal anything still hidden (handles edge cases)
  setTimeout(function() {
    document.querySelectorAll('.reveal-on-scroll:not(.revealed)').forEach(el => _revealEl(el));
  }, 2500);`;

if (js.includes('// 3. Multi-directional Scroll Reveal')) {
  js = js.replace(oldRevealObs, newRevealObs);
  console.log('Scroll reveal observer upgraded with safety net OK');
} else {
  console.log('WARNING: pattern not found');
}

fs.writeFileSync('src/main.js', js, 'utf8');
console.log('Done. Size:', js.length);
