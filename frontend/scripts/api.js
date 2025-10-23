// https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch 


// url de api(?) 
fetch("http://localhost:8001/notes")
    .then(res => res.json())  // recupera un archivo JSON a través de red (las notas)
    .then(notes => {  // una vez que los datos han sido convertidos a JSON, se maneja arry de notas
        crearNota(notes);  // crear las notas
        update(notes)
    });

function crearNota(notes) {
    const container = document.querySelector(".llista-notes");
    container.innerHTML = ""; // limpiar todo lo que habia (para el Loading...)
    notes.forEach(nota => {
        const article = document.createElement("article"); // crear  nuevo article para cada nota
        article.className = "nota flex";

        let tagDiv = "";
        if (nota.tags) {
            let tagsNum = ""
            if (nota.numTags !== 0) {
                tagsNum = `
                 <p class="tag-amount">+ <span class="tag-num">${nota.numTags}</span></p>
                `
            }

            tagDiv = `
                <div class="detail tag-details flex">
                    <div class="tag flex ${nota.tags.toLowerCase()}">
                        <i class="fa-solid fa-tag fa-sm"></i>
                        <p class="task-num">${nota.tags}</p>
                    </div>
                   ${tagsNum}
                </div>
            `
        }

        let numTasksDiv = "";
        if (nota.hasTasks) {
            numTasksDiv = `
            <div class="detail task-details flex">
                <i class="fa-solid fa-list-check fa-sm text-secondary"></i>
                <p class="task-num">${nota.numTasks}</p>
            </div>
            `
        }

        let numLinksDiv = "";
        if (nota.numLinks !== 0) {
            numLinksDiv = `
                <div class="detail link-details flex">
                    <i class="fa-solid fa-link fa-sm text-secondary"></i>
                    <p class="task-num">${nota.numLinks}</p>
                </div>
            `
        }

        let extraDetailsDiv = "";
        if (nota.hasAlarm && nota.isShared) {
            extraDetailsDiv = ` 
            <div class="detail extra-details flex">
                <i class="fa-solid fa-users fa-sm text-primary"></i>
                <i class="fa-solid fa-alarm-clock fa-sm text-primary"></i>
            </div>`
        } else if (nota.hasAlarm) {
            extraDetailsDiv = ` 
            <div class="detail extra-details flex">
                <i class="fa-solid fa-alarm-clock fa-sm text-primary"></i>
            </div>`
        } else if (nota.isShared) {
            extraDetailsDiv = ` 
            <div class="detail extra-details flex">
           <i class="fa-solid fa-users fa-sm text-primary"></i>
            </div>`
        }

        let imgPreviewDiv = "";
        let typeInner = "inner-noImg";
        let widthText = "w100"
        if (nota.imgPreview) {
            imgPreviewDiv = ` 
           <div class="w25 img-note-preview flex">
                <div class="inner">
                    <img src="images/${nota.imgPreview}" alt="Note preview image" />
                </div>
            </div>`;
            typeInner = "inner-withImg";
            widthText = "w75";
        }

        if (nota.isActive) {
            article.className = 'nota flex active';
        }

        article.innerHTML = `
        <div class="text-note ${widthText}">
                        <div class="inner ${typeInner}">
                            <h3 class="note-title">${nota.titol}</h3>
                            <p class="note-preview">${nota.preview}.</p>

                            <div class="details-time flex">
                                <div class="details flex">
                                    ${numTasksDiv}
                                    ${numLinksDiv}
                                    ${tagDiv}
                                </div>
                                <div class="time flex">
                                    <div class="detail notebook-details flex">
                                        <p class="time-detail">${nota.time}</p>
                                    </div>
                                    <div class="detail notebook-details flex">
                                        <i class="fa-solid fa-book fa-sm text-secondary"></i>
                                        <p class="task-num">${nota.notebook}</p>
                                    </div>
                                    ${extraDetailsDiv}
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
                        ${extraDetailsDiv}
                    </div>
                </article>
      `;

        container.appendChild(article);
    });
}


function update(notes) {
    const numNotes = document.querySelector(".num-notes");
    numNotes.textContent = notes.length;
}


document.querySelectorAll(".nota").addEventListener("click", () => {
    fetch("http://localhost:8001/api/v1/notes")
        .then(res => res.json())
        .then(notes => {
            crearNota(notes);
        })
        .catch(error => {
            console.error("Error al cargar las notas:", error);
        });
});

