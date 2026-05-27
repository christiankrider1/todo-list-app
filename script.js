const taskInput = document.getElementById("taskInput");
const taskContainer = document.getElementById("taskContainer");
const addTaskButton = document.getElementById("addTaskButton");

const pushupsCount = document.getElementById("pushupsCount");
const pushupsButton = document.getElementById("pushupsButton");
const resetPushupsButton = document.getElementById("resetPushupsButton");

let count = parseInt(localStorage.getItem("pushupsCount")) || 0;

//Show initial count
pushupsCount.textContent = count;
//Add 25 pushups when button is pressed
pushupsButton.addEventListener("click", () => {
  count += 25;
  pushupsCount.textContent = count;
  if(count == 100) {
    alert("Daily goal has been reached! - 💪GET JACKED💪");
  } else if(count == 125){
    alert("You little over-achiever! Proud of you😘");
  } else if(count > 125){
    alert("Big tiddies coming in shortly... Keep it up!🔥");
  }
  localStorage.setItem("pushupsCount", count);
});

resetPushupsButton.addEventListener("click", () => {
  count = 0;
  pushupsCount.textContent = count;
  localStorage.setItem("pushupsCount", count);
});


// ADD TASK
addTaskButton.addEventListener("click", () => {

  if (taskInput.value.trim() === "") {
    alert("Input cannot be empty");
    return;
  }

  createTask(taskInput.value);

  taskInput.value = "";
});

// CREATE TASK FUNCTION
function createTask(taskText) {

  const wrapper = document.createElement("div");
  wrapper.classList.add("task");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox");

  const paragraph = document.createElement("p");
  paragraph.textContent = taskText;
  paragraph.classList.add("task-text");

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.classList.add("remove-btn");

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit-btn");

  wrapper.appendChild(checkbox);
  wrapper.appendChild(paragraph);
  wrapper.appendChild(editButton);
  wrapper.appendChild(removeButton);

  taskContainer.appendChild(wrapper);

  saveTasks();
}

// CLICK EVENTS
taskContainer.addEventListener("click", (e) => {

  const target = e.target;

  // REMOVE TASK
  if (target.classList.contains("remove-btn")) {

    target.parentElement.remove();

    saveTasks();
  }

  // EDIT TASK
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

// CHECKBOX TOGGLE
taskContainer.addEventListener("change", (e) => {

  const target = e.target;

  if (target.classList.contains("checkbox")) {

    const taskDiv =
      target.parentElement;

    if (target.checked) {

      taskDiv.classList.add("completed");

    } else {

      taskDiv.classList.remove("completed");
    }

    saveTasks();
  }
});

// SAVE TASKS
function saveTasks() {

  const tasks = [];

  document.querySelectorAll(".task").forEach(task => {

    const text =
      task.querySelector(".task-text").textContent;

    const completed =
      task.querySelector(".checkbox").checked;

    tasks.push({
      text,
      completed
    });
  });

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}

// LOAD TASKS
function loadTasks() {

  const savedTasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

  savedTasks.forEach(task => {

    createTask(task.text);

    const lastTask =
      taskContainer.lastElementChild;

    const checkbox =
      lastTask.querySelector(".checkbox");

    if (task.completed) {

      checkbox.checked = true;

      lastTask.querySelector(".task-text")
        .style.textDecoration = "line-through";
    }
  });
}

loadTasks();