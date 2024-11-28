<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Get the data from the POST request
$data = json_decode(file_get_contents('php://input'), true);

// Validate the input
if (isset($data['id'])) {
    $id = $data['id'];
    $file = '../data/gallery.json';

    // Ensure the file exists
    if (!file_exists($file)) {
        echo json_encode(["message" => "File not found"]);
        exit;
    }

    // Read data from the JSON file
    $records = json_decode(file_get_contents($file), true);

    // Find the record by ID
    $record = array_filter($records, function ($item) use ($id) {
        return $item['id'] === $id;
    });

    if (!empty($record)) {
        // Return the first matched record
        echo json_encode(array_values($record)[0]);
    } else {
        echo json_encode(["message" => "Record not found"]);
    }
} else {
    echo json_encode(["message" => "Invalid request: ID is required"]);
}
?>
