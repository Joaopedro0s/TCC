<?php
require_once 'conexao.php';

$data = json_decode(file_get_contents("php://input"));

$nome = $data->nome;
$usuario = $data->usuario;
$senha = sha1($data->senha); // Criptografia SHA1 (melhor usar password_hash() em produção)

$sql = "INSERT INTO usuarios (nome, usuario, senha) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $nome, $usuario, $senha);

if ($stmt->execute()) {
    echo json_encode(["sucesso" => true]);
} else {
    echo json_encode(["sucesso" => false]);
}

$conn->close();
?>