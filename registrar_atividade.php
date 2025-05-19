<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit();
}

$usuario_id = $_SESSION['usuario_id'];
$atividade = filter_input(INPUT_POST, 'atividade', FILTER_SANITIZE_STRING);
$unidade = filter_input(INPUT_POST, 'unidade', FILTER_SANITIZE_STRING);
$acerto = isset($_POST['acerto']);

if (registrarAtividade($usuario_id, $atividade, $unidade, $acerto)) {
    $_SESSION['sucesso'] = "Atividade registrada com sucesso!";
} else {
    $_SESSION['erro'] = "Erro ao registrar atividade.";
}

header("Location: dashboard.php");
exit();
?>