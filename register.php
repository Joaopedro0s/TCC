<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING);
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $senha = $_POST['senha'];
    
    // Validações
    if (empty($nome) || empty($username) || empty($email) || empty($senha)) {
        $_SESSION['erro'] = "Todos os campos são obrigatórios!";
    } elseif (!$email) {
        $_SESSION['erro'] = "E-mail inválido!";
    } elseif (strlen($senha) < 6) {
        $_SESSION['erro'] = "A senha deve ter pelo menos 6 caracteres!";
    } else {
        try {
            // Verifica se username ou email já existem
            $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE username = ? OR email = ?");
            $stmt->execute([$username, $email]);
            
            if ($stmt->rowCount() > 0) {
                $_SESSION['erro'] = "Username ou e-mail já cadastrados!";
            } else {
                // Registra o novo usuário
                $hashed_password = password_hash($senha, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO usuarios (nome, username, email, senha) VALUES (?, ?, ?, ?)");
                
                if ($stmt->execute([$nome, $username, $email, $hashed_password])) {
                    $_SESSION['sucesso'] = "Registro realizado com sucesso! Faça login.";
                    header("Location: login.php");
                    exit();
                }
            }
        } catch(PDOException $e) {
            $_SESSION['erro'] = "Erro ao registrar: " . $e->getMessage();
        }
    }
}

include 'includes/header.php';
?>

<div class="container">
    <h2>Registro de Usuário</h2>
    
    <?php if (isset($_SESSION['erro'])): ?>
        <div class="alert alert-danger"><?= $_SESSION['erro']; unset($_SESSION['erro']); ?></div>
    <?php endif; ?>
    
    <form method="POST">
        <div class="form-group">
            <label>Nome Completo:</label>
            <input type="text" name="nome" required class="form-control" value="<?= $_POST['nome'] ?? '' ?>">
        </div>
        
        <div class="form-group">
            <label>Nome de Usuário:</label>
            <input type="text" name="username" required class="form-control" value="<?= $_POST['username'] ?? '' ?>">
        </div>
        
        <div class="form-group">
            <label>E-mail:</label>
            <input type="email" name="email" required class="form-control" value="<?= $_POST['email'] ?? '' ?>">
        </div>
        
        <div class="form-group">
            <label>Senha (mínimo 6 caracteres):</label>
            <input type="password" name="senha" required minlength="6" class="form-control">
        </div>
        
        <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
    
    <p class="mt-3">Já tem conta? <a href="login.php">Faça login aqui</a></p>
</div>

<?php include 'includes/footer.php'; ?>