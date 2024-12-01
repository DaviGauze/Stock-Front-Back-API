<?php
    echo 'Esse código é gerado pelo PHP';
    $x = 1;
    echo '<br>O dobro de X é'. $x*2;
    $familia = array("pai"=>"Joao", 
                     "mae" =>"Maria",
                     "filha"=>"Ana",
                     "filho"=>"Bruno");
    echo json_encode($familia);
    

?>