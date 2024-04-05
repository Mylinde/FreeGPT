const sidebar = document.querySelector(".sidebar");
const menuButton = document.querySelector(".menu-button");

function toggleSidebar(event) {
    if (sidebar.classList.contains("shown")) {
        hideSidebar(event.target);
    } else {
        showSidebar(event.target);
    }
    window.scrollTo(0, 0);
}

function showSidebar(target) {
    sidebar.classList.add("shown");
    target.classList.add("rotated");
    document.body.style.overflow = "hidden";
}

function hideSidebar(target) {
    sidebar.classList.remove("shown");
    target.classList.remove("rotated");
    document.body.style.overflow = "auto";
}

menuButton.addEventListener("click", toggleSidebar);

document.body.addEventListener('click', function(event) { 
   if (!event.target.closest('.sidebar') && !event.target.closest('.menu-button') && !event.target.closest('.conversation-sidebar') && !event.target.closest('.popup .popuptext')) {
        hideSidebar(event.target);
}
   if (event.target.matches(['.conversation-title','.chat','#sidebar-button','#sidebar-button > span','#sidebar-button > .material-icons-round'])) {
        const menuButtonStyle = window.getComputedStyle(menuButton);
        if (menuButtonStyle.display !== 'none') {
            hideSidebar(menuButton);
        }
}
});
