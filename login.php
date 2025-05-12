<?php
require_once 'conexao.php';

$data = json_decode(file_get_contents("php://input"));

$usuario = $data->usuario;
$senha = $data->senha;

$sql = "SELECT id, nome, nivel FROM usuarios WHERE usuario = ? AND senha = SHA1(?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $usuario, $senha);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        "sucesso" => true,
        "usuario" => $row
    ]);
} else {
    echo json_encode(["sucesso" => false]);
}

$conn->close();
?>