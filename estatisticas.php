<?php
require_once 'conexao.php';

$data = json_decode(file_get_contents("php://input"));

$id_usuario = $data->id_usuario;
$unidade = $data->unidade;
$tipo = $data->tipo; // 'acerto' ou 'erro'

// Verifica se já existe registro
$sql = "SELECT id FROM estatisticas WHERE id_usuario = ? AND unidade = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $id_usuario, $unidade);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Atualiza estatística existente
    $campo = ($tipo == 'acerto') ? 'acertos' : 'erros';
    $sql = "UPDATE estatisticas SET $campo = $campo + 1 WHERE id_usuario = ? AND unidade = ?";
} else {
    // Cria novo registro
    $acertos = ($tipo == 'acerto') ? 1 : 0;
    $erros = ($tipo == 'erro') ? 1 : 0;
    $sql = "INSERT INTO estatisticas (id_usuario, unidade, acertos, erros) VALUES (?, ?, ?, ?)";
}

$stmt = $conn->prepare($sql);
if (strpos($sql, 'UPDATE') !== false) {
    $stmt->bind_param("ii", $id_usuario, $unidade);
} else {
    $stmt->bind_param("iiii", $id_usuario, $unidade, $acertos, $erros);
}

if ($stmt->execute()) {
    echo json_encode(["sucesso" => true]);
} else {
    echo json_encode(["sucesso" => false]);
}

$conn->close();
?>