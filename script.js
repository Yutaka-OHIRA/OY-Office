let isReload = false;
try {
  const navEntries = performance.getEntriesByType('navigation');
  if (navEntries.length > 0 && navEntries[0].type === 'reload') {
    isReload = true;
  }
} catch (e) {
  if (window.performance && window.performance.navigation && window.performance.navigation.type === 1) {
    isReload = true;
  }
}

// 別ページ（製品詳細ページなど）で再読み込みされた場合、本ページ（index.html）に戻る処理
const isMainPage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/');
if (!isMainPage && isReload) {
  window.location.href = 'index.html';
}

if (isReload && window.location.hash) {
  window.history.replaceState(null, null, window.location.pathname + window.location.search);
}

const hasTargetHash = window.location.hash && window.location.hash !== '#hero' && !isReload;
if (hasTargetHash) {
  window.history.scrollRestoration = 'auto';
} else {
  window.history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
}

window.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const bottomImage = document.querySelector('.screenshot--bottom');
  const rightImage = document.querySelector('.screenshot--right');
  const menuToggle = document.getElementById('menuToggle');
  const topbarMenu = document.getElementById('topbarMenu');
  const toggleProducts = document.getElementById('toggleProducts');
  const productsSubmenu = document.getElementById('productsSubmenu');

  // 製作品一覧トグルの処理
  if (toggleProducts) {
    toggleProducts.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = toggleProducts.getAttribute('aria-expanded') === 'true';
      toggleProducts.setAttribute('aria-expanded', String(!isExpanded));
      toggleProducts.classList.toggle('active');
      
      if (!isExpanded) {
        // 商品一覧を表示
        productsSubmenu.style.display = 'block';
        // 商品リストを動的に生成（要素が存在する場合のみ）
        const productItems = document.querySelectorAll('.product-item');
        if (productItems.length > 0) {
          productsSubmenu.innerHTML = '';
          productItems.forEach((item) => {
            const productName = item.querySelector('.product-name').textContent;
            const link = document.createElement('a');
            link.href = item.getAttribute('href');
            link.textContent = productName;
            productsSubmenu.appendChild(link);
          });
        }

        // サブメニュー内のすべてのリンクにメニューを閉じる処理を追加
        const submenuLinks = productsSubmenu.querySelectorAll('a');
        submenuLinks.forEach((link) => {
          link.addEventListener('click', () => {
            topbarMenu.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
            topbarMenu.setAttribute('aria-hidden', 'true');
          });
        });
      } else {
        // 商品一覧を非表示
        productsSubmenu.style.display = 'none';
      }
    });
  }

  // ペン型芯ケース画像をクリックしてもメニューが開くようにする
  const productItems = document.querySelectorAll('.product-item');
  productItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      // 通常のリンク動作を許可（新ページへのナビゲーション）
    });
  });

  // hrefが"#"のリンク（新作のプレースホルダーなど）をクリックしたときにページ遷移やスクロールを無効化する
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href') === '#') {
      e.preventDefault();
    }
  });

  if (menuToggle && topbarMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = topbarMenu.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      topbarMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    // スクロール時にメニューを閉じる
    window.addEventListener('scroll', () => {
      if (topbarMenu.classList.contains('show')) {
        topbarMenu.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
        topbarMenu.setAttribute('aria-hidden', 'true');
      }
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

  // Intersection Observer for scroll animation
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
    scrollObserver.observe(el);
  });

  if (hasTargetHash) {
    body.classList.remove('no-scroll');
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'auto' });
      }, 0);
    }
    return;
  }

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
