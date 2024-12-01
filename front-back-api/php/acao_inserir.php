<?php
require 'banco.php';

header('Content-Type: application/json');

$simbolo = $_GET['simbolo'];
$preco = $_GET['preco'];
$variacao = $_GET['variacao'];
$nome = $_GET['nome'];
$data_atualizacao = date('Y-m-d H:i:s');

if (!is_numeric($preco) || !is_numeric($variacao)) {
    error_log("Dados inválidos: Preço - $preco, Variação - $variacao");
    echo json_encode(['status' => 'error', 'message' => 'Preço ou variação inválidos']);
    exit();
}

if (empty($simbolo) || empty($preco) || $variacao === null || empty($nome)) {
    echo json_encode(['status' => 'error', 'message' => 'Campos obrigatórios estão vazios']);
    exit();
}

try {
    $sql = "INSERT INTO acoes (simbolo, preco, variacao, data_atualizacao, nome) 
            VALUES (:simbolo, :preco, :variacao, :data_atualizacao, :nome)";
    $qry = $conexao->prepare($sql);
    $qry->bindParam(':simbolo', $simbolo, PDO::PARAM_STR);
    $qry->bindParam(':preco', $preco, PDO::PARAM_STR);
    $qry->bindParam(':variacao', $variacao, PDO::PARAM_STR);
    $qry->bindParam(':data_atualizacao', $data_atualizacao, PDO::PARAM_STR);
    $qry->bindParam(':nome', $nome, PDO::PARAM_STR);

    $qry->execute();
    echo json_encode(['status' => 'success', 'message' => 'Ação inserida com sucesso']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
