function showSharedModal(title, contentBody, image = null) {
    document.getElementById('sharedModalTitle').textContent = title;
    document.getElementById('sharedModalBody').innerHTML = contentBody;

    const imageContainer = document.getElementById('sharedModalImage');
    if (image && imageContainer) {
        imageContainer.innerHTML = image;
        imageContainer.style.display = "block";
    } else if (imageContainer) {
        imageContainer.innerHTML = "";
        imageContainer.style.display = "none";
    }

    const modalElement = document.getElementById('sharedModal');
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.show();
}
