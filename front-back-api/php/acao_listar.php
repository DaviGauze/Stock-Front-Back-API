<?php
    require 'banco.php';

    $sql = "select * from acoes order by id";
    $qry = $conexao-> prepare($sql);
    $qry->execute();
    $registros = $qry->fetchAll(PDO::FETCH_OBJ);
    echo json_encode($registros);
?>