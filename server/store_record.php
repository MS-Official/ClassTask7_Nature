<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $filePath = '../data/gallery.json';
    $records = json_decode(file_get_contents($filePath), true);

    $data['id'] = end($records)['id'] + 1;  // Generate a new unique ID
    $records[] = $data;

    if (file_put_contents($filePath, json_encode($records, JSON_PRETTY_PRINT))) {
        echo json_encode(["success" => "Record added successfully"]);
    } else {
        echo json_encode(["error" => "Failed to save record"]);
    }
} else {
    echo json_encode(["error" => "Invalid input"]);
}
?>
