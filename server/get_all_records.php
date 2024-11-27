<!-- a. Get All Records (PHP)

Create a PHP file to fetch all records from the JSON file and return them as a JSON response.

PHP File -->


<?php
// Read the JSON file
$data = file_get_contents('data.json');

// Decode the JSON data into an array
$records = json_decode($data, true);

// Return the records as a JSON response
header('Content-Type: application/json');
echo json_encode($records);
?>
