
const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeModal = document.getElementById("closeModal");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const tasksContainer = document.getElementById("tasksContainer");

const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");

let tasks = [];
let editingTaskId = null;

addTaskBtn.onclick = () => openModal();
closeModal.onclick = () => closeTaskModal();
saveTaskBtn.onclick = () => saveTask();

function openModal(id = null) {
  if (id !== null) {
    const task = tasks.find(t => t.id === id);
    taskTitle.value = task.title;
    taskDescription.value = task.description;
    taskPriority.value = task.priority;
    editingTaskId = id;
  } else {
    taskTitle.value = "";
    taskDescription.value = "";
    taskPriority.value = "low";
    editingTaskId = null;
  }
  taskModal.classList.remove("hidden");
}

function closeTaskModal() {
  taskModal.classList.add("hidden");
}

function saveTask() {
  const title = taskTitle.value;
  const description = taskDescription.value;
  const priority = taskPriority.value;

  if (editingTaskId !== null) {
    const task = tasks.find(t => t.id === editingTaskId);
    task.title = title;
    task.description = description;
    task.priority = priority;
  } else {
    const newTask = {
      id: Date.now(),
      title,
      description,
      priority
    };
    tasks.push(newTask);
  }
  renderTasks();
  closeTaskModal();
}

function renderTasks() {
  tasksContainer.innerHTML = "";
  tasks.forEach(task => {
    const taskEl = document.createElement("div");
    taskEl.classList.add("task");
    taskEl.setAttribute("data-priority", task.priority);
    taskEl.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <div class="task-actions">
        <button class="edit">✏️</button>
        <button class="delete">🗑️</button>
      </div>
    `;

    taskEl.querySelector(".edit").onclick = () => openModal(task.id);
    taskEl.querySelector(".delete").onclick = () => deleteTask(task.id);

    tasksContainer.appendChild(taskEl);
  });
}

function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    renderTasks();
  }
}
