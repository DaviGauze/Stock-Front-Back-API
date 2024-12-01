<?php
require 'banco.php';

header('Content-Type: application/json');

$id = $_GET['id'];
$sql = "SELECT * FROM acoes WHERE id = :id";
$qry = $conexao->prepare($sql);
$qry->bindParam(':id', $id, PDO::PARAM_INT);

try {
    $qry->execute();
    $registros = $qry->fetchAll(PDO::FETCH_OBJ);

    if (!$registros) {
        echo json_encode([]);
    } else {
        error_log("Dados da ação: " . print_r($registros, true));
        echo json_encode($registros);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
