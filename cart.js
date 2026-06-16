window.Cart = window.Cart || {
  get() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  },

  save(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  add(item) {
    let cart = this.get();

    const existing = cart.find(i =>
      i.id === item.id && i.variant === item.variant
    );

    if (existing) {
      existing.qty += item.qty || 1;
    } else {
      cart.push({ ...item, qty: item.qty || 1 });
    }

    this.save(cart);
    this.updateUI();
  },

  remove(id, variant = "") {
    let cart = this.get().filter(i =>
      !(i.id === id && i.variant === variant)
    );

    this.save(cart);
    this.updateUI();
  },

  updateQty(id, qty, variant = "") {
    let cart = this.get();

    const item = cart.find(i =>
      i.id === id && i.variant === variant
    );

    if (item) item.qty = qty;

    this.save(cart);
    this.updateUI();
  },

  total() {
    return this.get().reduce((sum, item) =>
      sum + item.price * item.qty, 0
    );
  },

  count() {
    return this.get().reduce((sum, item) =>
      sum + item.qty, 0
    );
  },

  updateUI() {
    const el = document.getElementById("cart-count");
    if (el) el.textContent = this.count();
  }
};