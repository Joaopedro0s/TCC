<?php
// includes/functions.php

require_once 'config.php';

function registrarUsuario($nome, $usuario, $senha) {
    global $pdo;
    
    try {
        $hashed_password = password_hash($senha, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO usuarios (nome, usuario, senha) VALUES (?, ?, ?)");
        $stmt->execute([$nome, $usuario, $hashed_password]);
        return $pdo->lastInsertId();
    } catch(PDOException $e) {
        error_log("Erro ao registrar usuário: " . $e->getMessage());
        return false;
    }
}

function registrarAtividade($usuario_id, $atividade, $unidade, $acerto) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("INSERT INTO registros_atividades 
                              (usuario_id, atividade, unidade, acerto) 
                              VALUES (?, ?, ?, ?)");
        return $stmt->execute([$usuario_id, $atividade, $unidade, $acerto ? 1 : 0]);
    } catch(PDOException $e) {
        error_log("Erro ao registrar atividade: " . $e->getMessage());
        return false;
    }
}

function atualizarProgresso($usuario_id, $progresso) {
    global $pdo;
    
    try {
        $progresso_json = json_encode($progresso);
        $stmt = $pdo->prepare("UPDATE usuarios SET progresso_json = ? WHERE id = ?");
        return $stmt->execute([$progresso_json, $usuario_id]);
    } catch(PDOException $e) {
        error_log("Erro ao atualizar progresso: " . $e->getMessage());
        return false;
    }
}

function obterRegistrosUsuario($usuario_id, $limit = 10) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM registros_atividades 
                              WHERE usuario_id = ? 
                              ORDER BY data_registro DESC 
                              LIMIT ?");
        $stmt->execute([$usuario_id, $limit]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        error_log("Erro ao obter registros: " . $e->getMessage());
        return [];
    }
}
?>