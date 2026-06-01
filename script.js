const taskInput = document.getElementById("taskInput");
const taskContainer = document.getElementById("taskContainer");
const addTaskButton = document.getElementById("addTaskButton");
const searchInput = document.getElementById("searchInput");
const taskStats = document.getElementById("taskStats");

const pushupsCount = document.getElementById("pushupsCount");
const pushupsButton = document.getElementById("pushupsButton");
const resetPushupsButton = document.getElementById("resetPushupsButton");
const streakDisplay = document.getElementById("streakDisplay");

const dateParagraph = document.getElementById("date");

const bibleVerseParagraph = document.getElementById("bibleVerse");
const verseParagraph = document.getElementById("verse");

const toast = document.getElementById("toast");

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let reminderFiredSet = new Set();

let draggedTask = null;

let today = new Date().toLocaleDateString();
let saveDate = localStorage.getItem("pushupsDate");

let count = parseInt(localStorage.getItem("pushupsCount")) || 0;

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

const MILESTONES = [
  { count: 25, message: "Great start! Keep pushing! 💪" },
  { count: 50, message: "Halfway there! You're crushing it! 🔥" },
  { count: 75, message: "Almost at the goal! Don't stop now! ⚡" },
  { count: 100, message: "Daily goal reached! GET JACKED! 💪🔥" },
];

let triggeredMilestones =
  JSON.parse(localStorage.getItem("triggeredMilestones")) || [];

let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastStreakDate = localStorage.getItem("lastStreakDate") || "";

if (saveDate !== today) {
  count = 0;
  triggeredMilestones = [];

  localStorage.setItem("pushupsCount", count);
  localStorage.setItem("pushupsDate", today);
  localStorage.setItem(
    "triggeredMilestones",
    JSON.stringify(triggeredMilestones)
  );
}

dateParagraph.textContent = today;
dateParagraph.style.color = "white";

let emptyStateEl = null;

function createEmptyState() {
  if (emptyStateEl) return;
  emptyStateEl = document.createElement("div");
  emptyStateEl.className = "empty-state";
  emptyStateEl.innerHTML = `<span class="empty-state-icon">📋</span>No tasks yet. Add one above!`;
  taskContainer.appendChild(emptyStateEl);
}

function removeEmptyState() {
  if (emptyStateEl) {
    emptyStateEl.remove();
    emptyStateEl = null;
  }
}

async function displayDailyVerse() {
  const cachedDate = localStorage.getItem("bibleVerseDate");
  const cached = JSON.parse(localStorage.getItem("bibleVerseCache"));

  if (cachedDate === today && cached) {
    bibleVerseParagraph.textContent = cached.reference;
    verseParagraph.textContent = cached.text;
    bibleVerseParagraph.style.color = "white";
    verseParagraph.style.color = "white";
    return;
  }

  try {
    const res = await fetch("https://bible-api.com/?random=verse");
    const data = await res.json();
    bibleVerseParagraph.textContent = data.reference;
    verseParagraph.textContent = data.text;
    localStorage.setItem("bibleVerseDate", today);
    localStorage.setItem(
      "bibleVerseCache",
      JSON.stringify({ reference: data.reference, text: data.text })
    );
  } catch {
    bibleVerseParagraph.textContent = "John 3:16";
    verseParagraph.textContent =
      "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.";
  }

  bibleVerseParagraph.style.color = "white";
  verseParagraph.style.color = "white";
}

let toastTimeout;

function showToast(message, duration = 3000) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function showUndoToast(message, taskData, duration = 5000) {
  clearTimeout(toastTimeout);
  toast.innerHTML = `${message} <button class="toast-undo">Undo</button>`;
  toast.classList.add("show");

  const undoBtn = toast.querySelector(".toast-undo");
  undoBtn.addEventListener("click", () => {
    createTask(taskData.text, taskData.important, taskData.completed, taskData.recurring, taskData.recurringDay, taskData.reminder);
    updateTaskStats();
    toast.classList.remove("show");
  }, { once: true });

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

pushupsCount.textContent = count;

function updateStreakDisplay() {
  streakDisplay.textContent =
    streak > 0
      ? `🔥 Streak: ${streak} day${streak !== 1 ? "s" : ""}`
      : "Start your streak today! 💪";
}

updateStreakDisplay();

pushupsButton.addEventListener("click", () => {
  count += 25;
  pushupsCount.textContent = count;

  for (const m of MILESTONES) {
    if (count >= m.count && !triggeredMilestones.includes(m.count)) {
      triggeredMilestones.push(m.count);
      localStorage.setItem(
        "triggeredMilestones",
        JSON.stringify(triggeredMilestones)
      );
      showToast(m.message);
    }
  }

  if (count >= 100 && lastStreakDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastStreakDate === yesterday.toLocaleDateString()) {
      streak++;
    } else {
      streak = 1;
    }

    lastStreakDate = today;
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastStreakDate", lastStreakDate);
    updateStreakDisplay();
  }

  localStorage.setItem("pushupsCount", count);
});

resetPushupsButton.addEventListener("click", () => {
  count = 0;
  triggeredMilestones = [];
  pushupsCount.textContent = count;
  localStorage.setItem("pushupsCount", count);
  localStorage.setItem(
    "triggeredMilestones",
    JSON.stringify(triggeredMilestones)
  );
});

addTaskButton.addEventListener("click", () => {
  if (taskInput.value.trim() === "") {
    showToast("Input cannot be empty");
    return;
  }

  createTask(taskInput.value);
  taskInput.value = "";
  updateTaskStats();
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTaskButton.click();
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".task:not([style*='opacity: 0.5'])"),
  ];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    }

    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

taskContainer.addEventListener("dragover", (e) => {
  e.preventDefault();

  const afterElement = getDragAfterElement(taskContainer, e.clientY);

  if (afterElement == null) {
    taskContainer.appendChild(draggedTask);
  } else {
    taskContainer.insertBefore(draggedTask, afterElement);
  }

  saveTasks();
});

function finishEditing(paragraph) {
  if (paragraph.contentEditable !== "true") return;
  paragraph.contentEditable = "false";
  paragraph.classList.remove("editing");
  if (paragraph.textContent.trim() === "") {
    paragraph.textContent = paragraph.dataset.originalText || "";
  }
  saveTasks();
}

function createTask(taskText, important = false, completed = false, recurring = false, recurringDay = -1, reminder = null) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("task");
  wrapper.draggable = true;

  if (important) {
    wrapper.classList.add("important");
  }
  if (completed) {
    wrapper.classList.add("completed");
  }

  wrapper.addEventListener("dragstart", () => {
    draggedTask = wrapper;
    wrapper.style.opacity = "0.5";
  });

  wrapper.addEventListener("dragend", () => {
    draggedTask = null;
    wrapper.style.opacity = "";
  });

  // --- Swipe-to-delete ---
  let touchStartX = 0;
  let isSwiping = false;

  wrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    isSwiping = false;
  }, { passive: true });

  wrapper.addEventListener("touchmove", (e) => {
    const dx = e.touches[0].clientX - touchStartX;
    if (dx < -10) {
      isSwiping = true;
      wrapper.classList.add("swiping");
      wrapper.style.transform = `translateX(${Math.max(dx, -120)}px)`;
    }
  }, { passive: true });

  wrapper.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    wrapper.classList.remove("swiping");
    wrapper.style.transform = "";
    if (isSwiping && dx < -80) {
      wrapper.classList.add("swipe-left");
      setTimeout(() => removeTaskWithUndo(wrapper), 300);
    }
    isSwiping = false;
  }, { passive: true });
  // --- End swipe ---

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-checkbox");
  checkbox.checked = completed;
  checkbox.addEventListener("change", () => {
    wrapper.classList.toggle("completed");
    paragraph.classList.toggle("completed-text");
    saveTasks();
    updateTaskStats();
  });

  const meta = document.createElement("div");
  meta.classList.add("task-meta");

  const importantBtn = document.createElement("button");
  importantBtn.textContent = "⭐";
  importantBtn.classList.add("important-btn");
  importantBtn.addEventListener("click", () => {
    wrapper.classList.toggle("important");
    saveTasks();
  });
  meta.appendChild(importantBtn);

  const recurringBtn = document.createElement("button");
  recurringBtn.textContent = "🔄";
  recurringBtn.classList.add("recurring-btn");
  recurringBtn.title = "Toggle weekly recurring";
  const recurringDaySpan = document.createElement("span");
  recurringDaySpan.classList.add("recurring-day");
  if (recurring && recurringDay >= 0) {
    wrapper.classList.add("recurring");
    wrapper.dataset.recurringDay = recurringDay;
    wrapper.dataset.lastResetWeek = getWeekNumber(new Date());
    recurringDaySpan.textContent = DAY_NAMES[recurringDay];
  }
  recurringBtn.addEventListener("click", () => {
    if (wrapper.classList.contains("recurring")) {
      wrapper.classList.remove("recurring");
      delete wrapper.dataset.recurringDay;
      delete wrapper.dataset.lastResetWeek;
      recurringDaySpan.textContent = "";
    } else {
      const days = DAY_NAMES.map((d, i) => `${i}: ${d}`).join("\n");
      const input = prompt(`Repeat every:\n${days}`, new Date().getDay());
      const day = parseInt(input);
      if (day >= 0 && day <= 6) {
        wrapper.classList.add("recurring");
        wrapper.dataset.recurringDay = day;
        wrapper.dataset.lastResetWeek = getWeekNumber(new Date());
        recurringDaySpan.textContent = DAY_NAMES[day];
        showToast(`Repeats every ${DAY_NAMES[day]}`);
      }
    }
    saveTasks();
  });
  meta.appendChild(recurringBtn);
  meta.appendChild(recurringDaySpan);

  const reminderBtn = document.createElement("button");
  reminderBtn.textContent = "🔔";
  reminderBtn.classList.add("reminder-btn");
  reminderBtn.title = "Set reminder";
  const reminderTimeSpan = document.createElement("span");
  reminderTimeSpan.classList.add("reminder-time");
  if (reminder) {
    wrapper.classList.add("has-reminder");
    wrapper.dataset.reminder = reminder;
    reminderTimeSpan.textContent = reminder;
  }
  reminderBtn.addEventListener("click", () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    if (wrapper.dataset.reminder) {
      delete wrapper.dataset.reminder;
      wrapper.classList.remove("has-reminder");
      reminderTimeSpan.textContent = "";
      showToast("Reminder removed");
    } else {
      const input = prompt("Reminder time (HH:MM, 24h format):", "09:00");
      if (input && /^\d{2}:\d{2}$/.test(input)) {
        wrapper.dataset.reminder = input;
        wrapper.classList.add("has-reminder");
        reminderTimeSpan.textContent = input;
        showToast(`Reminder set for ${input}`);
      }
    }
    saveTasks();
  });
  meta.appendChild(reminderBtn);
  meta.appendChild(reminderTimeSpan);

  const paragraph = document.createElement("p");
  paragraph.textContent = taskText;
  paragraph.classList.add("task-text");
  if (completed) {
    paragraph.classList.add("completed-text");
  }

  paragraph.addEventListener("blur", () => {
    finishEditing(paragraph);
  });

  paragraph.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && paragraph.contentEditable === "true") {
      e.preventDefault();
      paragraph.blur();
    }
  });

  const actions = document.createElement("div");
  actions.classList.add("task-actions");

  const editButton = document.createElement("button");
  editButton.textContent = "✏️";
  editButton.classList.add("edit-btn");
  editButton.title = "Edit task";
  actions.appendChild(editButton);

  const removeButton = document.createElement("button");
  removeButton.textContent = "🗑️";
  removeButton.classList.add("remove-btn");
  removeButton.title = "Delete task";
  actions.appendChild(removeButton);

  wrapper.appendChild(checkbox);
  wrapper.appendChild(meta);
  wrapper.appendChild(paragraph);
  wrapper.appendChild(actions);

  taskContainer.appendChild(wrapper);

  setTimeout(() => {
    wrapper.classList.add("show");
  }, 10);

  saveTasks();
}

function removeTaskWithUndo(taskElement) {
  const paragraph = taskElement.querySelector(".task-text");
  const taskData = {
    text: paragraph.textContent,
    important: taskElement.classList.contains("important"),
    completed: taskElement.classList.contains("completed"),
    recurring: taskElement.classList.contains("recurring"),
    recurringDay: taskElement.dataset.recurringDay ? parseInt(taskElement.dataset.recurringDay) : -1,
    reminder: taskElement.dataset.reminder || null,
  };

  taskElement.remove();
  saveTasks();
  updateTaskStats();
  showUndoToast("Task deleted", taskData);
}

taskContainer.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList.contains("remove-btn")) {
    removeTaskWithUndo(target.closest(".task"));
  }

  if (target.classList.contains("edit-btn")) {
    const wrapper = target.closest(".task");
    const paragraph = wrapper.querySelector(".task-text");
    if (paragraph.contentEditable === "true") {
      paragraph.blur();
    } else {
      paragraph.dataset.originalText = paragraph.textContent;
      paragraph.contentEditable = "true";
      paragraph.classList.add("editing");
      paragraph.focus();
      const range = document.createRange();
      range.selectNodeContents(paragraph);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  document.querySelectorAll(".task").forEach((task) => {
    const text = task.querySelector(".task-text").textContent.toLowerCase();
    task.style.display = text.includes(query) ? "" : "none";
  });
});

function updateTaskStats() {
  const all = document.querySelectorAll(".task");
  const total = all.length;
  const completedCount = document.querySelectorAll(".task.completed").length;

  if (total === 0) {
    taskStats.textContent = "No tasks yet";
    createEmptyState();
  } else {
    const pct = Math.round((completedCount / total) * 100);
    taskStats.textContent = `${completedCount}/${total} completed (${pct}%)`;
    removeEmptyState();
  }
}

function saveTasks() {
  const tasks = [];

  document.querySelectorAll(".task").forEach((task) => {
    const text = task.querySelector(".task-text").textContent;
    const important = task.classList.contains("important");
    const completed = task.classList.contains("completed");

    const recurring = task.classList.contains("recurring");
    const recurringDay = recurring ? parseInt(task.dataset.recurringDay) : -1;
    const lastResetWeek = recurring ? parseInt(task.dataset.lastResetWeek) : -1;
    const reminder = task.dataset.reminder || null;

    tasks.push({ text, important, completed, recurring, recurringDay, lastResetWeek, reminder });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  savedTasks.forEach((task) => {
    if (task.recurring && task.recurringDay >= 0) {
      const todayDay = new Date().getDay();
      const currentWeek = getWeekNumber(new Date());
      if (task.recurringDay === todayDay && task.lastResetWeek !== currentWeek) {
        task.completed = false;
        task.lastResetWeek = currentWeek;
      }
    }
    createTask(task.text, task.important, task.completed, task.recurring, task.recurringDay, task.reminder);
  });
}

loadTasks();
displayDailyVerse();
updateTaskStats();

if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}

setInterval(() => {
  const now = new Date();
  const timeStr =
    `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  document.querySelectorAll(".task.has-reminder").forEach((task) => {
    const reminderTime = task.dataset.reminder;
    if (!reminderTime || task.classList.contains("completed")) return;

    if (reminderTime === timeStr) {
      const text = task.querySelector(".task-text").textContent;
      const key = text + reminderTime;
      if (!reminderFiredSet.has(key)) {
        reminderFiredSet.add(key);
        if (Notification.permission === "granted") {
          new Notification("⏰ Task Reminder", { body: text });
        }
        showToast(`⏰ Reminder: ${text}`, 5000);
      }
    }
  });
}, 30000);
