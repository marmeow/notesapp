
document.addEventListener("DOMContentLoaded", function () {
    const notePanel = document.getElementById("note-panel");
    const closeBtn = document.querySelector(".close");

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
        e.stopPropagation();
        notePanel.style.display = "none";
        closeBtn.style.display = "none";
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 1080) {
            notePanel.style.display = "";
            closeBtn.style.display = "";
        }
    });


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

    //https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_dropdown_right
    const dropdownButton = document.querySelector(".dropdown .dropbtn");
    const dropdownMenu = document.querySelector(".dropdown .dropdown-content");

    dropdownButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Evita que el evento se propague
        dropdownMenu.classList.toggle("show");
    });

    // Cierra el menú si haces clic fuera
    window.addEventListener("click", function () {
        if (dropdownMenu.classList.contains("show")) {
            dropdownMenu.classList.remove("show");
        }
    });

});




