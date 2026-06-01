# Faith & Fitness Todo App

A full-featured productivity app that combines task management with daily fitness tracking and inspiration — built with vanilla JavaScript, HTML, and CSS. No frameworks, no build tools, no dependencies.

---

## Features

### ✅ Todo List
- Add, edit, and remove tasks
- Mark tasks as important (⭐ star toggle) with gold highlight
- Check off completed tasks (checkbox + strikethrough)
- Drag and drop to reorder
- **Weekly recurring tasks** — toggle 🔄 on any task to make it repeat weekly on a chosen day; auto-unchecks each occurrence
- **Reminders** — set a 🔔 with an HH:MM time; fires a browser notification + toast when the time arrives
- Live **search/filter** — type to filter tasks in real time
- **Progress stats** — shows `X/Y completed (Z%)` at a glance

### 💪 Pushup Tracker
- Daily pushup counter (resets automatically each day)
- **+25** button to increment; **Reset** button to start over
- **Milestones** at 25, 50, 75, and 100 pushups — each fires once per day with a unique motivational message
- **Streak tracking** — consecutive days the 100-pushup goal was met, displayed as `🔥 Streak: N days`

### 📖 Daily Bible Verse
- Fetches a random verse from **[bible-api.com](https://bible-api.com)** (World English Bible, public domain)
- Same verse shown all day; a new verse is fetched automatically each day
- Cached in `localStorage` so it loads instantly on repeat visits
- Graceful fallback if offline

### 🔔 Toast Notifications
- Inline notification bar replaces intrusive `alert()` popups
- Auto-dismisses after 3 seconds with a smooth fade animation
- Used for input validation and milestone messages

### 📱 Mobile-Friendly
- Fully responsive layout with `@media (max-width: 480px)` breakpoints
- Stacks input and filter sections vertically on small screens
- Larger tap targets and optimized font sizes for touch

### 💾 Persistent Storage
All data is saved to the browser's `localStorage`:

- Tasks (text, importance, completion state, recurring schedule, reminder time)
- Task order (drag-and-drop position)
- Pushup count + milestone state + streak history
- Cached Bible verse + date
- Fired reminders (per session)

Your data persists across page refreshes and browser sessions.

---

## Technologies Used

- **HTML5** — semantic markup
- **CSS3** — flexbox, transitions, media queries
- **JavaScript (Vanilla ES6+)** — all application logic
- **Browser LocalStorage API** — client-side persistence
- **Bible API** — [`bible-api.com`](https://bible-api.com) (free, no key required)
- **HTML5 Drag & Drop API** — task reordering

---

## How It Works

### Task Persistence

Tasks are stored as objects in `localStorage`:

```js
{
  text: "Take out trash",
  important: false,
  completed: true,
  recurring: true,
  recurringDay: 1,        // 0=Sun … 6=Sat
  lastResetWeek: 22,      // ISO week of last auto-reset
  reminder: "09:00"       // HH:MM or null
}
```

On page load, tasks are recreated with all state restored. Recurring tasks auto-uncheck when their day arrives in a new week.

### Daily Verse Caching

```js
// Pseudocode for the caching logic
if (localStorage has verse saved from today) {
  show cached verse           // instant, no network
} else {
  fetch("https://bible-api.com/?random=verse")
  cache the response with today's date
  show the new verse
}
```

### Pushup Streak Logic

When the user hits 100 pushups:

1. If yesterday's goal was also completed → streak increments
2. If there was a gap → streak resets to 1
3. Streak is displayed and persisted in `localStorage`

---

## Future Improvements

Planned upgrades:

- Dark/light mode toggle
- Due dates
- Task categories / tags
- Sound effects or haptics
- Undo delete functionality

---

## Installation

```bash
git clone https://github.com/christiankrider1/todo-list-app.git
cd todo-list-app
```

Open `index.html` in your browser. No build step required.

---

## GitHub Pages Deployment

After pushing updates to `main`, your GitHub Pages site updates automatically.

---

## License

MIT

---

## Author

Built by **Christian Krider**.

---

*This app was improved with the assistance of AI (opencode/claude).*
