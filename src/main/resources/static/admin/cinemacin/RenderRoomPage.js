function initRoomPage() {
  const roomLink = document.getElementById("room-management-link");
    if (roomLink) {
      roomLink.addEventListener("click", renderRoomManagementPage());
    }
};
window.initRoomPage = initRoomPage;

