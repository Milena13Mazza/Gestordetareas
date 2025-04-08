const openModal = document.getElementById('openModal');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const guardarTarea = document.getElementById('guardarTarea');
const tituloInput = document.getElementById('titulo');
const descripcionInput = document.getElementById('descripcion');
const prioridadInput = document.getElementById('prioridad');

openModal.onclick = () => modal.style.display = 'block';
closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

function renderTareas() {
    ['alta', 'media', 'baja'].forEach(prioridad => {
        const container = document.getElementById(`${prioridad}-tasks`);
        container.innerHTML = '';
        tareas.filter(t => t.prioridad === prioridad).forEach((tarea, index) => {
            const div = document.createElement('div');
            div.className = 'task' + (tarea.completada ? ' completed' : '');
            div.innerHTML = \`
                <strong>\${tarea.titulo}</strong><br/>
                <small>\${tarea.descripcion}</small>
                <div class="acciones">
                    <input type="checkbox" \${tarea.completada ? 'checked' : ''} onchange="toggleCompletar(\${index})">
                    <button onclick="eliminarTarea(\${index})">🗑️</button>
                </div>
            \`;
            container.appendChild(div);
        });
    });
}

function guardar() {
    const nuevaTarea = {
        titulo: tituloInput.value,
        descripcion: descripcionInput.value,
        prioridad: prioridadInput.value,
        completada: false
    };
    tareas.push(nuevaTarea);
    localStorage.setItem('tareas', JSON.stringify(tareas));
    modal.style.display = 'none';
    tituloInput.value = '';
    descripcionInput.value = '';
    prioridadInput.value = 'baja';
    renderTareas();
}

function eliminarTarea(index) {
    tareas.splice(index, 1);
    localStorage.setItem('tareas', JSON.stringify(tareas));
    renderTareas();
}

function toggleCompletar(index) {
    tareas[index].completada = !tareas[index].completada;
    localStorage.setItem('tareas', JSON.stringify(tareas));
    renderTareas();
}

guardarTarea.onclick = guardar;

renderTareas();
