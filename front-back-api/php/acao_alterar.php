<?php
require 'banco.php';

header('Content-Type: application/json');

$id = $_GET['id'];
$simbolo = $_GET['simbolo'];
$preco = $_GET['preco'];
$variacao = $_GET['variacao'];
$nome = $_GET['nome'];

$sql = "UPDATE acoes SET simbolo = :simbolo, preco = :preco, variacao = :variacao, nome = :nome WHERE id = :id";
$qry = $conexao->prepare($sql);
$qry->bindParam(':id', $id, PDO::PARAM_INT);
$qry->bindParam(':simbolo', $simbolo, PDO::PARAM_STR);
$qry->bindParam(':preco', $preco, PDO::PARAM_STR);
$qry->bindParam(':variacao', $variacao, PDO::PARAM_STR);
$qry->bindParam(':nome', $nome, PDO::PARAM_STR);

try {
    $qry->execute();
    $nr = $qry->rowCount();
    echo json_encode(['status' => 'success', 'message' => 'Ação alterada com sucesso', 'rows_affected' => $nr]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
