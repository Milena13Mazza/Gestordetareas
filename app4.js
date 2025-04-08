const tasks = [
    { id: 1, title: "Diseñar landing", description: "Crear la home en Figma y pasarla a devs", priority: "Alta" },
    { id: 2, title: "Revisión con cliente", description: "Hacer ajustes del moodboard", priority: "Media" },
    { id: 3, title: "Auditoría UX", description: "Revisar flujo de usuarios en checkout", priority: "Baja" },
  ];
  
  let currentTaskId = null;
  
  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector(".close");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalPriority = document.getElementById("modalPriority");
  const saveBtn = document.getElementById("saveBtn");
  const taskForm = document.getElementById("taskForm");
  
  function renderTasks() {
    document.getElementById("alta-tasks").innerHTML = "";
    document.getElementById("media-tasks").innerHTML = "";
    document.getElementById("baja-tasks").innerHTML = "";
  
    tasks.forEach(task => {
      const taskEl = document.createElement("div");
      taskEl.classList.add("task");
      taskEl.setAttribute("data-priority", task.priority);
      taskEl.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
      taskEl.onclick = () => openModal(task.id);
  
      const container = document.getElementById(`${task.priority.toLowerCase()}-tasks`);
      container.appendChild(taskEl);
    });
  }
  
  function openModal(id) {
    const task = tasks.find(t => t.id === id);
    currentTaskId = id;
    modalTitle.value = task.title;
    modalDescription.value = task.description;
    modalPriority.value = task.priority;
    modal.classList.remove("hidden");
  }
  
  closeBtn.onclick = () => modal.classList.add("hidden");
  
  saveBtn.onclick = () => {
    const task = tasks.find(t => t.id === currentTaskId);
    task.title = modalTitle.value;
    task.description = modalDescription.value;
    task.priority = modalPriority.value;
    renderTasks();
    modal.classList.add("hidden");
  };
  
  taskForm.onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById("newTitle").value.trim();
    const desc = document.getElementById("newDescription").value.trim();
    const priority = document.getElementById("newPriority").value;
  
    if (!title || !desc) return alert("Completá todos los campos");
  
    const newTask = {
      id: Date.now(),
      title,
      description: desc,
      priority
    };
  
    tasks.push(newTask);
    renderTasks();
    taskForm.reset();
  };
  
  renderTasks();
  