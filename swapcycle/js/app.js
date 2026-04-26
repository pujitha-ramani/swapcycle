/**
 * SwapCycle — App Logic
 * Frontend-only SPA with in-memory state management
 */

// ========== DATA CONSTANTS ==========
const CATS = {
  plastic: '🧴', metal: '🔩', paper: '📄', glass: '🍶',
  ewaste: '💻', organic: '🌿', textile: '👕', other: '📦'
};

const LOCS = [
  'Kakinada, AP', 'Rajahmundry, AP', 'Vizag, AP',
  'Hyderabad, TS', 'Chennai, TN', 'Pune, MH', 'Bengaluru, KA'
];

const TITLES = {
  plastic:  ['PET bottles (bulk)', 'HDPE containers', 'Mixed plastic waste', 'PP packaging scraps', 'PVC pipes offcuts'],
  metal:    ['Aluminium cans', 'Steel scrap sheets', 'Copper wiring scraps', 'Iron rods bundle', 'Brass fittings lot'],
  paper:    ['Cardboard boxes', 'Office paper waste', 'Newspaper bundle', 'Kraft paper rolls', 'Corrugated sheets'],
  glass:    ['Glass bottles (mixed)', 'Window glass pieces', 'Glass jars lot', 'Broken tempered glass'],
  ewaste:   ['Old laptops x4', 'Circuit boards', 'Mixed cables & wires', 'CRT monitors', 'Broken smartphones'],
  organic:  ['Food waste — fruit peels', 'Garden clippings', 'Wood shavings', 'Coconut shells', 'Rice husk'],
  textile:  ['Denim offcuts', 'Cotton rags bundle', 'Used clothing lot', 'Canvas fabric scraps'],
  other:    ['Rubber tyres x6', 'Mixed packaging', 'Foam scraps', 'Construction debris']
};

const QTY_OPTIONS = ['2 kg', '5 kg', '10 kg', '20 kg', '50 kg', '100+ kg', '5 units', '10 units', 'Bulk lot'];
const STATUSES    = ['available', 'available', 'available', 'claimed', 'collected'];

// ========== APP STATE ==========
let items       = [];
let nextId      = 1;
let activeFilter = 'all';
let catFilter   = null;
let selectedCat = '';

// ========== HELPERS ==========
function randArr(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

// ========== SEED DATA ==========
function seedItems() {
  const cats = Object.keys(CATS);
  for (let i = 0; i < 12; i++) {
    const cat    = randArr(cats);
    const status = randArr(STATUSES);
    const d      = new Date();
    d.setDate(d.getDate() - randInt(0, 14));
    items.push({
      id:    nextId++,
      cat,
      title: randArr(TITLES[cat]),
      qty:   randArr(QTY_OPTIONS),
      cond:  randArr(['Clean & sorted', 'Mixed / unsorted', 'Compressed / baled']),
      loc:   randArr(LOCS),
      status,
      notes: 'Ready for pickup. Contact for scheduling.',
      date:  d.toLocaleDateString('en-IN'),
      mine:  i < 4
    });
  }
}

// ========== RENDER ITEM CARD ==========
function renderItem(it, showActions = true) {
  const badgeCls = { available: 'badge-available', claimed: 'badge-claimed', collected: 'badge-collected' };
  const claimLabel = it.status === 'available' ? '🤝 Claim' : 'Claimed';
  return `
    <div class="item-card" onclick="openDetail(${it.id})">
      <div class="item-thumb">${CATS[it.cat] || '📦'}</div>
      <div class="item-body">
        <div class="item-type-row">
          <span class="item-type">${it.cat}</span>
          <span class="badge ${badgeCls[it.status]}">
            <span class="badge-dot"></span>${it.status}
          </span>
        </div>
        <div class="item-title">${it.title}</div>
        <div class="item-meta">
          <div class="item-meta-row">📦 ${it.qty}</div>
          <div class="item-meta-row">📍 ${it.loc}</div>
          <div class="item-meta-row">🗓 ${it.date}</div>
        </div>
        ${showActions ? `
        <div class="item-actions" onclick="event.stopPropagation()">
          <button class="claim-btn" ${it.status !== 'available' ? 'disabled' : ''} onclick="triggerClaim(${it.id})">${claimLabel}</button>
          <button class="detail-btn" onclick="openDetail(${it.id})">Details</button>
        </div>` : ''}
      </div>
    </div>`;
}

// ========== MARKETPLACE ==========
function renderMarket() {
  const q = (document.getElementById('search-input').value || '').toLowerCase();
  const filtered = items.filter(it => {
    const matchStatus = activeFilter === 'all' || it.status === activeFilter;
    const matchCat    = !catFilter || it.cat === catFilter;
    const matchQ      = !q || it.title.toLowerCase().includes(q) || it.cat.includes(q) || it.loc.toLowerCase().includes(q);
    return matchStatus && matchCat && matchQ;
  });
  const grid = document.getElementById('items-grid');
  grid.innerHTML = filtered.length === 0
    ? `<div class="empty" style="grid-column:1/-1">
         <div class="empty-icon">🔍</div>
         <h3>No items found</h3>
         <p>Try adjusting your filters or search terms</p>
       </div>`
    : filtered.map(it => renderItem(it)).join('');
}

function filterItems() { renderMarket(); }

function setFilter(el, f) {
  activeFilter = f;
  catFilter    = null;
  document.querySelectorAll('#market-filters .filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderMarket();
}

function setCatFilter(el, cat) {
  catFilter    = catFilter === cat ? null : cat;
  activeFilter = 'all';
  document.querySelectorAll('#market-filters .filter-btn').forEach(b => b.classList.remove('active'));
  if (catFilter) {
    el.classList.add('active');
  } else {
    document.querySelector('#market-filters .filter-btn').classList.add('active');
  }
  renderMarket();
}

// ========== ITEM DETAIL ==========
function openDetail(id) {
  const it = items.find(i => i.id === id);
  if (!it) return;
  const badgeCls = { available: 'badge-available', claimed: 'badge-claimed', collected: 'badge-collected' };

  document.getElementById('detail-content').innerHTML = `
    <div>
      <div class="detail-thumb">${CATS[it.cat] || '📦'}</div>
      <div style="font-family:var(--font-head);font-size:1.5rem;font-weight:600;margin-bottom:10px">${it.title}</div>
      <span class="badge ${badgeCls[it.status]}" style="display:inline-flex;margin-bottom:16px">
        <span class="badge-dot"></span>${it.status}
      </span>
      <p style="font-size:14px;color:var(--neutral-500);margin-top:12px;line-height:1.7">${it.notes || 'No additional notes.'}</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:16px">
        <span class="tag">${it.cat}</span>
        <span class="tag">${it.cond}</span>
      </div>
    </div>
    <div class="detail-sidebar">
      <div style="font-family:var(--font-head);font-weight:600;margin-bottom:14px;color:var(--neutral-800)">Item details</div>
      <div class="info-row"><span class="info-key">Category</span><span class="info-val">${it.cat}</span></div>
      <div class="info-row"><span class="info-key">Quantity</span><span class="info-val">${it.qty}</span></div>
      <div class="info-row"><span class="info-key">Condition</span><span class="info-val">${it.cond}</span></div>
      <div class="info-row"><span class="info-key">Location</span><span class="info-val">📍 ${it.loc}</span></div>
      <div class="info-row"><span class="info-key">Posted</span><span class="info-val">${it.date}</span></div>
      <div class="info-row"><span class="info-key">Status</span>
        <span class="info-val"><span class="badge ${badgeCls[it.status]}">${it.status}</span></span>
      </div>
      <div style="margin-top:20px;display:flex;flex-direction:column;gap:10px">
        <button class="claim-btn" style="padding:13px"
          ${it.status !== 'available' ? 'disabled' : ''}
          onclick="triggerClaim(${it.id})">
          ${it.status === 'available' ? '🤝 Claim this item' : 'Already ' + it.status}
        </button>
        ${it.status === 'claimed' ? `
        <button class="btn-green" style="width:100%;padding:12px;border-radius:var(--radius-sm)" onclick="markCollected(${it.id})">
          ✅ Mark as Collected
        </button>` : ''}
      </div>
      <div style="margin-top:20px;padding:14px;background:var(--sage-50);border-radius:var(--radius-md);font-size:13px;color:var(--neutral-600);text-align:center">
        📧 Contact poster via SwapCycle after claiming
      </div>
    </div>`;

  showPage('detail');
}

// ========== CLAIM FLOW ==========
function triggerClaim(id) {
  const it = items.find(i => i.id === id);
  if (!it || it.status !== 'available') return;
  document.getElementById('modal-title').textContent = `Claim: ${it.title}?`;
  document.getElementById('modal-body').textContent  =
    `You're about to claim "${it.title}" (${it.qty}) from ${it.loc}. The poster will receive your contact info for scheduling pickup.`;
  document.getElementById('modal-confirm').onclick   = () => confirmClaim(id);
  document.getElementById('modal').style.display     = 'flex';
}

function confirmClaim(id) {
  const it = items.find(i => i.id === id);
  if (it) it.status = 'claimed';
  closeModal();
  renderMarket();
  renderDashboard();
  toast('✅ Item claimed! Contact the poster to arrange pickup.', 'success');
}

function markCollected(id) {
  const it = items.find(i => i.id === id);
  if (it) it.status = 'collected';
  renderMarket();
  renderDashboard();
  openDetail(id);
  toast('🎉 Item marked as collected! +50 EcoPoints earned.', 'success');
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

document.getElementById('modal').addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) closeModal();
});

// ========== POST ITEM ==========
function selectCat(el, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedCat = cat;
}

function submitPost() {
  const title = document.getElementById('post-title').value.trim();
  const qty   = document.getElementById('post-qty').value.trim();
  const loc   = document.getElementById('post-loc').value.trim();

  if (!selectedCat) { toast('Please select a waste category', ''); return; }
  if (!title)        { toast('Please enter an item title', ''); return; }
  if (!qty)          { toast('Please enter a quantity', ''); return; }
  if (!loc)          { toast('Please enter a pickup location', ''); return; }

  const cond  = document.getElementById('post-cond').value;
  const notes = document.getElementById('post-notes').value;
  const d     = new Date();

  items.unshift({
    id:     nextId++,
    cat:    selectedCat,
    title, qty, cond, loc,
    status: 'available',
    notes:  notes || 'Ready for pickup.',
    date:   d.toLocaleDateString('en-IN'),
    mine:   true
  });

  // Reset form
  document.getElementById('post-title').value  = '';
  document.getElementById('post-qty').value    = '';
  document.getElementById('post-loc').value    = '';
  document.getElementById('post-notes').value  = '';
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
  selectedCat = '';

  renderMarket();
  renderDashboard();
  toast('🚀 Item posted! Nearby recyclers have been notified.', 'success');
  nav(document.querySelector('.nav-links button:nth-child(2)'), 'marketplace');
}

// ========== DASHBOARD ==========
function renderDashboard() {
  const myItems = items.filter(i => i.mine);
  document.getElementById('d-posted').textContent       = myItems.length;
  document.getElementById('d-claimed-ct').textContent   = myItems.filter(i => i.status === 'claimed').length;
  document.getElementById('d-collected-ct').textContent = myItems.filter(i => i.status === 'collected').length;
  document.getElementById('d-available-ct').textContent = myItems.filter(i => i.status === 'available').length;
  document.getElementById('pp-items').textContent       = myItems.length;
  document.getElementById('stat-items').textContent     = items.length;

  // My listed items
  const myGrid = document.getElementById('my-items-grid');
  myGrid.innerHTML = myItems.length === 0
    ? `<div class="empty" style="grid-column:1/-1">
         <div class="empty-icon">📦</div>
         <h3>No items posted yet</h3>
         <p>Post your first item now!</p>
       </div>`
    : myItems.map(it => renderItem(it)).join('');

  // Claimed items (as recycler)
  const claimedItems = items.filter(i => i.status === 'claimed' && !i.mine).slice(0, 4);
  const cGrid = document.getElementById('claimed-items-grid');
  cGrid.innerHTML = claimedItems.length === 0
    ? `<div class="empty" style="grid-column:1/-1">
         <div class="empty-icon">🔖</div>
         <h3>No claimed items yet</h3>
         <p>Browse the marketplace to claim items</p>
       </div>`
    : claimedItems.map(it => renderItem(it, false)).join('');
}

function dashTab(el, tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('dash-user').style.display     = tab === 'user'     ? 'block' : 'none';
  document.getElementById('dash-recycler').style.display = tab === 'recycler' ? 'block' : 'none';
  document.getElementById('dash-impact').style.display   = tab === 'impact'   ? 'block' : 'none';
}

// ========== NAVIGATION ==========
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('pg-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nav(navEl, page) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (navEl && navEl.classList) navEl.classList.add('active');
  showPage(page);
  if (page === 'marketplace') renderMarket();
  if (page === 'dashboard')   renderDashboard();
}

// ========== TOAST ==========
function toast(msg, type = '') {
  const t = document.createElement('div');
  t.className = 'toast' + (type ? ' ' + type : '');
  t.textContent = msg;
  document.getElementById('toasts').appendChild(t);
  setTimeout(() => {
    t.style.opacity   = '0';
    t.style.transform = 'translateY(8px)';
    t.style.transition = 'all 0.3s';
    setTimeout(() => t.remove(), 300);
  }, 3200);
}

// ========== INIT ==========
seedItems();
renderMarket();
renderDashboard();
