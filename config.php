<?php
// includes/config.php

// Configurações do banco de dados
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // Altere para seu usuário MySQL
define('DB_PASS', ''); // Altere para sua senha MySQL
define('DB_NAME', 'k4math'); // Nome do banco de dados

// Mostrar erros (apenas em desenvolvimento)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Conexão com o banco de dados
try {
    $pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8mb4");
} catch(PDOException $e) {
    die("ERRO: Não foi possível conectar. " . $e->getMessage());
}

// Inicia a sessão
session_start();
?>