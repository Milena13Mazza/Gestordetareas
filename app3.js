document.addEventListener("DOMContentLoaded", () => {
    const board = document.querySelector(".board");
    const addColumnBtn = document.getElementById("addColumnBtn");
    const clearBoardBtn = document.getElementById("clearBoardBtn");
    const saveBoardBtn = document.getElementById("saveBoardBtn");
    const defaultColumns = ["To Do", "In Progress", "Done", "To Send"];
    let draggedTask = null;

    // Cargar el tablero desde localStorage o inicializar con estados predefinidos
    const loadBoard = () => {
        let savedBoard = JSON.parse(localStorage.getItem("trelloBoard")) || [];
        if (savedBoard.length === 0) {
            savedBoard = defaultColumns.map(title => ({ title, tasks: [] }));
        }
        board.innerHTML = "";
        savedBoard.forEach(columnData => createColumn(columnData.title, columnData.tasks));
    };

    // Guardar el tablero en localStorage solo cuando se presione "Guardar"
    const saveBoard = () => {
        const columns = Array.from(document.querySelectorAll(".column"));
        const boardData = columns.map(column => ({
            title: column.querySelector("h3").textContent,
            tasks: Array.from(column.querySelectorAll(".task")).map(task => ({
                title: task.querySelector(".task-title").textContent,
                description: task.querySelector(".task-description").textContent,
                file: task.dataset.file || null,
                color: task.dataset.color || null,
                dueDate: task.dataset.dueDate || null,
            })),
        }));
        localStorage.setItem("trelloBoard", JSON.stringify(boardData));
        alert("Tablero guardado con éxito ✅");
    };

    // Crear una nueva columna
    const createColumn = (title, tasks = []) => {
        const column = document.createElement("div");
        column.classList.add("column");

        const columnHeader = document.createElement("div");
        columnHeader.classList.add("column-header");

        const columnTitle = document.createElement("h3");
        columnTitle.textContent = title;
        columnTitle.contentEditable = true;

        const addTaskBtn = document.createElement("button");
        addTaskBtn.textContent = "+";
        addTaskBtn.classList.add("addTaskBtn");

        const deleteColumnBtn = document.createElement("button");
        deleteColumnBtn.textContent = "×";
        deleteColumnBtn.classList.add("deleteColumnBtn");

        deleteColumnBtn.addEventListener("click", () => {
            column.remove();
        });

        const taskList = document.createElement("div");
        taskList.classList.add("taskList");

        taskList.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        taskList.addEventListener("drop", (e) => {
            e.preventDefault();
            if (draggedTask) {
                taskList.appendChild(draggedTask);
                draggedTask.classList.remove("dragging");
                draggedTask = null;
            }
        });

        tasks.forEach(taskData => createTask(taskData.title, taskList, taskData.description, taskData.file, taskData.color, taskData.dueDate));

        columnHeader.appendChild(columnTitle);
        columnHeader.appendChild(addTaskBtn);
        columnHeader.appendChild(deleteColumnBtn);
        column.appendChild(columnHeader);
        column.appendChild(taskList);
        board.appendChild(column);
    };

    // Crear una nueva tarea
    const createTask = (title, taskList, description = "", file = null, color = null, dueDate = null) => {
        const task = document.createElement("div");
        task.classList.add("task");
        task.draggable = true;

        if (color) {
            task.dataset.color = color; // Aplicar el color de la etiqueta
        }

        if (dueDate) {
            task.dataset.dueDate = dueDate; // Guardar la fecha de vencimiento
        }

        const taskTitle = document.createElement("div");
        taskTitle.classList.add("task-title");
        taskTitle.textContent = title;
        taskTitle.contentEditable = true;

        const taskDescription = document.createElement("div");
        taskDescription.classList.add("task-description");
        taskDescription.textContent = description;
        taskDescription.contentEditable = true;

        const deleteTaskBtn = document.createElement("button");
        deleteTaskBtn.textContent = "×";
        deleteTaskBtn.classList.add("deleteTaskBtn");

        deleteTaskBtn.addEventListener("click", () => {
            task.remove();
        });

        const attachFileBtn = document.createElement("button");
        attachFileBtn.textContent = "Adjuntar archivo";
        attachFileBtn.classList.add("attachFileBtn");

        const attachedFile = document.createElement("div");
        attachedFile.classList.add("attachedFile");
        if (file) {
            attachedFile.textContent = `Archivo: ${file}`;
            task.dataset.file = file; // Guardar el nombre del archivo en el dataset
        }

        attachFileBtn.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "*"; // Permitir cualquier tipo de archivo
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    attachedFile.textContent = `Archivo: ${file.name}`;
                    task.dataset.file = file.name; // Guardar el nombre del archivo en el dataset
                }
            };
            input.click();
        });

        // Selector de colores para etiquetas
        const colorPicker = document.createElement("div");
        colorPicker.classList.add("color-picker");

        const colors = ["red", "blue", "green", "yellow"];
        colors.forEach(color => {
            const colorOption = document.createElement("div");
            colorOption.classList.add("color-option");
            colorOption.dataset.color = color;
            if (color === task.dataset.color) {
                colorOption.classList.add("selected");
            }

            colorOption.addEventListener("click", () => {
                // Remover la selección previa
                colorPicker.querySelectorAll(".color-option").forEach(option => {
                    option.classList.remove("selected");
                });

                // Aplicar el color seleccionado
                colorOption.classList.add("selected");
                task.dataset.color = color;
            });

            colorPicker.appendChild(colorOption);
        });

        // Campo para la fecha de vencimiento
        const dueDateInput = document.createElement("input");
        dueDateInput.type = "date";
        dueDateInput.classList.add("due-date-input");
        if (dueDate) {
            dueDateInput.value = dueDate;
        }

        const dueDateDisplay = document.createElement("div");
        dueDateDisplay.classList.add("task-due-date");
        if (dueDate) {
            const date = new Date(dueDate);
            const formattedDate = date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
            dueDateDisplay.textContent = `Vence: ${formattedDate}`;

            // Verificar si la fecha de vencimiento ha pasado
            if (date < new Date()) {
                dueDateDisplay.classList.add("overdue");
            }
        }

        dueDateInput.addEventListener("change", (e) => {
            const selectedDate = e.target.value;
            task.dataset.dueDate = selectedDate;

            const date = new Date(selectedDate);
            const formattedDate = date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
            dueDateDisplay.textContent = `Vence: ${formattedDate}`;

            // Verificar si la fecha de vencimiento ha pasado
            if (date < new Date()) {
                dueDateDisplay.classList.add("overdue");
            } else {
                dueDateDisplay.classList.remove("overdue");
            }
        });

        task.appendChild(taskTitle);
        task.appendChild(taskDescription);
        task.appendChild(deleteTaskBtn);
        task.appendChild(attachFileBtn);
        task.appendChild(attachedFile);
        task.appendChild(colorPicker);
        task.appendChild(dueDateInput);
        task.appendChild(dueDateDisplay);
        taskList.appendChild(task);

        task.addEventListener("dragstart", (e) => {
            draggedTask = task;
            task.classList.add("dragging");
            e.dataTransfer.setData("text/plain", "");
        });

        task.addEventListener("dragend", () => {
            if (draggedTask) {
                draggedTask.classList.remove("dragging");
                draggedTask = null;
            }
        });
    };

    // Evento para agregar nueva tarea
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("addTaskBtn")) {
            const column = e.target.closest(".column");
            const taskList = column.querySelector(".taskList");
            createTask("Nueva Tarea", taskList, "Descripción...");
        }
    });

    // Agregar una nueva columna
    addColumnBtn.addEventListener("click", () => {
        createColumn("Nueva Columna", []);
    });

    // Eliminar todas las columnas
    clearBoardBtn.addEventListener("click", () => {
        board.innerHTML = "";
        localStorage.removeItem("trelloBoard");
    });

    // Guardar manualmente con el botón de "Guardar"
    saveBoardBtn.addEventListener("click", saveBoard);

    // Cargar el tablero al iniciar
    loadBoard();
});