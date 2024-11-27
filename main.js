// Load all records on page load
window.onload = () => {
    fetch('server/fetch_records.php')
        .then(response => response.json())
        .then(data => displayGallery(data));
};

// Display gallery
function displayGallery(data) {
    const galleryDiv = document.getElementById('gallery');
    galleryDiv.innerHTML = '';
    data.forEach(record => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${record.title}</h3>
            <p>${record.description}</p>
            <img src="${record.url}" alt="${record.title}" width="200">
            <p>Uploaded By: ${record.uploaded_by}</p>
            <p>Date: ${record.date}</p>
            <button onclick="updatePhoto(${record.id})">Update</button>
            <button onclick="deletePhoto(${record.id})">Delete</button>
        `;
        galleryDiv.appendChild(div);
    });
}

// ------------- CRUD Opearation -------------

// Handle form submission
document.getElementById('addPhotoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const newPhoto = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        url: document.getElementById('url').value,
        uploaded_by: document.getElementById('uploaded_by').value,
        date: new Date().toISOString().split('T')[0]
    };

    fetch('server/store_record.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhoto)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Display SweetAlert
                Swal.fire({
                    title: 'Success!',
                    text: 'Photo added successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000
                });

                // Launch Confetti
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });

                // Reload gallery
                fetch('server/fetch_records.php')
                    .then(res => res.json())
                    .then(updatedData => displayGallery(updatedData));
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: data.error || 'Failed to add photo.',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            }
        });
});

// Update
function updatePhoto(id) {
    const updatedPhoto = {
        id: id,
        title: prompt('Enter new title:'),
        description: prompt('Enter new description:')
    };

    fetch('server/update_record.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPhoto)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetch('server/fetch_records.php')
                    .then(res => res.json())
                    .then(updatedData => initializeGallery(updatedData));
            }
        });
}


// Delete

function deletePhoto(id) {
    fetch('server/delete_record.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetch('server/fetch_records.php')
                    .then(res => res.json())
                    .then(updatedData => initializeGallery(updatedData));
            }
        });
}


// Update Gallery UI


