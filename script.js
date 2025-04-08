document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("agregarBtn").addEventListener("click", agregarTarea);
  cargarTareas();
});

function agregarTarea() {
  const texto = document.getElementById("nuevaTarea").value.trim();
  const prioridad = document.getElementById("prioridad").value;

  if (texto === "") return;

  const tarea = { texto, prioridad };
  const tareas = obtenerTareas();
  tareas.push(tarea);
  localStorage.setItem("tareas", JSON.stringify(tareas));

  document.getElementById("nuevaTarea").value = "";
  cargarTareas();
}

function cargarTareas() {
  const tareas = obtenerTareas();
  ["alta", "media", "baja"].forEach(prio => {
    const lista = document.getElementById(`tareas-${prio}`);
    lista.innerHTML = "";
    tareas
      .filter(t => t.prioridad === prio)
      .forEach((tarea, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${tarea.texto}
          <button class="eliminar" onclick="eliminarTarea(${index})">✕</button>
        `;
        lista.appendChild(li);
      });
  });
}

function obtenerTareas() {
  return JSON.parse(localStorage.getItem("tareas")) || [];
}

function eliminarTarea(index) {
  const tareas = obtenerTareas();
  tareas.splice(index, 1);
  localStorage.setItem("tareas", JSON.stringify(tareas));
  cargarTareas();
}

