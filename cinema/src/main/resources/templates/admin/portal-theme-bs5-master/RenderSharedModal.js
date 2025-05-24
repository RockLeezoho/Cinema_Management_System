function showSharedModal(title, contentBody, image) {
    document.getElementById('sharedModalTitle').textContent = title;
    document.getElementById('sharedModalBody').innerHTML = contentBody;
    document.getElementById('sharedModalImage').innerHTML = image;

    const modalElement = document.getElementById('sharedModal');
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.show();
}
