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

    mostrarDetail(nota, noteId);
  } catch (error) {
    console.error("Error en carregar la nota: ", error);
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


async function updateTaskStatus(noteId, taskId, isChecked) {
  try {
    const res = await fetch(`http://localhost:8000/notes/${noteId}/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_done: isChecked }),
    });
    const updatedTask = await res.json();
    console.log("Tarea actualizada:", updatedTask);
  } catch (error) {
    console.error("Error al actualitzar la task:", error);
  }
}

function createNote(notes) {
  const container = document.querySelector(".llista-notes");
  container.innerHTML = "";

  // convertir el objeto de notas en un array de entries
  Object.entries(notes).forEach(([noteId, nota]) => {
    const { imgPreviewDiv, typeInner, widthText } = createImgPreviewDiv(nota);

    const article = document.createElement("article");
    article.className = "nota flex";
    article.setAttribute("data-id", noteId);

    if (nota.isActive) {
      article.classList.add("active");
    }

    article.innerHTML = `
      <div class="text-note ${widthText}">
          <div class="inner ${typeInner}">
              <h3 class="note-title">${nota.titol}</h3>
              <p class="note-preview">${nota.contingut.slice(0, 70)}.</p>
                <div class="details-time flex">
                    <div class="details flex">
                      ${createNumTasksDiv(nota, noteId, false)}
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
          ${createNumTasksDiv(nota, noteId, true)}
          <p class="time-detail-top">${nota.time}</p>
          ${createExtraDetailsDiv(nota)}
      </div>
    `;

    container.appendChild(article);
  });
}

/*--- ESTAT TASKS ---*/
function eventsCheckbox() {
  // controla eventos del checbox 
  const checkboxes = document.querySelectorAll("input[type=\"checkbox\"][data-task-id]");

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", async () => {
      const taskId = checkbox.getAttribute("data-task-id");
      const noteId = checkbox.getAttribute("data-note-id");
      const isChecked = checkbox.checked;

      updateTaskStatus(noteId, taskId, isChecked);
      updateTaskCounters(noteId);
    });
  });
}

function updateTaskCounters(noteId) {
  // actualiza contador 
  const noteElements = document.querySelectorAll(`.nota[data-id="${noteId}"]`);
  const checkboxes = document.querySelectorAll(`input[type="checkbox"][data-note-id="${noteId}"]`);

  let completedCount = 0;
  let totalCount = 0;

  checkboxes.forEach(cb => {
    totalCount++;
    if (cb.checked) completedCount++;
  });

  noteElements.forEach(elem => {
    const counters = elem.querySelectorAll(`.task-details[data-nota-id="${noteId}"] .task-num-top`);
    counters.forEach(counter => {
      counter.textContent = `${completedCount}/${totalCount}`;
    });
  });
}

function createNumTasksDiv(nota, noteId, isTop) {
  // crea el html inicial del contador 
  let completedCount = 0;

  Object.entries(nota.tasks).forEach(([taskId, task]) => {
    if (nota.tasks_id.includes(parseInt(taskId)) && task.is_done) {
      completedCount++;
    }
  });

  const totalCount = nota.tasks_id.length;
  const topClass = isTop ? "extra-details-top" : "";

  if (nota.has_tasks && totalCount > 0) {
    return `
      <div class="detail task-details ${topClass} flex" data-nota-id="${noteId}">
        <i class="fa-solid fa-list-check fa-sm text-secondary"></i>
        <p class="task-num-top">${completedCount}/${totalCount}</p>
      </div>
    `;
  }

  return "";
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
  // cpntar las claves del objeto en lugar de usar .length
  numNotes.textContent = Object.keys(notes).length;
}


/*----- CREAR DETALL NOTA -----*/

function mostrarDetail(nota, noteId) {
  const notebook = document.getElementById("notebook");
  notebook.innerHTML = `
    ${crearInfoNotebook(nota)}
    ${crearContentNota(nota, noteId)}
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

function crearContentNota(nota, noteId) {
  return `
    <div class="note-content">
      <h2 class="title-note">${nota.titol}</h2>
      <p class="p-note">${nota.contingut}</p>
      ${mostrarLink(nota)}
      <div class="tasks-nota">
        ${crearTasks(nota, noteId)}
        <button class="btn btn-addtask"><i class="fa fa-plus fa-sm"></i> Add task</button>
      </div>
      ${crearImages(nota)}
    </div>
  `;
}

function mostrarLink(nota) {
  return nota.link ? `<a href="#">${nota.link}</a>` : "";
}

function crearTasks(nota, noteId) {
  let tasks = "";

  Object.entries(nota.tasks).forEach(([taskId, task]) => {
    const selectedClass = task.is_selected ? "selected" : "";
    const checkedAttr = task.is_done ? "checked" : "";
    const labelClass = getTag(task.tipus);


    if (nota.tasks_id.includes(parseInt(taskId))) {
      tasks += `
        <div class="task-wrapper ${selectedClass}">
          <i class="icono bi bi-grip-vertical"></i>
          <div class="task-nota">
            <label class="check ${labelClass}">
              <input type="checkbox" ${checkedAttr}
                data-task-id="${taskId}"
                data-note-id="${noteId}">
              <span class="checkmark"></span>
              ${task.titol}
            </label>
            <div class="deadline-info flex">
              <div class="date-stuff flex">
                ${crearDeadline(task)}
                ${crearReminder(task)}
              </div>
              ${crearEditTools(task)}
            </div>
          </div>
        </div>
      `;
    }
  });

  return tasks;
}


function getTag(tipus) {
  switch (tipus.toLowerCase()) {
    case "project": return "project-check";
    case "personal": return "personal-check";
    case "other": return "other-check";
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