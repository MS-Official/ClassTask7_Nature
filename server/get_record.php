<!-- b. Get a Specific Record (PHP)

Create a PHP file that retrieves a single record based on a specific id passed via the GET request.

PHP File -->

<?php
// Get the ID from the query string
$id = isset($_GET['id']) ? $_GET['id'] : null;

if ($id) {
    // Read the JSON file
    $data = file_get_contents('data.json');
    // Decode the JSON data into an array
    $records = json_decode($data, true);
    
    // Find the record by ID
    foreach ($records as $record) {
        if ($record['id'] == $id) {
            echo json_encode($record);
            exit;
        }
    }
    echo json_encode(["message" => "Record not found"]);
} else {
    echo json_encode(["message" => "No ID provided"]);
}
?>
