/* ============================================
   VOLTEX CART SYSTEM (SINGLE SOURCE OF TRUTH)
   ============================================ */

(function () {
  if (window.Cart) return;

  window.Cart = {
    get() {
      return JSON.parse(localStorage.getItem("cart")) || [];
    },

    save(cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
      this.updateUI();
      window.dispatchEvent(new Event("cartUpdated"));
    },

    add(item) {
      let cart = this.get();

      const existing = cart.find(
        i => i.id === item.id && i.variant === item.variant
      );

      if (existing) {
        existing.qty += item.qty || 1;
      } else {
        cart.push({ ...item, qty: item.qty || 1 });
      }

      this.save(cart);
    },

    remove(id, variant = "") {
      const cart = this.get().filter(
        i => !(i.id === id && i.variant === variant)
      );

      this.save(cart);
    },

    updateQty(id, qty, variant = "") {
      const cart = this.get();

      const item = cart.find(
        i => i.id === id && i.variant === variant
      );

      if (item) item.qty = Math.max(1, qty);

      this.save(cart);
    },

    total() {
      return this.get().reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );
    },

    count() {
      return this.get().reduce(
        (sum, item) => sum + item.qty,
        0
      );
    },

    updateUI() {
      const el = document.getElementById("cart-count");
      if (el) el.textContent = this.count();
    },

    open() {
      document.getElementById("cartDrawer")?.classList.add("open");
      document.getElementById("cartOverlay")?.classList.add("open");
      document.body.style.overflow = "hidden";
    },

    close() {
      document.getElementById("cartDrawer")?.classList.remove("open");
      document.getElementById("cartOverlay")?.classList.remove("open");
      document.body.style.overflow = "";
    },

    render() {
      const container = document.getElementById("cartItems");
      if (!container) return;

      const cart = this.get();

      if (cart.length === 0) {
        container.innerHTML = `
          <div style="text-align:center;padding:48px 20px;color:var(--slate)">
            <div style="font-size:3rem;margin-bottom:16px">🛒</div>
            <div style="font-weight:600;color:var(--white)">Your cart is empty</div>
          </div>`;
        return;
      }

      container.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-img">${item.emoji || '📦'}</div>

          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-variant">${item.variant || ''}</div>

            <div class="cart-item-row">
              <div class="qty-control">
                <button onclick="Cart.updateQty('${item.id}', ${item.qty - 1}, '${item.variant}')">−</button>
                <input value="${item.qty}" onchange="Cart.updateQty('${item.id}', parseInt(this.value), '${item.variant}')">
                <button onclick="Cart.updateQty('${item.id}', ${item.qty + 1}, '${item.variant}')">+</button>
              </div>

              <div class="cart-item-price">
                KES ${(item.price * item.qty).toLocaleString()}
              </div>
            </div>

            <div onclick="Cart.remove('${item.id}', '${item.variant}')">
              Remove
            </div>
          </div>
        </div>
      `).join('');
    }
  };
})();