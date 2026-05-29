# Faith & Fitness Todo App

A productivity-focused todo application built with vanilla JavaScript, HTML, and CSS.

This project combines:

* ✅ Persistent task management
* 💪 Daily pushup tracking
* 📖 Daily Bible verses
* 💾 LocalStorage persistence
* 🎨 Interactive UI states

---

# Features

## ✅ Todo List

* Add tasks
* Edit tasks
* Remove tasks
* Mark tasks as completed
* Completed task highlighting persists after refresh
* Tasks are saved using `localStorage`

## 💪 Pushup Counter

* Tracks daily pushup progress
* Adds 25 pushups per button click
* Goal milestone alerts
* Reset button included
* Pushup count persists with `localStorage`

## 📖 Daily Bible Verse

* Displays a random Bible verse each time the app loads
* Includes verse references and scripture text
* Encouraging and motivational verses included

## 💾 Persistent Storage

The app uses browser `localStorage` to save:

* Tasks
* Completion states
* Pushup counts

Your data remains after refreshing or reopening the page.

---

# Technologies Used

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Browser LocalStorage API

---

# How It Works

## Task Persistence

Tasks are stored as objects:

```js
{
  text: "Finish project",
  completed: true
}
```

When the page reloads:

* Tasks are loaded from `localStorage`
* Completion state is restored
* Highlight styling is reapplied automatically

---

# Future Improvements

Planned upgrades:

* Drag-and-drop task sorting
* Dark/light mode toggle
* Daily reset system
* Real Bible Verse API integration
* Mobile responsiveness improvements
* Due dates and reminders
* Task categories

---

# Installation

## Clone the repository

```bash
git clone https://github.com/yourusername/your-repo.git
```

## Open the project

```bash
cd your-repo
```

Open `index.html` in your browser.

---

# GitHub Pages Deployment

After pushing updates:

```bash
git add .
git commit -m "Updated todo app"
git push origin main
```

Your GitHub Pages site should update automatically.

---

# License

This project is open source and available under the MIT License.

---

# Author

Built by Christian Krider.
