// https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch
// https://web.dev/articles/fetch-api-error-handling?hl=es-419 -> try catch

// url de api(?)
async function fetchNotes () {
  try {
    const res = await fetch("http://localhost:8000/notes");
    const notes = await res.json();
    createNote(notes);
    update(notes);
  } catch (error) {
    console.error("Error en carregar les notes: ", error);
  }
}
fetchNotes();


function createNote (notes) {
  const container = document.querySelector(".llista-notes");
  container.innerHTML = ""; // limpiar todo lo que habia (para el Loading...)
  notes.forEach(nota => {
    const { imgPreviewDiv, typeInner, widthText } = createImgPreviewDiv(nota);

    const article = document.createElement("article");
    article.className = "nota flex";

    if (nota.isActive) {
      article.classList.add("active");
    }

    article.innerHTML = `
      <div class="text-note ${widthText}">
          <div class="inner ${typeInner}">
              <h3 class="note-title">${nota.titol}</h3>
              <p class="note-preview">${nota.contingut}.</p>
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

function createTag (nota) {
  let tagDiv = "";
  if (nota.tags) {
    let tagsNum = "";
    if (nota.numTags !== 0) {
      tagsNum = `
      <p class="tag-amount">+ <span class="tag-num">${nota.numTags}</span></p>
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

function createNumTasksDiv (nota) {
  let i = 0;
  nota.tasks.forEach(element => {
    if (element.isDone) {
      i++;
    }
  });

  let numTasksDiv = "";
  if (nota.hasTasks) {
    numTasksDiv = `
        <div class="detail task-details flex">
            <i class="fa-solid fa-list-check fa-sm text-secondary"></i>
            <p class="task-num">${i}/${nota.tasks_id.length}</p>
        </div>
        `;
  }
  return numTasksDiv;
}

function createNumLinksDiv (nota) {
  let numLinksDiv = "";
  if (nota.numLinks !== 0) {
    numLinksDiv = `
        <div class="detail link-details flex">
            <i class="fa-solid fa-link fa-sm text-secondary"></i>
            <p class="task-num">${nota.numLinks}</p>
        </div>
        `;
  }
  return numLinksDiv;
}

function createExtraDetailsDiv (nota) {
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

function createImgPreviewDiv (nota) {
  let imgPreviewDiv = "";
  let typeInner = "inner-noImg";
  let widthText = "w100";
  console.log(nota.images[0])
  if (nota.imgPreview) {
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

function update (notes) {
  const numNotes = document.querySelector(".num-notes");
  numNotes.textContent = notes.length;
}

function createDetail (notes) {
  document.querySelectorAll(".nota").forEach(function (elem) {
    elem.addEventListener("click", function (e) {
      const notebook = document.getElementById("notebook");
      notebook.innerHTML = "";
    });
  });
}
