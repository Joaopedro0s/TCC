<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'conexao.php';

$data = json_decode(file_get_contents("php://input"));

$nome = $data->nome;
$usuario = $data->usuario;
$senha = password_hash($data->senha, PASSWORD_DEFAULT); // Criptografia segura

// Verifica se usuário já existe
$sql = "SELECT id FROM usuarios WHERE usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["sucesso" => false, "mensagem" => "Usuário já existe"]);
    exit();
}

// Insere novo usuário
$sql = "INSERT INTO usuarios (nome, usuario, senha) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $nome, $usuario, $senha);

if ($stmt->execute()) {
    echo json_encode(["sucesso" => true]);
} else {
    echo json_encode(["sucesso" => false, "mensagem" => "Erro no banco de dados"]);
}

$conn->close();
?>