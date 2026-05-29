// =========================
// DOM ELEMENTS
// =========================
const taskInput = document.getElementById("taskInput");
const taskContainer = document.getElementById("taskContainer");
const addTaskButton = document.getElementById("addTaskButton");

const pushupsCount = document.getElementById("pushupsCount");
const pushupsButton = document.getElementById("pushupsButton");
const resetPushupsButton = document.getElementById("resetPushupsButton");

const dateParagraph = document.getElementById("date");

const bibleVerseParagraph = document.getElementById("bibleVerse");
const verseParagraph = document.getElementById("verse");

// =========================
// APP STATE
// =========================
let draggedTask = null;

let today = new Date().toLocaleDateString();
let saveDate = localStorage.getItem("pushupsDate");

let count = parseInt(localStorage.getItem("pushupsCount")) || 0;

// =========================
// DAILY PUSHUP RESET
// =========================
if (saveDate !== today) {
  count = 0;

  localStorage.setItem("pushupsCount", count);
  localStorage.setItem("pushupsDate", today);
}

// =========================
// DISPLAY CURRENT DATE
// =========================
dateParagraph.textContent = today;
dateParagraph.style.color = "white";

// =========================
// BIBLE VERSES
// =========================
const verses = {
  "Philippians 4:8": "Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable—if anything is excellent or praiseworthy—think about such things",
  "Colossians 3:15": "Let the peace of Christ rule in your hearts, since as members of one body you were called to peace. And be thankful.",
  "1 Corinthians 16:13": "Be on your guard; stand firm in the faith; be courageous; be strong.",
  "Hebrews 13:5-6": "Keep your lives free from the love of money and be content with what you have, because God has said, 'Never will I leave you; never will I forsake you.' So we say with confidence, 'The Lord is my helper; I will not be afraid. What can mere mortals do to me?'",
  "Isaiah 35:3-4": "Strengthen the feeble hands, steady the knees that give way; say to those with fearful hearts, 'Be strong, do not fear; your God will come, he will come with vengeance with divine retribution he will come to save you.'",
  "Isaiah 40:31": "but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
  "Isaiah 43:10": "'You are my witnesses,' declares the Lord, 'and my servant whom I have chosen, so that you may know and believe me and understand that I am he. Before me no god was formed, nor will there be one after me.'",
  "James 1:2-4": "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance. Let perseverance finish its work so that you may be mature and complete, not lacking anything.",
  "Jeremiah 17:7-8": "But blessed is the one who trusts in the Lord, whose confidence is in him. They will be like a tree planted by the water that sends out its roots by the stream. It does not fear when heat comes; its leaves are always green. It has no worries in a year of drought and never fails to bear fruit.",
  "John 14:27": "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
  "Joshua 1:9": "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
  "Matthew 11:28-30": "Come to me, all you who are weary and burdened, and I will give you rest.Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.",
  "1 Peter 5:6-7": "Humble yourselves, therefore, under Gods mighty hand, that he may lift you up in due time. Cast all your anxiety on him because he cares for you.",
  "1 Peter 5:10": "And the God of all grace, who called you to his eternal glory in Christ, after you have suffered a little while, will himself restore you and make you strong, firm and steadfast.",
  "Philippians 4:6-7": "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
  "Proverbs 3:5-6": "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
  "Proverbs 16:3": "Commit to the Lord whatever you do, and he will establish your plans.",
  "Psalm 23:4":"Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
  "Psalm 37:5":"Commit your way to the Lord; trust in him and he will do this: He will make your righteous reward shine like the dawn, your vindication like the noonday sun.",
  "Psalm 55:22":"Cast your cares on the Lord and he will sustain you; he will never let the righteous be shaken.",
"Romans 8:38-39":"For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.",
"Romans 12:2":"Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what Gods will is—his good, pleasing and perfect will."

};

const verseKeys = Object.keys(verses);

// =========================
// RANDOM VERSE DISPLAY
// =========================
function displayRandomVerse() {
  const randomKey =
    verseKeys[Math.floor(Math.random() * verseKeys.length)];

  bibleVerseParagraph.textContent = randomKey;
  verseParagraph.textContent = verses[randomKey];

  bibleVerseParagraph.style.color = "white";
  verseParagraph.style.color = "white";
}

// =========================
// PUSHUP COUNTER
// =========================

// Show initial count
pushupsCount.textContent = count;

// Add pushups
pushupsButton.addEventListener("click", () => {

  count += 25;

  pushupsCount.textContent = count;

  if (count == 100) {
    alert("Daily goal has been reached! - 💪GET JACKED💪");
  }

  localStorage.setItem("pushupsCount", count);
});

// Reset pushups
resetPushupsButton.addEventListener("click", () => {

  count = 0;

  pushupsCount.textContent = count;

  localStorage.setItem("pushupsCount", count);
});

// =========================
// ADD TASK
// =========================
addTaskButton.addEventListener("click", () => {

  if (taskInput.value.trim() === "") {
    alert("Input cannot be empty");
    return;
  }

  createTask(taskInput.value);

  taskInput.value = "";
});

// =========================
// DRAG AND DROP
// =========================
function getDragAfterElement(container, y) {

  const draggableElements = [
    ...container.querySelectorAll(".task:not([style*='opacity: 0.5'])")
  ];

  return draggableElements.reduce((closest, child) => {

    const box = child.getBoundingClientRect();

    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return {
        offset: offset,
        element: child
      };
    }

    return closest;

  }, {
    offset: Number.NEGATIVE_INFINITY
  }).element;
}

taskContainer.addEventListener("dragover", (e) => {

  e.preventDefault();

  const afterElement =
    getDragAfterElement(taskContainer, e.clientY);

  if (afterElement == null) {
    taskContainer.appendChild(draggedTask);
  } else {
    taskContainer.insertBefore(draggedTask, afterElement);
  }

  saveTasks();
});

// =========================
// CREATE TASK
// =========================
function createTask(taskText, important = false) {

  const wrapper = document.createElement("div");

  wrapper.classList.add("task");

  wrapper.draggable = true;

  if (important) {
    wrapper.classList.add("important");
  }

  // Drag start
  wrapper.addEventListener("dragstart", () => {

    draggedTask = wrapper;

    wrapper.style.opacity = "0.5";
  });

  // Drag end
  wrapper.addEventListener("dragend", () => {

    draggedTask = null;

    wrapper.style.opacity = "1";
  });

  // Important button
  const importantBtn = document.createElement("button");

  importantBtn.textContent = "⭐";

  importantBtn.classList.add("important-btn");

  importantBtn.addEventListener("click", () => {

    wrapper.classList.toggle("important");

    saveTasks();
  });

  // Task text
  const paragraph = document.createElement("p");

  paragraph.textContent = taskText;

  paragraph.classList.add("task-text");

  // Edit button
  const editButton = document.createElement("button");

  editButton.textContent = "Edit";

  editButton.classList.add("edit-btn");

  // Remove button
  const removeButton = document.createElement("button");

  removeButton.textContent = "Remove";

  removeButton.classList.add("remove-btn");

  // Add elements to wrapper
  wrapper.appendChild(importantBtn);
  wrapper.appendChild(paragraph);
  wrapper.appendChild(editButton);
  wrapper.appendChild(removeButton);

  // Add task to page
  taskContainer.appendChild(wrapper);

  // Animation
  setTimeout(() => {
    wrapper.classList.add("show");
  }, 10);

  saveTasks();
}

// =========================
// TASK BUTTON EVENTS
// =========================
taskContainer.addEventListener("click", (e) => {

  const target = e.target;

  // Remove task
  if (target.classList.contains("remove-btn")) {

    target.parentElement.remove();

    saveTasks();
  }

  // Edit task
  if (target.classList.contains("edit-btn")) {

    const paragraph =
      target.parentElement.querySelector(".task-text");

    const newText =
      prompt("Edit task:", paragraph.textContent);

    if (newText !== null && newText.trim() !== "") {

      paragraph.textContent = newText;

      saveTasks();
    }
  }
});

// =========================
// SAVE TASKS
// =========================
function saveTasks() {

  const tasks = [];

  document.querySelectorAll(".task").forEach(task => {

    const text =
      task.querySelector(".task-text").textContent;

    const important =
      task.classList.contains("important");

    tasks.push({
      text,
      important
    });
  });

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}

// =========================
// LOAD TASKS
// =========================
function loadTasks() {

  const savedTasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

  savedTasks.forEach(task => {

    createTask(
      task.text,
      task.important
    );
  });
}

// =========================
// INITIALIZE APP
// =========================
loadTasks();

displayRandomVerse();