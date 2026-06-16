/* ============================================
   VOLTEX ELECTRONICS — MAIN JAVASCRIPT
   Handles: Cart, Toast, Nav, UI interactions
   ============================================ */

// ─── STATE ───────────────────────────────────
const state = {
  cart: JSON.parse(localStorage.getItem('voltex_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('voltex_wishlist') || '[]'),
  user: JSON.parse(localStorage.getItem('voltex_user') || 'null'),
};

// ─── CART ─────────────────────────────────────
const Cart = {
  save() {
    localStorage.setItem('voltex_cart', JSON.stringify(state.cart));
    Cart.updateBadge();
    Cart.render();
  },
  add(product) {
    const existing = state.cart.find(i => i.id === product.id && i.variant === product.variant);
    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      state.cart.push({ ...product, qty: product.qty || 1 });
    }
    Cart.save();
    Toast.show(`${product.name} added to cart`, 'success');
    Cart.open();
  },
  remove(id, variant) {
    state.cart = state.cart.filter(i => !(i.id === id && i.variant === variant));
    Cart.save();
  },
  updateQty(id, variant, qty) {
    const item = state.cart.find(i => i.id === id && i.variant === variant);
    if (item) {
      item.qty = Math.max(1, qty);
      Cart.save();
    }
  },
  getSubtotal() {
    return state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  },
  getCount() {
    return state.cart.reduce((sum, i) => sum + i.qty, 0);
  },
  updateBadge() {
    const count = Cart.getCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },
  open() {
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  },
  close() {
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  },
  render() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    if (state.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:48px 20px;color:var(--slate)">
          <div style="font-size:3rem;margin-bottom:16px">🛒</div>
          <div style="font-weight:600;font-family:var(--font-display);color:var(--white);margin-bottom:8px">Your cart is empty</div>
          <div style="font-size:0.85rem">Add some gadgets to get started</div>
        </div>`;
    } else {
      container.innerHTML = state.cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-img">${item.emoji || '📦'}</div>
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-variant">${item.variant || ''}</div>
            <div class="cart-item-row">
              <div class="qty-control" style="height:30px">
                <button class="qty-btn" style="width:30px;height:30px;font-size:0.9rem" onclick="Cart.updateQty('${item.id}','${item.variant}',${ item.qty - 1 })">−</button>
                <input class="qty-input" style="width:36px;height:30px;font-size:0.82rem" value="${item.qty}" onchange="Cart.updateQty('${item.id}','${item.variant}',parseInt(this.value))">
                <button class="qty-btn" style="width:30px;height:30px;font-size:0.9rem" onclick="Cart.updateQty('${item.id}','${item.variant}',${item.qty + 1})">+</button>
              </div>
              <div class="cart-item-price">KES ${(item.price * item.qty).toLocaleString()}</div>
            </div>
            <div class="cart-item-remove" onclick="Cart.remove('${item.id}','${item.variant}')">✕ Remove</div>
          </div>
        </div>`).join('');
    }
    // Update totals
    const sub = Cart.getSubtotal();
    const shipping = sub > 5000 ? 0 : 250;
    const total = sub + shipping;
    const subEl = document.getElementById('cartSubtotal');
    const shipEl = document.getElementById('cartShipping');
    const totalEl = document.getElementById('cartTotal');
    if (subEl) subEl.textContent = `KES ${sub.toLocaleString()}`;
    if (shipEl) shipEl.textContent = shipping === 0 ? 'FREE' : `KES ${shipping}`;
    if (totalEl) totalEl.textContent = `KES ${total.toLocaleString()}`;
  }
};

// ─── TOAST ─────────────────────────────────────
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
      <span style="color:${type === 'error' ? 'var(--danger)' : type === 'info' ? 'var(--blue-light)' : 'var(--success)'};font-weight:700;font-size:1rem">${icons[type] || '✓'}</span>
      <span style="font-size:0.87rem;color:var(--white)">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all .3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// ─── WISHLIST ──────────────────────────────────
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
    localStorage.setItem('voltex_wishlist', JSON.stringify(state.wishlist));
  },
  has(id) {
    return state.wishlist.some(i => i.id === id);
  }
};

// ─── MOBILE NAV ────────────────────────────────
function toggleMobileNav() {
  document.getElementById('mobileNav')?.classList.toggle('open');
  document.body.style.overflow = document.getElementById('mobileNav')?.classList.contains('open') ? 'hidden' : '';
}

// ─── SEARCH ────────────────────────────────────
function handleSearch(e) {
  if (e.key === 'Enter') {
    const q = e.target.value.trim();
    if (q) window.location.href = `pages/shop.html?q=${encodeURIComponent(q)}`;
  }
}

// ─── TABS ──────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');
  document.getElementById(tabId)?.classList.add('active');
}

// ─── QTY CONTROL ──────────────────────────────
function changeQty(delta) {
  const input = document.getElementById('mainQty');
  if (!input) return;
  const val = parseInt(input.value) + delta;
  input.value = Math.max(1, Math.min(99, val));
}

// ─── GALLERY ──────────────────────────────────
function switchGallery(thumb, emoji) {
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
  const main = document.getElementById('galleryMain');
  if (main) main.textContent = emoji;
}

// ─── PAYMENT OPTION ───────────────────────────
function selectPayment(method) {
  document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
  document.querySelector(`[data-payment="${method}"]`)?.classList.add('selected');
  document.getElementById('mpesaDetails')?.style && (document.getElementById('mpesaDetails').style.display = method === 'mpesa' ? 'block' : 'none');
  document.getElementById('paypalDetails')?.style && (document.getElementById('paypalDetails').style.display = method === 'paypal' ? 'block' : 'none');
}

// ─── COUPON ───────────────────────────────────
function applyCoupon() {
  const code = document.getElementById('couponInput')?.value?.trim().toUpperCase();
  const coupons = { 'VOLTEX10': 10, 'GADGET20': 20, 'NEWUSER': 15 };
  if (coupons[code]) {
    Toast.show(`Coupon applied! ${coupons[code]}% off 🎉`, 'success');
  } else {
    Toast.show('Invalid coupon code', 'error');
  }
}

// ─── NEWSLETTER ───────────────────────────────
function subscribeNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail')?.value;
  if (email) {
    Toast.show('Subscribed! Welcome to Voltex 🚀', 'success');
    document.getElementById('newsletterEmail').value = '';
  }
}

// ─── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  Cart.render();

  // Cart drawer events
  document.getElementById('cartOverlay')?.addEventListener('click', Cart.close);
  document.getElementById('openCartBtn')?.addEventListener('click', Cart.open);

  // Search
  document.querySelectorAll('.nav-search input').forEach(el => {
    el.addEventListener('keydown', handleSearch);
  });

  // Sticky nav shadow
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 4px 32px rgba(0,0,0,0.4)' : 'none';
  });

  // Animate elements on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.product-card, .category-card, .testimonial-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .4s ease, transform .4s ease';
    observer.observe(el);
  });
});