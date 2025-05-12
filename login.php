<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'conexao.php';

$data = json_decode(file_get_contents("php://input"));

$usuario = $data->usuario;
$senha = $data->senha;

$sql = "SELECT id, nome, senha, nivel FROM usuarios WHERE usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (password_verify($senha, $row['senha'])) {
        echo json_encode([
            "sucesso" => true,
            "usuario" => [
                "id" => $row['id'],
                "nome" => $row['nome'],
                "nivel" => $row['nivel']
            ]
        ]);
    } else {
        echo json_encode(["sucesso" => false, "mensagem" => "Senha incorreta"]);
    }
} else {
    echo json_encode(["sucesso" => false, "mensagem" => "Usuário não encontrado"]);
}

$conn->close();
?>