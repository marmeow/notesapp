
initNotePanel();
initSidebar();
initDropdownMenu();
initTaskModal();


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



function initTaskModal() {
    // TASK MODAL 
    const modal = document.querySelector(".myModal");
    const btn = document.querySelector(".closeTask");
    const deadlineCheck = document.getElementById("deadlineCheck");
    const deadlineInput = document.getElementById("deadline");
    const lbl = document.querySelector(".deadlinelbl");

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-addtask") ||
            e.target.closest(".btn-addtask")) {
            modal.style.display = "block";
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
            deadlineInput.style.backgroundColor = "var(-color-bg-light)";
        } else {
            lbl.style.color = "#909191";
            deadlineInput.style.backgroundColor = "#90919132";
        }
    });


    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };



}
