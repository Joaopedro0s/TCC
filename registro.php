<?php
// Forçar exibição de erros (apenas desenvolvimento)
ini_set('display_errors', 0);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once 'conexao.php';

try {
    $data = json_decode(file_get_contents('php://input'));
    
    if (!$data) {
        throw new Exception("Dados inválidos");
    }

    // Validação dos dados
    if (empty($data->nome)) throw new Exception("Nome é obrigatório");
    if (empty($data->usuario)) throw new Exception("Usuário é obrigatório");
    if (empty($data->senha)) throw new Exception("Senha é obrigatória");

    // Verifica se usuário existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE usuario = ?");
    $stmt->bind_param("s", $data->usuario);
    $stmt->execute();
    
    if ($stmt->get_result()->num_rows > 0) {
        throw new Exception("Usuário já existe");
    }

    // Cria hash da senha
    $senhaHash = password_hash($data->senha, PASSWORD_DEFAULT);

    // Insere novo usuário
    $stmt = $conn->prepare("INSERT INTO usuarios (nome, usuario, senha) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $data->nome, $data->usuario, $senhaHash);
    
    if (!$stmt->execute()) {
        throw new Exception("Erro ao registrar usuário");
    }

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Usuário registrado com sucesso'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'sucesso' => false,
        'erro' => $e->getMessage()
    ]);
}
?>