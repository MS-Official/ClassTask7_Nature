<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Get the data from the POST request
$data = json_decode(file_get_contents('php://input'), true);

// Check if the ID is provided
if (isset($data['id'])) { 
    // Read the existing data from the JSON file
    $file = '../data/gallery.json';

    // Ensure the file exists
    if (!file_exists($file)) {
        echo json_encode(["message" => "File not found"]);
        exit;
    }

    $existingData = json_decode(file_get_contents($file), true);

    // Find the index of the record to delete
    $recordIndex = array_search($data['id'], array_column($existingData, 'id'));

    if ($recordIndex !== false) {
        // Remove the record from the data array
        array_splice($existingData, $recordIndex, 1);

        // Save the updated data back to the JSON file
        file_put_contents($file, json_encode($existingData, JSON_PRETTY_PRINT));

        echo json_encode(["message" => "Record deleted successfully"]);
    } else {
        echo json_encode(["message" => "Record not found"]);
    }
} else {
    echo json_encode(["message" => "Invalid data: ID is required"]);
}
?>
