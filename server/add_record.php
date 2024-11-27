<!-- c. Add a New Record (PHP)

Create a PHP file to handle adding new records to the JSON file. It will accept POST requests with the data to be added.

PHP File  -->

<?php
// Get the data from the POST request
$data = json_decode(file_get_contents('php://input'), true);

// Check if data is valid
if (isset($data['title'], $data['description'], $data['image'], $data['date_added'], $data['category'])) {
    // Read the existing data from the JSON file
    $file = 'data.json';
    $existingData = json_decode(file_get_contents($file), true);

    // Generate a new ID for the record
    $newId = count($existingData) + 1;

    // Add the new record with the new ID
    $newRecord = [
        "id" => $newId,
        "title" => $data['title'],
        "description" => $data['description'],
        "image" => $data['image'],
        "date_added" => $data['date_added'],
        "category" => $data['category']
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
