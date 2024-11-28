<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Get the data from the POST request
$data = json_decode(file_get_contents('php://input'), true);

// Validate the incoming data
if (isset($data['id']) && isset($data['title']) && isset($data['description']) && isset($data['url']) && isset($data['uploaded_by']) && isset($data['date'])) {
    $id = $data['id'];
    $title = $data['title'];
    $description = $data['description'];
    $url = $data['url'];
    $uploaded_by = $data['uploaded_by'];
    $date = $data['date'];

    // Path to the JSON file
    $file = '../data/gallery.json';

    // Ensure the file exists
    if (!file_exists($file)) {
        echo json_encode(["message" => "File not found"]);
        exit;
    }

    // Read the existing data from the JSON file
    $existingData = json_decode(file_get_contents($file), true);

    // Find the index of the record to edit
    $recordIndex = array_search($id, array_column($existingData, 'id'));

    if ($recordIndex !== false) {
        // Update the record
        $existingData[$recordIndex]['title'] = $title;
        $existingData[$recordIndex]['description'] = $description;
        $existingData[$recordIndex]['url'] = $url;
        $existingData[$recordIndex]['uploaded_by'] = $uploaded_by;
        $existingData[$recordIndex]['date'] = $date;

        // Save the updated data back to the JSON file
        file_put_contents($file, json_encode($existingData, JSON_PRETTY_PRINT));

        echo json_encode(["message" => "Record updated successfully"]);
    } else {
        echo json_encode(["message" => "Record not found"]);
    }
} else {
    echo json_encode(["message" => "Invalid data: All fields are required"]);
}
?>
