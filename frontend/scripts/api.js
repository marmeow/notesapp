// https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch
// https://web.dev/articles/fetch-api-error-handling?hl=es-419 -> try catch

document.addEventListener("DOMContentLoaded", () => {
  fetchNotes();
});

// url de api(?)
async function fetchNotes() {
  try {
    const res = await fetch("http://localhost:8000/notes");
    const notes = await res.json();
    createNote(notes);
    update(notes);
    noteEvents(notes);
    fetchNota(1);

  } catch (error) {
    console.error("Error en carregar les notes: ", error);
  }
}

function noteEvents() {
  const notePanel = document.getElementById("note-panel");
  const closeBtn = document.querySelector(".close");

  document.querySelectorAll(".nota").forEach(note => {
    note.addEventListener("click", function () {
      const noteId = note.getAttribute("data-id");
      fetchNota(noteId);

      if (window.innerWidth <= 1080 && notePanel && closeBtn) {
        closeBtn.style.display = "block";
        notePanel.style.display = "flex";
      }
    });
  });
}

async function fetchNota(noteId) {
  try {
    const res = await fetch(`http://localhost:8000/notes/${noteId}`);
    const nota = await res.json();

    document.querySelectorAll(".nota").forEach(elem => {
      elem.classList.remove("active");
    });

    const activeElem = document.querySelector(`.nota[data-id="${noteId}"]`);
    if (activeElem) {
      activeElem.classList.add("active");
    }

    mostrarDetail(nota);
  } catch (error) {
    console.error("Error en carregar la nota: ", error);
  }
}

function eventsCheckbox() {

  // Volver a seleccionar después de clonar
  const checkboxes = document.querySelectorAll("input[type=\"checkbox\"][data-task-id]");

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", async () => {
      const taskId = parseInt(checkbox.getAttribute("data-task-id"));
      const noteId = parseInt(checkbox.getAttribute("data-note-id"));
      const isChecked = checkbox.checked;

      // Actualizar en el servidor
      await updateTaskStatus(noteId, taskId, isChecked);

      // Actualizar TODOS los contadores de esta nota (top y bottom)
      updateTaskCounters(noteId, taskId, isChecked);
    });
  });
}

function updateTaskCounters(noteId) {
  // Buscar todas las notas en el DOM
  const allNotes = document.querySelectorAll(`.nota[data-id="${noteId}"]`);

  allNotes.forEach(noteElement => {
    // Encontrar todos los contadores de tareas en esta nota (top y bottom)
    const taskCounters = noteElement.querySelectorAll(`.task-details[data-nota-id="${noteId}"] .task-num-top`);

    // Contar las tareas completadas
    const checkboxes = document.querySelectorAll(`input[type="checkbox"][data-note-id="${noteId}"]`);
    let completedCount = 0;
    let totalCount = 0;

    checkboxes.forEach(cb => {
      totalCount++;
      if (cb.checked) {
        completedCount++;
      }
    });

    // Actualizar todos los contadores
    taskCounters.forEach(counter => {
      counter.textContent = `${completedCount}/${totalCount}`;
    });
  });
}


async function updateTaskStatus(noteId, taskId, isChecked) {
  try {
    const res = await fetch(`http://localhost:8000/notes/${noteId}/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_done: isChecked }), // Asegúrate de enviar 'is_done'
    });
    const updatedTask = await res.json();
    console.log("Tarea actualizada:", updatedTask);
  } catch (error) {
    console.error("Error al actualitzar la task:", error);
  }
}


function createNote(notes) {
  const container = document.querySelector(".llista-notes");
  container.innerHTML = ""; // limpiar todo lo que habia (para el Loading...)
  notes.forEach(nota => {
    const { imgPreviewDiv, typeInner, widthText } = createImgPreviewDiv(nota);

    const article = document.createElement("article");
    article.className = "nota flex";
    article.setAttribute("data-id", nota.id);

    if (nota.isActive) {
      article.classList.add("active");
    }

    article.innerHTML = `
      <div class="text-note ${widthText}">
          <div class="inner ${typeInner}">
              <h3 class="note-title">${nota.titol}</h3>
              <p class="note-preview">${nota.contingut.slice(0, 60)}.</p>
                <div class="details-time flex">
                    <div class="details flex">
                      ${createNumTasksDiv(nota, false)}
                      ${createNumLinksDiv(nota)}
                      ${createTag(nota)}
                    </div>
                    <div class="time flex">
                        <div class="detail notebook-details flex">
                          <p class="time-detail">${nota.time}</p>
                        </div>
                        <div class="detail notebook-details flex">
                          <i class="fa-solid fa-book fa-sm text-secondary"></i>
                          <p class="task-num">${nota.notebook}</p>
                        </div>
                        ${createExtraDetailsDiv(nota)}
                    </div>
                </div>
          </div>
      </div>
        ${imgPreviewDiv}

      <div class="detail extra-details-top flex w100">
          ${createNumTasksDiv(nota, true)}
          <p class="time-detail-top">${nota.time}</p>
                  
          ${createExtraDetailsDiv(nota)}
          
      </div>
    `;

    container.appendChild(article);
  });
}



function createTag(nota) {
  let tagDiv = "";
  if (nota.tags) {
    let tagsNum = "";
    if (nota.num_tags !== 0) {
      tagsNum = `
      <p class="tag-amount">+ <span class="tag-num">${nota.num_tags}</span></p>
      `;
    }

    tagDiv = `
    <div class="detail tag-details flex">
      <div class="tag flex ${nota.tags.toLowerCase()}">
        <i class="fa-solid fa-tag fa-sm"></i>
        <p class="task-num">${nota.tags}</p>
      </div>
      ${tagsNum}
    </div>
    `;
  }
  return tagDiv;
}



function createNumTasksDiv(nota, isTop) {
  if (!nota.has_tasks || !nota.tasks_id || nota.tasks_id.length === 0) {
    return "";
  }

  function countCompletedTasks() {
    let completedCount = 0;
    nota.tasks.forEach(task => {
      if (nota.tasks_id.includes(task.id) && task.is_done) {
        completedCount++;
      }
    });
    return completedCount;
  }

  const topClass = isTop ? "extra-details-top" : "";
  const initialCount = countCompletedTasks();
  const tasksHTML = `<div class="detail task-details ${topClass} flex" data-nota-id="${nota.id}" data-is-top="${isTop}">
    <i class="fa-solid fa-list-check fa-sm text-secondary"></i>
    <p class="task-num-top">${initialCount}/${nota.tasks_id.length}</p>
  </div>`;

  return tasksHTML;
}





function createNumLinksDiv(nota) {
  let numLinksDiv = nota.num_links ? `
        <div class="detail link-details flex">
            <i class="fa-solid fa-link fa-sm text-secondary"></i>
            <p class="task-num">${nota.num_links}</p>
        </div>
        `: "";
  return numLinksDiv;
}

function createExtraDetailsDiv(nota) {
  let extraDetailsDiv = "";
  if (nota.hasAlarm && nota.isShared) {
    extraDetailsDiv = ` 
            <div class="detail extra-details flex">
                <i class="fa-solid fa-users fa-sm text-primary"></i>
                <i class="fa-solid fa-alarm-clock fa-sm text-primary"></i>
            </div>`;
  } else if (nota.hasAlarm) {
    extraDetailsDiv = ` 
            <div class="detail extra-details flex">
                <i class="fa-solid fa-alarm-clock fa-sm text-primary"></i> 
            </div>`;
  } else if (nota.isShared) {
    extraDetailsDiv = ` 
            <div class="detail extra-details flex">
              <i class="fa-solid fa-users fa-sm text-primary"></i>
            </div>`;
  }

  return extraDetailsDiv;
}
function createImgPreviewDiv(nota) {
  let imgPreviewDiv = "";
  let typeInner = "inner-noImg";
  let widthText = "w100";

  if (nota.images && nota.images.length > 0) {
    imgPreviewDiv = ` 
      <div class="w25 img-note-preview flex">
        <div class="inner">
          <img src="images/${nota.images[0]}" alt="Note preview image" />
        </div>
      </div>`;
    typeInner = "inner-withImg";
    widthText = "w75";
  }

  return {
    imgPreviewDiv,
    typeInner,
    widthText
  };
}


function update(notes) {
  const numNotes = document.querySelector(".num-notes");
  numNotes.textContent = notes.length;
}


/*----- CREAR DETALL NOTA -----*/


function mostrarDetail(nota) {
  const notebook = document.getElementById("notebook");
  notebook.innerHTML = `
    ${crearInfoNotebook(nota)}
    ${crearContentNota(nota)}
  `;
  eventsCheckbox();
}

function crearInfoNotebook(nota) {
  return `
    <div class="info-notebook flex">
      <div class="name flex">
        <i class="fa-solid fa-book fa-sm text-secondary"></i>
        <h5 class="title-notebook">${nota.notebook}</h5>
      </div>
      <div class="last-edit flex">
        <p>Last edited on <span class="date-edit">${nota.last_edit}</span></p>
      </div>
    </div>
  `;
}

function crearContentNota(nota) {
  return `
    <div class="note-content">
      <h2 class="title-note">${nota.titol}</h2>
      <p class="p-note">${nota.contingut}</p>
      ${mostrarLink(nota)}
      <div class="tasks-nota">
        ${crearTasks(nota)}
        <button class="btn btn-addtask"><i class="fa fa-plus fa-sm"></i> Add task</button>
      </div>
      ${crearImages(nota)}
    </div>
  `;
}

function mostrarLink(nota) {
  return nota.link ? `<a href="#">${nota.link}</a>` : "";
}

function crearTasks(nota) {
  let tasks = "";

  nota.tasks.forEach(elem => {
    const selectedClass = elem.is_selected ? "selected" : "";
    const checkedAttr = elem.is_done ? "checked" : "";
    const labelClass = getTag(elem.tipus);

    if (nota.tasks_id.includes(elem.id)) {
      tasks += `
        <div class="task-wrapper ${selectedClass}">
          <i class="icono bi bi-grip-vertical"></i>
          <div class="task-nota">
            <label class="check ${labelClass}">
              <input type="checkbox" ${checkedAttr}
                data-task-id="${elem.id}"
                data-note-id="${nota.id}">
              <span class="checkmark"></span>
              ${elem.titol}
            </label>
            <div class="deadline-info flex">
              <div class="date-stuff flex">
                ${crearDeadline(elem)}
                ${crearReminder(elem)}
              </div>
              ${crearEditTools(elem)}
            </div>
          </div>
        </div>
      `;
    }
  });

  return tasks;
}


function getTag(tipo) {
  switch (tipo) {
    case "Project": return "project-check";
    case "Personal": return "personal-check";
    case "Other": return "other-check";
    default: return "default-check";
  }
}

function crearDeadline(task) {
  let deadline = task.deadline ? `<div class="flex"><i class="fa-solid fa-flag-checkered fa-sm text-secondary"></i><p class="deadline">Deadline <span class="date-deadline">${task.deadline}</span></p></div>` : "";
  return deadline;
}

function crearReminder(task) {
  let reminder = task.reminder ? `<div class="flex alarm"><i class="fa-solid fa-alarm-clock fa-sm text-secondary"></i><p class="alarm-day">${task.reminder}</p></div>` : "";
  return reminder;
}

function crearEditTools(task) {
  let editTools = task.is_selected ? `<div class="edit-tools flex">
        <i class="fa-solid fa-alarm-clock fa-sm text-secondary"></i>
        <i class="fa-solid fa-flag-checkered fa-sm text-secondary"></i>
        <i class="fa-solid fa-flag fa-sm text-secondary"></i>
        <i class="fa-solid fa-pen fa-sm text-secondary"></i>
        <i class="fa-solid fa-trash fa-sm text-secondary"></i>
      </div>`: "";

  return editTools;
}


function crearImages(nota) {
  let imgs = "";
  if (nota.images && nota.images.length > 0) {
    nota.images.forEach(elem => {
      imgs += `<img src="images/${elem}" alt="Imatge ${elem}"></img>`;
    });
  }
  return imgs;

}

