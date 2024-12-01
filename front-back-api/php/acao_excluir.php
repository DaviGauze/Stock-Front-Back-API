<?php
require 'banco.php';

header('Content-Type: application/json');

if ($conexao) {
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $sql = "DELETE FROM acoes WHERE id = :id";
        $qry = $conexao->prepare($sql);
        $qry->bindParam(':id', $id, PDO::PARAM_INT);

        try {
            $qry->execute();
            $nr = $qry->rowCount();
            if ($nr > 0) {
                echo json_encode([
                    'status' => 'success', 
                    'message' => 'Ação excluída com sucesso', 
                    'rows_affected' => $nr
                ]);
            } else {
                echo json_encode([
                    'status' => 'error', 
                    'message' => 'Nenhuma ação encontrada com o id fornecido.'
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                'status' => 'error', 
                'message' => $e->getMessage()
            ]);
        }
    } else {
        echo json_encode([
            'status' => 'error', 
            'message' => 'ID da ação não fornecido.'
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro na conexão com o banco de dados.'
    ]);
}
?>
