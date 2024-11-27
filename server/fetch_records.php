<?php
header('Content-Type: application/json');
$records = json_decode(file_get_contents('../data/gallery.json'), true);

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    foreach ($records as $record) {
        if ($record['id'] === $id) {
            echo json_encode($record);
            exit;
        }
    }
    echo json_encode(["error" => "Record not found"]);
} else {
    echo json_encode($records);
}
?>
