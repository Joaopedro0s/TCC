<?php
header("Access-Control-Allow-Origin: *");

$servidor = "localhost";
$usuario = "root";       // Padrão do WAMP
$senha = "";             // Padrão do WAMP (vazia)
$banco = "k4math";       // Nome do seu banco

try {
    $conn = new mysqli($servidor, $usuario, $senha, $banco);
    
    if ($conn->connect_error) {
        throw new Exception("Conexão falhou: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8mb4");
} catch (Exception $e) {
    http_response_code(500);
    die(json_encode(["erro" => $e->getMessage()]));
}
?>