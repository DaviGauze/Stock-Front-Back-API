<?php
require 'banco.php';

header('Content-Type: application/json');

$simbolo = $_GET['simbolo'];
$sql = "SELECT * FROM acoes WHERE simbolo LIKE :simbolo ORDER BY id";
$qry = $conexao->prepare($sql);
$qry->bindValue(':simbolo', "%$simbolo%", PDO::PARAM_STR);

try {
    $qry->execute();
    $registros = $qry->fetchAll(PDO::FETCH_OBJ);

    if (!$registros) {
        echo json_encode([]); 
    } else {
        echo json_encode($registros);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
