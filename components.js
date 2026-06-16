/* ============================================
   VOLTEX ELECTRONICS — COMPONENTS
   Injects shared HTML: navbar, cart, footer
   ============================================ */

function getNavPath(depth = 1) {
  return depth === 0 ? '' : '../'.repeat(depth);
}

function injectNavbar(depth = 1) {
  const base = getNavPath(depth);
  const html = `
  <!-- ANNOUNCEMENT BAR -->
  <div class="announcement-bar">
    <span>🚚 Free shipping on orders over <strong>KES 5,000</strong></span>
    <span>·</span>
    <span>📱 M-Pesa payments accepted</span>
    <span>·</span>
    <span>⚡ Same-day delivery in Nairobi</span>
  </div>

  <!-- NAVBAR -->
  <nav class="navbar">
    <div class="nav-inner">
      <a href="${base}index.html" class="nav-logo">
        <span class="bolt">⚡</span>Volt<span>ex</span>
      </a>
      <div class="nav-search">
        <span class="search-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </span>
        <input type="search" placeholder="Search laptops, phones, accessories..." onkeydown="handleSearch(event)">
      </div>
      <div class="nav-links">
        <a href="${base}index.html" class="nav-link">Home</a>
        <a href="${base}shop.html" class="nav-link">Shop</a>
        <a href="${base}shop.html?cat=deals" class="nav-link">Deals</a>
        <a href="${base}shop.html?cat=new" class="nav-link">New Arrivals</a>
      </div>
      <div class="nav-actions">
        <button class="nav-action-btn" title="Wishlist" onclick="window.location='${base}wishlist.html'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button class="nav-action-btn" id="openCartBtn" title="Cart" style="position:relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span class="nav-badge cart-count" style="display:none">0</span>
        </button>
        <a href="${base}account.html" class="nav-user-btn">
          <div class="nav-avatar">JD</div>
          <span>Account</span>
        </a>
        <button class="hamburger" onclick="toggleMobileNav()" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- MOBILE NAV -->
  <div class="mobile-nav" id="mobileNav">
    <div class="mobile-nav-header">
      <a href="${base}index.html" class="nav-logo"><span class="bolt">⚡</span>Volt<span>ex</span></a>
      <button class="cart-close-btn" onclick="toggleMobileNav()">✕</button>
    </div>
    <div class="mobile-nav-links">
      <a href="${base}index.html" class="mobile-nav-link">🏠 Home</a>
      <a href="${base}shop.html" class="mobile-nav-link">🛒 Shop All</a>
      <a href="${base}shop.html?cat=laptops" class="mobile-nav-link">💻 Laptops</a>
      <a href="${base}shop.html?cat=phones" class="mobile-nav-link">📱 Phones</a>
      <a href="${base}shop.html?cat=audio" class="mobile-nav-link">🎧 Audio</a>
      <a href="${base}shop.html?cat=gaming" class="mobile-nav-link">🎮 Gaming</a>
      <a href="${base}shop.html?cat=deals" class="mobile-nav-link">⚡ Deals</a>
      <a href="${base}account.html" class="mobile-nav-link">👤 My Account</a>
    </div>
    <div class="mobile-nav-footer">
      <div style="font-size:0.82rem;color:var(--slate)">📍 Nairobi, Kenya &nbsp;·&nbsp; 📞 +254 700 000 000</div>
    </div>
  </div>

  <!-- CART DRAWER -->
  <div class="cart-overlay" id="cartOverlay"></div>
  <div class="cart-drawer" id="cartDrawer">
    <div class="cart-header">
      <h3>🛒 Your Cart</h3>
      <button class="cart-close-btn" onclick="Cart.close()">✕</button>
    </div>
    <div class="cart-items" id="cartItems"></div>
    <div class="cart-footer">
      <div class="cart-coupon">
        <input type="text" id="couponInput" placeholder="Coupon code" style="border-radius:var(--radius-sm)">
        <button class="btn btn-secondary btn-sm" onclick="applyCoupon()">Apply</button>
      </div>
      <div class="cart-totals">
        <div class="cart-total-row"><span>Subtotal</span><span class="val" id="cartSubtotal">KES 0</span></div>
        <div class="cart-total-row"><span>Shipping</span><span class="val" id="cartShipping">KES 250</span></div>
        <div class="cart-total-row grand"><span>Total</span><span class="grand-val" id="cartTotal">KES 0</span></div>
      </div>
      <a href="${base}checkout.html" class="btn btn-primary btn-full btn-lg">Proceed to Checkout →</a>
      <button class="btn btn-ghost btn-full mt-8" onclick="Cart.close()">Continue Shopping</button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('afterbegin', html);
}

function injectFooter(depth = 1) {
  const base = getNavPath(depth);
  const html = `
  <!-- FEATURES BAR -->
  <div class="features-bar">
    <div class="features-inner">
      <div class="feature-item">
        <div class="feature-icon">🚚</div>
        <div class="feature-text">
          <div class="title">Free Delivery</div>
          <div class="desc">On orders over KES 5,000</div>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">🔒</div>
        <div class="feature-text">
          <div class="title">Secure Payments</div>
          <div class="desc">M-Pesa & PayPal accepted</div>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">↩️</div>
        <div class="feature-text">
          <div class="title">Easy Returns</div>
          <div class="desc">14-day return policy</div>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">🎧</div>
        <div class="feature-text">
          <div class="title">24/7 Support</div>
          <div class="desc">Chat, call or WhatsApp</div>
        </div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="${base}index.html" class="nav-logo"><span class="bolt">⚡</span>Volt<span>ex</span></a>
        <p class="footer-desc">Kenya's premier online electronics store. Quality gadgets, fast delivery, trusted service.</p>
        <div class="footer-socials">
          <a href="#" class="social-btn" title="Facebook">f</a>
          <a href="#" class="social-btn" title="Twitter">𝕏</a>
          <a href="#" class="social-btn" title="Instagram">ig</a>
          <a href="#" class="social-btn" title="WhatsApp">wa</a>
        </div>
      </div>
      <div>
        <div class="footer-col-title">Shop</div>
        <div class="footer-links">
          <a href="${base}shop.html?cat=laptops">Laptops & PCs</a>
          <a href="${base}shop.html?cat=phones">Smartphones</a>
          <a href="${base}shop.html?cat=audio">Audio & Headphones</a>
          <a href="${base}shop.html?cat=gaming">Gaming</a>
          <a href="${base}shop.html?cat=accessories">Accessories</a>
          <a href="${base}shop.html?cat=deals">Deals & Offers</a>
        </div>
      </div>
      <div>
        <div class="footer-col-title">Account</div>
        <div class="footer-links">
          <a href="${base}login.html">Sign In</a>
          <a href="${base}register.html">Create Account</a>
          <a href="${base}account.html">Order History</a>
          <a href="${base}account.html?tab=addresses">Saved Addresses</a>
          <a href="${base}wishlist.html">Wishlist</a>
        </div>
      </div>
      <div>
        <div class="footer-col-title">Help</div>
        <div class="footer-links">
          <a href="#">Shipping Info</a>
          <a href="#">Returns Policy</a>
          <a href="#">Track Order</a>
          <a href="#">FAQs</a>
          <a href="#">Contact Us</a>
        </div>
        <div style="margin-top:20px">
          <div class="footer-col-title">Contact</div>
          <div style="font-size:0.82rem;color:var(--slate-light);line-height:2">
            📍 Westlands, Nairobi<br>
            📞 +254 700 000 000<br>
            ✉️ hello@voltex.co.ke
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div>© 2025 Voltex Electronics. All rights reserved.</div>
      <div class="footer-bottom-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Cookie Policy</a>
      </div>
      <div class="payment-icons">
        <div class="payment-icon" style="color:var(--success)">M-PESA</div>
        <div class="payment-icon">PAYPAL</div>
        <div class="payment-icon">VISA</div>
      </div>
    </div>
  </footer>`;
  document.body.insertAdjacentHTML('beforeend', html);
}