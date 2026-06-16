/* ============================================
   VOLTEX ELECTRONICS — MAIN JAVASCRIPT (FIXED)
   Handles: UI, Toast, Wishlist, Nav, Cart Calls
   ============================================ */

/* ─── STATE ───────────────────────────────── */
const state = {
  cart: JSON.parse(localStorage.getItem('voltex_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('voltex_wishlist') || '[]'),
  user: JSON.parse(localStorage.getItem('voltex_user') || 'null'),
};

/* ─── CART (FIXED: uses window.Cart ONLY) ─── */
const CartUI = {
  save() {
    localStorage.setItem('voltex_cart', JSON.stringify(state.cart));
    window.Cart?.updateBadge?.();
    window.Cart?.render?.();
  },

  add(product) {
    const existing = state.cart.find(
      i => i.id === product.id && i.variant === product.variant
    );

    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      state.cart.push({ ...product, qty: product.qty || 1 });
    }

    this.save();
    Toast.show(`${product.name} added to cart`, 'success');
    window.Cart?.open?.();
  },

  remove(id, variant) {
    state.cart = state.cart.filter(
      i => !(i.id === id && i.variant === variant)
    );

    this.save();
  },

  updateQty(id, variant, qty) {
    const item = state.cart.find(
      i => i.id === id && i.variant === variant
    );

    if (item) {
      item.qty = Math.max(1, qty);
      this.save();
    }
  },

  getSubtotal() {
    return state.cart.reduce(
      (sum, i) => sum + (i.price * i.qty),
      0
    );
  },

  getCount() {
    return state.cart.reduce(
      (sum, i) => sum + i.qty,
      0
    );
  }
};

/* ─── TOAST ───────────────────────────────── */
const Toast = {
  show(message, type = 'success', duration = 3000) {
    let container = document.querySelector('.toast-container');

    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;

    const icons = { success: '✓', error: '✕', info: 'ℹ' };

    toast.innerHTML = `
      <span style="color:${
        type === 'error'
          ? 'var(--danger)'
          : type === 'info'
          ? 'var(--blue-light)'
          : 'var(--success)'
      };font-weight:700;font-size:1rem">
        ${icons[type] || '✓'}
      </span>
      <span style="font-size:0.87rem;color:var(--white)">
        ${message}
      </span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all .3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

/* ─── WISHLIST ───────────────────────────── */
const Wishlist = {
  toggle(product) {
    const idx = state.wishlist.findIndex(i => i.id === product.id);

    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      Toast.show(`${product.name} removed from wishlist`, 'info');
    } else {
      state.wishlist.push(product);
      Toast.show(`${product.name} added to wishlist ❤️`, 'success');
    }

    localStorage.setItem(
      'voltex_wishlist',
      JSON.stringify(state.wishlist)
    );
  },

  has(id) {
    return state.wishlist.some(i => i.id === id);
  }
};

/* ─── MOBILE NAV ─────────────────────────── */
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  nav?.classList.toggle('open');

  document.body.style.overflow =
    nav?.classList.contains('open') ? 'hidden' : '';
}

/* ─── SEARCH ─────────────────────────────── */
function handleSearch(e) {
  if (e.key === 'Enter') {
    const q = e.target.value.trim();
    if (q) {
      window.location.href =
        `pages/shop.html?q=${encodeURIComponent(q)}`;
    }
  }
}

/* ─── TABS ───────────────────────────────── */
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn')
    .forEach(b => b.classList.remove('active'));

  document.querySelectorAll('.tab-content')
    .forEach(c => c.classList.remove('active'));

  document.querySelector(`[data-tab="${tabId}"]`)
    ?.classList.add('active');

  document.getElementById(tabId)
    ?.classList.add('active');
}

/* ─── QTY CONTROL ────────────────────────── */
function changeQty(delta) {
  const input = document.getElementById('mainQty');
  if (!input) return;

  const val = parseInt(input.value) + delta;
  input.value = Math.max(1, Math.min(99, val));
}

/* ─── GALLERY ────────────────────────────── */
function switchGallery(thumb, emoji) {
  document.querySelectorAll('.gallery-thumb')
    .forEach(t => t.classList.remove('active'));

  thumb.classList.add('active');

  const main = document.getElementById('galleryMain');
  if (main) main.textContent = emoji;
}

/* ─── PAYMENT ────────────────────────────── */
function selectPayment(method) {
  document.querySelectorAll('.payment-option')
    .forEach(o => o.classList.remove('selected'));

  document.querySelector(
    `[data-payment="${method}"]`
  )?.classList.add('selected');

  const mpesa = document.getElementById('mpesaDetails');
  const paypal = document.getElementById('paypalDetails');

  if (mpesa) mpesa.style.display = method === 'mpesa' ? 'block' : 'none';
  if (paypal) paypal.style.display = method === 'paypal' ? 'block' : 'none';
}

/* ─── COUPON ─────────────────────────────── */
function applyCoupon() {
  const code = document
    .getElementById('couponInput')
    ?.value
    ?.trim()
    .toUpperCase();

  const coupons = {
    VOLTEX10: 10,
    GADGET20: 20,
    NEWUSER: 15
  };

  if (coupons[code]) {
    Toast.show(
      `Coupon applied! ${coupons[code]}% off 🎉`,
      'success'
    );
  } else {
    Toast.show('Invalid coupon code', 'error');
  }
}

/* ─── NEWSLETTER ─────────────────────────── */
function subscribeNewsletter(e) {
  e.preventDefault();

  const email = document.getElementById('newsletterEmail')?.value;

  if (email) {
    Toast.show('Subscribed! Welcome to Voltex 🚀', 'success');
    document.getElementById('newsletterEmail').value = '';
  }
}

/* ─── INIT ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Use ONLY window.Cart (no conflict)
  window.Cart?.updateBadge?.();
  window.Cart?.render?.();

  document.getElementById('cartOverlay')
    ?.addEventListener('click', window.Cart?.close);

  document.getElementById('openCartBtn')
    ?.addEventListener('click', window.Cart?.open);

  document.querySelectorAll('.nav-search input')
    .forEach(el => el.addEventListener('keydown', handleSearch));

  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) {
      nav.style.boxShadow =
        window.scrollY > 10
          ? '0 4px 32px rgba(0,0,0,0.4)'
          : 'none';
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.product-card, .category-card, .testimonial-card, .stat-card'
  ).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .4s ease, transform .4s ease';
    observer.observe(el);
  });
});