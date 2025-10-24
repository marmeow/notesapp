// https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch
// https://web.dev/articles/fetch-api-error-handling?hl=es-419 -> try catch

// url de api(?)
async function fetchNotes() {
  try {
    const res = await fetch("http://localhost:8000/notes");
    const notes = await res.json();
    createNote(notes);
    fetchNota();
    update(notes);

  } catch (error) {
    console.error("Error en carregar les notes: ", error);
  }
}
fetchNotes();

async function fetchNota() {
  document.querySelectorAll(".nota").forEach(function (elem) {
    elem.addEventListener("click", async function () {
      const noteId = elem.getAttribute("data-id");
      try {
        const res = await fetch(`http://localhost:8000/notes/${noteId}`);
        const nota = await res.json();
        mostrarDetalle(nota);
      } catch (error) {
        console.error("Error en carregar les notes: ", error);
      }
    });
  });
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
                      ${createNumTasksDiv(nota)}
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
          <div class="detail task-details-top flex">
            <i class="fa-solid fa-list-check fa-sm text-secondary"></i>
            <p class="task-num-top">${nota.numTasks}</p>
          </div>
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

function createNumTasksDiv(nota) {
  let i = 0;
  nota.tasks.forEach(element => {
    if (element.isDone) {
      i++;
    }
  });

  let numTasksDiv = "";
  if (nota.has_tasks) {
    numTasksDiv = `
        <div class="detail task-details flex">
            <i class="fa-solid fa-list-check fa-sm text-secondary"></i>
            <p class="task-num">${i}/${nota.tasks_id.length}</p>
        </div>
        `;
  }
  return numTasksDiv;
}

function createNumLinksDiv(nota) {
  let numLinksDiv = "";
  if (nota.num_links !== 0) {
    numLinksDiv = `
        <div class="detail link-details flex">
            <i class="fa-solid fa-link fa-sm text-secondary"></i>
            <p class="task-num">${nota.num_links}</p>
        </div>
        `;
  }
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



function mostrarDetalle(nota) {
  const notebook = document.getElementById("notebook");
  notebook.innerHTML = `
    ${crearInfoNotebook(nota)}
    ${crearContentNota(nota)}
  `;
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
      <img src="images/livingroom.jpg" alt="Imatge menjador">
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
    const labelClass = obtenerClaseTipo(elem.tipus);

    tasks += `
      <div class="task-wrapper ${selectedClass}">
        <i class="icono bi bi-grip-vertical"></i>
        <div class="task-nota">
          <label class="check ${labelClass}">
            <input type="checkbox" ${checkedAttr}>
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
  });

  return tasks;
}

function obtenerClaseTipo(tipo) {
  switch (tipo) {
    case "Project": return "project-check";
    case "Personal": return "personal-check";
    case "Other": return "other-check";
    default: return "default-check";
  }
}

function crearDeadline(task) {
  let deadline = "";
  if (task.deadline) {
    deadline = `<div class="flex"><i class="fa-solid fa-flag-checkered fa-sm text-secondary"></i><p class="deadline">Deadline <span class="date-deadline">${task.deadline}</span></p></div>`;
  }
  return deadline;
}

function crearReminder(task) {
  let reminder = "";
  if (task.reminder) {
    reminder = `<div class="flex alarm"><i class="fa-solid fa-alarm-clock fa-sm text-secondary"></i><p class="alarm-day">${task.reminder}</p></div>`;
  }
  return reminder;
}

function crearEditTools(task) {
  let editTools = "";
  if (task.is_selected) {
    editTools = `<div class="edit-tools flex">
        <i class="fa-solid fa-alarm-clock fa-sm text-secondary"></i>
        <i class="fa-solid fa-flag-checkered fa-sm text-secondary"></i>
        <i class="fa-solid fa-flag fa-sm text-secondary"></i>
        <i class="fa-solid fa-pen fa-sm text-secondary"></i>
        <i class="fa-solid fa-trash fa-sm text-secondary"></i>
      </div>`;
  }
  return editTools;
}
