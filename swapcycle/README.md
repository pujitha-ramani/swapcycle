# SwapCycle 🌿

**Turn Waste into Value Instantly** — A modern marketplace platform for listing and claiming recyclable waste items.

---

## 📁 Project Structure

```
swapcycle/
├── index.html        ← Main HTML (all pages as SPA)
├── css/
│   └── style.css     ← Full stylesheet (eco-green theme, responsive)
├── js/
│   └── app.js        ← All application logic & state management
└── README.md
```

---

## 🚀 Getting Started

Just open `index.html` in your browser — no build step required.

```bash
# Option 1: Open directly
open index.html

# Option 2: Serve locally (recommended)
npx serve .
# or
python3 -m http.server 3000
```

---

## 📄 Pages

| Page        | Description                                          |
|-------------|------------------------------------------------------|
| Home        | Hero, how-it-works, features, CTA                   |
| Marketplace | Browse, search & filter recyclable items            |
| Post Item   | Form to list a new waste item                        |
| Item Detail | Full item view with claim & collect actions          |
| Dashboard   | Poster + Recycler tabs + Impact metrics             |
| Profile     | Account settings, notifications, EcoPoints          |

---

## ⚙️ Core Features

- **Post items** — Select category, add title/quantity/location/notes
- **Browse & filter** — By status (Available / Claimed / Collected) and category
- **Search** — Real-time text search across title, category, location
- **Claim flow** — Modal confirmation before claiming
- **Status tracking** — Available → Claimed → Collected lifecycle
- **Dashboard** — Live stats for posted and claimed items
- **Impact tab** — Waste diverted, CO₂ saved, EcoPoints, badges
- **Toast notifications** — Action feedback throughout

---

## 🎨 Tech Stack

| Layer      | Tech                        |
|------------|-----------------------------|
| Frontend   | Vanilla HTML, CSS, JS (SPA) |
| Fonts      | Space Grotesk + DM Sans     |
| State      | In-memory JS arrays         |
| Hosting    | Any static file server      |

> **To add a real backend:** Replace the in-memory `items` array in `js/app.js` with `fetch()` calls to your REST API or Supabase/Firebase.

---

## 🌱 Color Theme

| Variable        | Value     | Usage               |
|-----------------|-----------|---------------------|
| `--green-500`   | `#2d9a65` | Primary buttons     |
| `--green-600`   | `#1d7a4e` | Hover states        |
| `--green-700`   | `#145c39` | Hero gradient dark  |
| `--neutral-700` | `#302f2d` | Body text           |
| `--sage-50`     | `#f5f8f5` | Card thumbnails     |

---

## 📱 Responsive

- Desktop: Full nav, multi-column grids
- Mobile: Stacked layout, hidden nav links (hamburger can be added)

---

## 🔧 Extending

**Add backend API:**
```js
// In js/app.js — replace seedItems() with:
async function loadItems() {
  const res = await fetch('/api/items');
  items = await res.json();
  renderMarket();
  renderDashboard();
}
```

**Add authentication:**
Wrap nav actions with a login check and redirect to a login modal.

**Add real-time updates:**
Use WebSockets or Server-Sent Events to push new item listings to recyclers.

---

Made with 💚 by SwapCycle
