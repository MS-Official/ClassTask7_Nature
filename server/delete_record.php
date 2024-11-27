<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if ($data && isset($data['id'])) {
    $currentData = json_decode(file_get_contents($file), true);
    $updatedData = array_filter($currentData, function ($record) use ($data) {
        return $record['id'] != $data['id'];
    });
    file_put_contents($file, json_encode(array_values($updatedData), JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
}
?>
