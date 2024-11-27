<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if ($data && isset($data['id'])) {
    $currentData = json_decode(file_get_contents($file), true);
    foreach ($currentData as &$record) {
        if ($record['id'] == $data['id']) {
            $record = array_merge($record, $data);
            file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT));
            echo json_encode(['success' => true]);
            exit;
        }
    }
    echo json_encode(['success' => false, 'error' => 'Record not found']);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
}
?>
