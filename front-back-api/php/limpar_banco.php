<?php
require 'banco.php';

header('Content-Type: application/json');

$sql = "DELETE FROM acoes";
$qry = $conexao->prepare($sql);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método inválido']);
}

try {
    $qry->execute();
    $nr = $qry->rowCount();
    echo json_encode([
        'status' => 'success', 
        'message' => 'Ação excluída com sucesso', 
        'rows_affected' => $nr
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error', 
        'message' => $e->getMessage()
    ]);
}
?>
