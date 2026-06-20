// Shared data store for the نخل restaurant app.
// Backed by localStorage so the menu, customer and admin panels all stay in sync.
import { MENU } from './menu-data.js';

const KEY = 'nakhl_store_v3';

function seed() {
  const items = [];
  MENU.forEach((sec, si) => {
    sec.categories.forEach((cat, ci) => {
      cat.items.forEach((it, ii) => {
        items.push({
          id: 's' + si + 'c' + ci + 'i' + ii,
          sectionId: sec.id,
          sectionLabel: sec.label,
          category: cat.name,
          icon: cat.icon,
          name: it.name,
          desc: it.desc || '',
          price: it.price == null ? null : it.price,
          discount: 0,            // percent 0-100
          photo: '',              // dataURL set by admin
          orders: 0,              // total orders -> drives پرطرفدارها
          available: true,
        });
      });
    });
  });
  return {
    items,
    comments: [],   // {id,itemId,name,text,rating,status:'pending'|'approved',reply,date}
    nextCommentId: 1,
    reservations: [],
    cart: [],        // {itemId, qty}
    orders: [],      // {id, date, items:[{itemId,name,qty,unit}], total, status}
    nextOrderId: 1,
    seededFavorites: false,
  };
}

function migrate(s) {
  if (!Array.isArray(s.cart)) s.cart = [];
  if (!Array.isArray(s.orders)) s.orders = [];
  if (typeof s.nextOrderId !== 'number') s.nextOrderId = (s.orders.length || 0) + 1;
  return s;
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch (e) {}
  const s = seed();
  // give a few items realistic starting order counts + comments so the
  // app feels alive on first load (only on very first seed)
  primeDemo(s);
  write(s);
  return s;
}

function primeDemo(s) {
  const findExact = (n) => s.items.find(it => it.name === n);
  const seedOrders = [['برگر مخصوص نخل', 320], ['چیکن سزار سوخاری', 286], ['میگو سوخاری', 240], ['اکبر جوجه', 190], ['قارچ سوخاری', 95]];
  seedOrders.forEach(([n, c]) => { const it = findExact(n); if (it) it.orders = c; });
  const demoComments = [
    { item: 'برگر مخصوص نخل', name: 'سارا محمدی', text: 'بهترین برگری که تا حالا خوردم! بیکن و پنیر گودا ترکیب بی‌نظیری ساخته بودن.', rating: 5 },
    { item: 'برگر مخصوص نخل', name: 'امیر رضایی', text: 'گوشتش واقعاً آب‌دار و تازه بود، نون هم عالی. حتماً دوباره میام.', rating: 4 },
    { item: 'چیکن سزار سوخاری', name: 'نگار کریمی', text: 'مرغ سوخاری‌اش ترد و خوش‌طعم بود و سس سزار اندازه بود. پیشنهاد می‌کنم.', rating: 5 },
    { item: 'میگو سوخاری', name: 'پویا احمدی', text: 'میگوها تازه و درشت بودن، سس تارتار هم خانگی و خوشمزه. عالی!', rating: 5 },
  ];
  demoComments.forEach(c => {
    const it = findExact(c.item);
    if (it) s.comments.push({ id: s.nextCommentId++, itemId: it.id, name: c.name, text: c.text, rating: c.rating, status: 'approved', reply: '', date: 'اخیراً' });
  });
}

function write(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  notify();
}

const listeners = new Set();
function notify() { listeners.forEach(fn => { try { fn(); } catch (e) {} }); }

window.addEventListener('storage', (e) => { if (e.key === KEY) notify(); });

export const store = {
  get() { return read(); },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },

  // ---- items ----
  updateItem(id, patch) {
    const s = read();
    const it = s.items.find(x => x.id === id);
    if (it) Object.assign(it, patch);
    write(s);
  },
  addItem(data) {
    const s = read();
    // find an icon for the chosen category, fall back to a salad icon
    const sample = s.items.find(x => x.category === data.category);
    const id = 'new' + Date.now();
    s.items.push({
      id,
      sectionId: data.sectionId || (sample ? sample.sectionId : 'fastfood'),
      sectionLabel: data.sectionLabel || (sample ? sample.sectionLabel : ''),
      category: data.category || (sample ? sample.category : ''),
      icon: data.icon || (sample ? sample.icon : 'assets/icons/salad.png'),
      name: data.name || 'غذای جدید',
      desc: data.desc || '',
      price: data.price == null || data.price === '' ? null : Number(data.price),
      discount: 0, photo: data.photo || '', orders: 0, available: true,
    });
    write(s);
    return id;
  },
  removeItem(id) {
    const s = read();
    s.items = s.items.filter(x => x.id !== id);
    s.comments = s.comments.filter(c => c.itemId !== id);
    write(s);
  },
  order(id, qty) {
    const s = read();
    const it = s.items.find(x => x.id === id);
    if (it) it.orders += (qty || 1);
    write(s);
  },

  // ---- cart ----
  addToCart(id, qty) {
    const s = read();
    const line = s.cart.find(c => c.itemId === id);
    if (line) line.qty += (qty || 1);
    else s.cart.push({ itemId: id, qty: qty || 1 });
    write(s);
  },
  setCartQty(id, qty) {
    const s = read();
    const line = s.cart.find(c => c.itemId === id);
    if (line) {
      line.qty = qty;
      if (line.qty <= 0) s.cart = s.cart.filter(c => c.itemId !== id);
    }
    write(s);
  },
  removeFromCart(id) {
    const s = read();
    s.cart = s.cart.filter(c => c.itemId !== id);
    write(s);
  },
  clearCart() { const s = read(); s.cart = []; write(s); },

  // ---- orders ----
  placeOrder() {
    const s = read();
    if (!s.cart.length) return null;
    const lines = s.cart.map(c => {
      const it = s.items.find(x => x.id === c.itemId);
      const unit = it ? finalPrice(it) : null;
      if (it) it.orders += c.qty;   // feeds پرطرفدارها
      return { itemId: c.itemId, name: it ? it.name : 'غذا', icon: it ? it.icon : '', qty: c.qty, unit: unit };
    });
    const total = lines.reduce((a, l) => a + (l.unit || 0) * l.qty, 0);
    const now = new Date();
    const fa = (n) => String(n).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
    const order = {
      id: s.nextOrderId++,
      code: fa(1400000 + Math.floor(Math.random() * 99999)),
      date: now.toLocaleDateString('fa-IR'),
      time: now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      items: lines, total, status: 'در حال آماده‌سازی',
    };
    s.orders.push(order);
    s.cart = [];
    write(s);
    return order;
  },
  setOrderStatus(orderId, status) {
    const s = read();
    const o = s.orders.find(x => x.id === orderId);
    if (o) o.status = status;
    write(s);
  },

  // ---- comments ----
  addComment(itemId, name, text, rating) {
    const s = read();
    s.comments.push({ id: s.nextCommentId++, itemId, name: name || 'مهمان', text, rating: rating || 5, status: 'pending', reply: '', date: 'همین حالا' });
    write(s);
  },
  approveComment(id) { this._patchComment(id, { status: 'approved' }); },
  rejectComment(id) {
    const s = read();
    s.comments = s.comments.filter(c => c.id !== id);
    write(s);
  },
  replyComment(id, reply) { this._patchComment(id, { reply }); },
  _patchComment(id, patch) {
    const s = read();
    const c = s.comments.find(x => x.id === id);
    if (c) Object.assign(c, patch);
    write(s);
  },

  // ---- reservations ----
  addReservation(r) {
    const s = read();
    s.reservations.push(Object.assign({ id: Date.now(), date: r.date || '', status: 'pending' }, r));
    write(s);
  },

  reset() { localStorage.removeItem(KEY); notify(); },
};

// ---- selectors (pure helpers) ----
export function finalPrice(it) {
  if (it.price == null) return null;
  if (!it.discount) return it.price;
  return Math.round(it.price * (1 - it.discount / 100));
}
export function topFavorites(s, n) {
  return s.items
    .filter(it => it.orders > 0 && it.available)
    .sort((a, b) => b.orders - a.orders)
    .slice(0, n || 3);
}
export function approvedComments(s, itemId) {
  return s.comments.filter(c => c.itemId === itemId && c.status === 'approved');
}
export function pendingComments(s) {
  return s.comments.filter(c => c.status === 'pending');
}
export function cartCount(s) {
  return (s.cart || []).reduce((a, c) => a + c.qty, 0);
}
export function cartLines(s) {
  return (s.cart || []).map(c => {
    const it = s.items.find(x => x.id === c.itemId);
    return { itemId: c.itemId, qty: c.qty, item: it, unit: it ? finalPrice(it) : null };
  }).filter(l => l.item);
}
export function cartTotal(s) {
  return cartLines(s).reduce((a, l) => a + (l.unit || 0) * l.qty, 0);
}
