
initNotePanel();
initSidebar();
initDropdownMenu();



function initNotePanel() {
    const notePanel = document.getElementById("note-panel");
    const closeBtn = document.querySelector(".close");

    function updateNotePanelDisplay() {
        if (window.innerWidth > 1080) {
            notePanel.style.display = "flex";
            closeBtn.style.display = "none";
        } else {
            notePanel.style.display = "none";
            closeBtn.style.display = "none";
        }
    }

    function handleNoteClick() {
        if (window.innerWidth <= 1080) {
            closeBtn.style.display = "block";
            notePanel.style.display = "flex";
        }
    }

    document.querySelectorAll(".nota").forEach(function (note) {
        note.addEventListener("click", handleNoteClick);
    });

    closeBtn.addEventListener("click", function (e) {
        if (window.innerWidth <= 1080) {
            e.stopPropagation();
            notePanel.style.display = "none";
            closeBtn.style.display = "none";
        }
    });

    window.addEventListener("resize", updateNotePanelDisplay);
    updateNotePanelDisplay();
}



function initSidebar() {

    //https://www.w3schools.com/howto/howto_js_off-canvas.asp
    const openBtn = document.querySelector(".active-first-sidebar");
    const closeBtn2 = document.querySelector(".closebtn");
    const sidebar = document.getElementById("secondary-sidebar");
    const overlay = document.getElementById("overlay");

    openBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.innerWidth < 480) {
            sidebar.style.width = "250px";
            overlay.style.display = "block"; // Show overlay
        }
    });

    closeBtn2.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.innerWidth <= 480) {
            sidebar.style.width = "0";
            overlay.style.display = "none";
        }
    });

    overlay.addEventListener("click", function () {
        if (window.innerWidth <= 480) {
            sidebar.style.width = "0";
            overlay.style.display = "none";
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 480) {
            sidebar.style.width = "";
            overlay.style.display = "none";
        }
    });
}


function initDropdownMenu() {
    //https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_dropdown_right
    const dropdownButton = document.querySelector(".dropdown .dropbtn");
    const dropdownMenu = document.querySelector(".dropdown .dropdown-content");

    dropdownButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Evita que el evento se propague
        dropdownMenu.classList.toggle("show");
    });

    // Cierra el menú si haces click fuera
    window.addEventListener("click", function () {
        if (dropdownMenu.classList.contains("show")) {
            dropdownMenu.classList.remove("show");
        }
    });

}



// https://www.w3schools.com/howto/howto_js_draggable.asp

function initTaskModal() {
    // TASK MODAL 
    const modal = document.querySelector(".myModal");
    const btn = document.querySelector(".closeTask");
    const deadlineCheck = document.getElementById("deadlineCheck");
    const deadlineInput = document.getElementById("deadline");
    const lbl = document.querySelector(".deadlinelbl");
    const time = document.getElementById("appointment");
    const reminder = document.getElementById("reminder");

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-addtask") ||
            e.target.closest(".btn-addtask")) {
            modal.style.display = "block";
            deadlineCheck.checked = true;
            deadlineInput.style.backgroundColor = "var(--color-bg-light)";
            time.style.backgroundColor = "var(--color-bg-light)";
            reminder.value = "hour";
            lbl.style.color = "var(--color-accent)";
        }
    });

    if (btn) {
        btn.onclick = function () {
            modal.style.display = "none";
        };
    }

    deadlineCheck.addEventListener("change", function () {
        if (deadlineCheck.checked) {
            lbl.style.color = "var(--color-accent)";
            deadlineInput.style.backgroundColor = "var(--color-bg-light)";
            time.style.backgroundColor = "var(--color-bg-light)";
            reminder.value = "hour";

        } else {
            lbl.style.color = "#909191";
            deadlineInput.style.backgroundColor = "#90919132";
            time.style.backgroundColor = "#90919132";
            reminder.value = "none";
        }
    });


    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
/* function dragElement(modal) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(modal.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(modal.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        modal.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        modal.style.top = (modal.offsetTop - pos2) + "px";
        modal.style.left = (modal.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
} 
dragElement(modal); */

initTaskModal();