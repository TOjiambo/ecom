/* ============================================
   VOLTEX MAIN JS (UI ONLY - NO CART STATE)
   ============================================ */

const Toast = {
  show(message, type = 'success') {
    let container = document.querySelector('.toast-container');

    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }
};

/* Wishlist */
const Wishlist = {
  toggle(product) {
    const key = 'voltex_wishlist';
    let list = JSON.parse(localStorage.getItem(key) || '[]');

    const exists = list.find(i => i.id === product.id);

    if (exists) {
      list = list.filter(i => i.id !== product.id);
      Toast.show('Removed from wishlist', 'info');
    } else {
      list.push(product);
      Toast.show('Added to wishlist ❤️', 'success');
    }

    localStorage.setItem(key, JSON.stringify(list));
  }
};

/* UI EVENTS ONLY */
document.addEventListener('DOMContentLoaded', () => {
  window.Cart?.updateUI?.();
  window.Cart?.render?.();

  window.addEventListener('cartUpdated', () => {
    window.Cart.render?.();
  });

  document.getElementById('openCartBtn')
    ?.addEventListener('click', () => window.Cart.open());

  document.getElementById('cartOverlay')
    ?.addEventListener('click', () => window.Cart.close());
});