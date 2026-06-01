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
    wrapper.style.opacity = "1";
  });

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

  const importantBtn = document.createElement("button");
  importantBtn.textContent = "⭐";
  importantBtn.classList.add("important-btn");
  importantBtn.addEventListener("click", () => {
    wrapper.classList.toggle("important");
    saveTasks();
  });

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

  const paragraph = document.createElement("p");
  paragraph.textContent = taskText;
  paragraph.classList.add("task-text");
  if (completed) {
    paragraph.classList.add("completed-text");
  }

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit-btn");

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.classList.add("remove-btn");

  wrapper.appendChild(checkbox);
  wrapper.appendChild(importantBtn);
  wrapper.appendChild(recurringBtn);
  wrapper.appendChild(recurringDaySpan);
  wrapper.appendChild(reminderBtn);
  wrapper.appendChild(reminderTimeSpan);
  wrapper.appendChild(paragraph);
  wrapper.appendChild(editButton);
  wrapper.appendChild(removeButton);

  taskContainer.appendChild(wrapper);

  setTimeout(() => {
    wrapper.classList.add("show");
  }, 10);

  saveTasks();
}

taskContainer.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList.contains("remove-btn")) {
    target.parentElement.remove();
    saveTasks();
    updateTaskStats();
  }

  if (target.classList.contains("edit-btn")) {
    const paragraph = target.parentElement.querySelector(".task-text");
    const newText = prompt("Edit task:", paragraph.textContent);

    if (newText !== null && newText.trim() !== "") {
      paragraph.textContent = newText;
      saveTasks();
    }
  }
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  document.querySelectorAll(".task").forEach((task) => {
    const text = task.querySelector(".task-text").textContent.toLowerCase();
    task.style.display = text.includes(query) ? "flex" : "none";
  });
});

function updateTaskStats() {
  const all = document.querySelectorAll(".task");
  const total = all.length;
  const completedCount = document.querySelectorAll(".task.completed").length;

  if (total === 0) {
    taskStats.textContent = "No tasks yet";
  } else {
    const pct = Math.round((completedCount / total) * 100);
    taskStats.textContent = `${completedCount}/${total} completed (${pct}%)`;
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
