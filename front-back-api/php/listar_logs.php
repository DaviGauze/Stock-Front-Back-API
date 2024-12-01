<?php
require 'banco.php';

header('Content-Type: application/json');

$sql = "SELECT * FROM log";
$qry = $conexao->prepare($sql);

try {
    $qry->execute();
    $logs = $qry->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($logs);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error', 
        'message' => $e->getMessage()
    ]);
}
?>
