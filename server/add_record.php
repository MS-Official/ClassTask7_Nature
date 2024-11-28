<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Get the data from the POST request
$data = json_decode(file_get_contents('php://input'), true);

// Check if data is valid
if (isset($data['title'], $data['description'], $data['url'], $data['date'], $data['uploaded_by'])) {
    // Read the existing data from the JSON file
    $file = '../data/gallery.json';

    // Ensure the file exists or create it
    if (!file_exists($file)) {
        file_put_contents($file, json_encode([]));
    }

    $existingData = json_decode(file_get_contents($file), true);

    // Generate a new ID for the record
    $newId = count($existingData) + 1;

    // Get the current date in ISO 8601 format
    $currentDate = date('Y-m-d\TH:i:s');

    // Add the new record with the new ID
    $newRecord = [
        "title" => $data['title'],
        "description" => $data['description'],
        "url" => $data['url'],
        "uploaded_by" => $data['uploaded_by'],
        "date" => $currentDate,
        "id" => $newId,
    ];

    // Add the new record to the existing data array
    $existingData[] = $newRecord;

    // Save the updated data back to the JSON file
    file_put_contents($file, json_encode($existingData, JSON_PRETTY_PRINT));

    echo json_encode(["message" => "Record added successfully", "id" => $newId]);
} else {
    echo json_encode(["message" => "Invalid data"]);
}
?>