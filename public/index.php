<?php
// Habilita CORS para permitir acesso externo
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

// Simulação de uma função em PHP
function minhaFuncaoPhp() {
    return [
        "status" => "sucesso",
        "mensagem" => "Olá do servidor PHP (Replit)! Hora: " . date("H:i:s")
    ];
}

// Envia a resposta JSON
echo json_encode(minhaFuncaoPhp());
//echo "Olá do servidor PHP (Replit)! Hora: " . date("H:i:s");
?>
