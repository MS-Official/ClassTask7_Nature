let currentPhotoId = null;

$(document).ready(function () {
  // Section toggles
  $(".view-all-btn").on("click", function () {
    $("#addRecordSection").hide();
    $("#allRecordsSection").show();
    fetchAllRecords();
  });

  $(".add-new-btn").on("click", function () {
    $("#allRecordsSection").hide();
    $("#addRecordSection").show();
    $("#addRecordForm")[0].reset(); // Reset form when switching to "Add New Photo"
    currentPhotoId = null; // Clear any selected photo ID
    $("#addRecordForm").data("editId", null); // Clear form edit ID
    resetForm("Add New Photo", "Add Photo");
  });

  // To change the button and form titles 
  function resetForm(title, buttonLabel) {
    // Reset form and update titles
    $("#addRecordForm")[0].reset();
    $("#formTitle").text(title);
    $("#formSubmitButton").html(`<i class="fas fa-plus-circle me-1"></i> ${buttonLabel}`);
    currentPhotoId = null; // Clear any selected photo ID
  }

  // Fetch All Records
  function fetchAllRecords() {
    $.ajax({
      url: "./server/get_all_records.php",
      type: "GET",
      success: function (response) {
        const gallery = $("#gallery");
        gallery.empty();

        if (response.length > 0) {
          response.forEach((record) => {
            gallery.append(`
              <div class="col">
                <div class="card h-100 gallery-card shadow-sm" 
                     data-id="${record.id}" 
                     data-title="${record.title}" 
                     data-description="${record.description}" 
                     data-url="${record.url}" 
                     data-meta="Uploaded by: ${record.uploaded_by} | Date: ${
              record.date
            }">
                  <img src="${record.url}" class="card-img-top" alt="${
              record.title
            }">
                  <div class="card-body">
                    <h5 class="card-title text-truncate">${record.title}</h5>
                    <p class="card-text small text-muted mb-0">${
                      record.uploaded_by
                    }</p>
                    <p class="card-text small text-muted">${new Date(
                      record.date
                    ).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            `);
          });

          // Add click event to gallery cards
          $(".gallery-card").on("click", function () {
            const id = $(this).data("id");
            const title = $(this).data("title");
            const description = $(this).data("description");
            const url = $(this).data("url");
            const meta = $(this).data("meta");

            $("#modalTitle").text(title);
            $("#modalDescription").text(description);
            $("#modalImage").attr("src", url);
            $("#modalMeta").text(meta);

            currentPhotoId = id; // Store current photo ID
            $("#imagePreviewModal").modal("show");
          });
        } else {
          gallery.append('<p class="text-center">No photos found.</p>');
        }
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch photos.",
          footer: "Please try again later.",
        });
      },
    });
  }

  // Add New Record
  $("#addRecordForm").on("submit", function (e) {
    e.preventDefault();

    // Prepare form data
    const recordData = {
      id: $("#addRecordForm").data("editId") || null, // Use the existing ID for editing, null for new
      title: $("#title").val(),
      description: $("#description").val(),
      url: $("#url").val(),
      uploaded_by: $("#uploaded_by").val(),
      date: $("#date").val(),
    };

    const endpoint = recordData.id
      ? "./server/edit_record.php"
      : "./server/add_record.php";

    // Send POST request
    $.ajax({
      url: endpoint,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(recordData),
      success: function (response) {
        const res = JSON.parse(response);

        if (
          res.message === "Record updated successfully" ||
          res.message === "Record added successfully"
        ) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: res.message,
            footer: "Record updated in the gallery.",
          });

          $("#addRecordForm")[0].reset();
          $("#addRecordSection").hide();
          $("#allRecordsSection").show();
          fetchAllRecords(); // Refresh the gallery
        }
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to save the record.",
          footer: "Please try again later.",
        });
      },
    });

    // Clear the edit ID after submission
    $("#addRecordForm").data("editId", null);
  });

  // Delete Photo functionality
  $("#deletePhoto").on("click", function () {
    if (currentPhotoId) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this photo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: "./server/delete_record.php",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ id: currentPhotoId }),
            success: function (response) {
              const res = JSON.parse(response);

              if (res.message === "Record deleted successfully") {
                Swal.fire({
                  icon: "success",
                  title: "Deleted!",
                  text: res.message,
                  footer: "Photo removed from the gallery.",
                });

                $("#imagePreviewModal").modal("hide");
                fetchAllRecords();
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "Failed to delete photo.",
                  footer: "Please try again.",
                });
              }
            },
            error: function () {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error deleting photo.",
                footer: "Please try again later.",
              });
            },
          });
        }
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "No photo selected",
        text: "Please select a photo to delete.",
      });
    }
  });

  // Edit Photo functionality
  $("#editPhoto").on("click", function () {
    if (currentPhotoId) {
      // Fetch the record details for editing
      $.ajax({
        url: "./server/get_record.php", // Endpoint to fetch a specific record
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ id: currentPhotoId }), // Send the selected record ID
        success: function (response) {
          const res = JSON.parse(response);
          if(res.id){
            $("#title").val(res.title);
            $("#description").val(res.description);
            $("#url").val(res.url);
            $("#uploaded_by").val(res.uploaded_by);
            $("#date").val(res.date);

            $("#addRecordForm").data("editId", res.id); // Set edit ID

            // Update form title and button for editing
            $("#formTitle").text("Update Photo Details");
            $("#formSubmitButton").html('<i class="fas fa-save me-1"></i> Update Photo');

            $("#addRecordSection").show();
            $("#allRecordsSection").hide();
            $("#imagePreviewModal").modal("hide");
          }
        },
        error: function () {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch record for editing.",
            footer: "Please try again.",
          });
        },
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "No record selected",
        text: "Please select a record to edit.",
      });
    }
  });

  // Initial load
  $(".view-all-btn").trigger("click");
});
