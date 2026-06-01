# Faith & Fitness Todo App

A productivity-focused todo application built with vanilla JavaScript, HTML, and CSS.

This project combines:

* ✅ Persistent task management  
* ⭐ Important task highlighting  
* 💪 Daily pushup tracking  
* 📖 Daily Bible verses  
* 💾 LocalStorage persistence  
* 🎨 Interactive UI states + drag-and-drop sorting  

---

# Features

## ✅ Todo List

* Add tasks  
* Edit tasks  
* Remove tasks  
* Mark tasks as important (⭐ star toggle)  
* Drag and drop tasks to reorder  
* Task highlighting persists after refresh  
* Tasks are saved using `localStorage`  

## ⭐ Important Tasks System

* Click the ⭐ button to mark a task as important  
* Important tasks are visually highlighted  
* Styling persists after page reload  
* Helps prioritize tasks without needing a checkbox  

## 💪 Pushup Counter

* Tracks daily pushup progress  
* Adds 25 pushups per button click  
* Goal milestone alerts  
* Reset button included  
* Automatically resets each new day  
* Pushup count persists with `localStorage`  

## 📖 Daily Bible Verse

* Displays a random Bible verse each time the app loads  
* Includes verse references and scripture text  
* Encouraging and motivational verses included  

## 💾 Persistent Storage

The app uses browser `localStorage` to save:

* Tasks  
* Task importance state  
* Task completion state  
* Pushup counts  
* Last active date (for daily reset system)  

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
  completed: true,
  important: false
}
```

When the page reloads:

* Tasks are loaded from `localStorage`  
* Completion state is restored  
* Important state is restored  
* Styling is reapplied automatically  

---

# Future Improvements

Planned upgrades:

* Dark/light mode toggle  
* Mobile responsiveness improvements  
* Due dates and reminders  
* Task categories / tags  
* Sound effects or haptics  
* Undo delete functionality  

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

---

*This app was improved with the assistance of AI (opencode/claude).*