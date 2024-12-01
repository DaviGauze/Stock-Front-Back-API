<?php
require 'banco.php';

if (!isset($_GET['id'])) {
    echo json_encode(['erro' => 'ID é obrigatório']);
    exit();
}

$id = $_GET['id'];

echo "Valor do ID: " . $id . "\n";
echo "Conteúdo do array \$_GET: ";
print_r($_GET);

try {
    $sql = "INSERT INTO log (datahora, numeroregistros) VALUES (NOW(), :id)";
    $qry = $con->prepare($sql);
    $qry->bindParam(':id', $id, PDO::PARAM_INT);
    $qry->execute();

    echo json_encode(['linhas_inseridas' => $qry->rowCount()]);
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
}
?>
