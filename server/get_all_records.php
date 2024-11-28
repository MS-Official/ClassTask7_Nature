
<?php
// Read the JSON file
$data = file_get_contents('../data/gallery.json');

// Decode the JSON data into an array
$records = json_decode($data, true);

// Return the records as a JSON response
header('Content-Type: application/json');
echo json_encode($records);
?>
