window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

window.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const bottomImage = document.querySelector('.screenshot--bottom');
  const rightImage = document.querySelector('.screenshot--right');
  const menuToggle = document.getElementById('menuToggle');
  const topbarMenu = document.getElementById('topbarMenu');

  if (menuToggle && topbarMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = topbarMenu.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      topbarMenu.setAttribute('aria-hidden', String(!isOpen));
    });
  }

  document.addEventListener('contextmenu', (event) => {
    if (event.target.tagName === 'IMG') {
      event.preventDefault();
    }
  });

  document.addEventListener('dragstart', (event) => {
    if (event.target.tagName === 'IMG') {
      event.preventDefault();
    }
  });

  if (!bottomImage || !rightImage) {
    body.classList.remove('no-scroll');
    return;
  }

  const bottomAnimationTime = 0.2 + 0.9 + 0.1; // delay + duration + buffer
  const rightAnimationTime = 1.0 + 0.9 + 0.1;
  const unlockTime = Math.max(bottomAnimationTime, rightAnimationTime);

  setTimeout(() => {
    body.classList.remove('no-scroll');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, unlockTime * 1000);
});
