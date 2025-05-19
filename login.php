<?php
require_once 'includes/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $senha = $_POST['senha'];
    
    if ($email && !empty($senha)) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            $usuario = $stmt->fetch();
            
            if ($usuario && password_verify($senha, $usuario['senha'])) {
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['usuario_nome'] = $usuario['nome'];
                header("Location: dashboard.php");
                exit();
            } else {
                $_SESSION['erro'] = "E-mail ou senha incorretos!";
            }
        } catch(PDOException $e) {
            $_SESSION['erro'] = "Erro ao fazer login: " . $e->getMessage();
        }
    } else {
        $_SESSION['erro'] = "Por favor, preencha todos os campos corretamente!";
    }
}

include 'includes/header.php';
?>

<div class="container">
    <h2>Login</h2>
    
    <?php if (isset($_SESSION['erro'])): ?>
        <div class="alert alert-danger"><?= $_SESSION['erro']; unset($_SESSION['erro']); ?></div>
    <?php endif; ?>
    
    <form method="POST">
        <div class="form-group">
            <label>E-mail:</label>
            <input type="email" name="email" required class="form-control">
        </div>
        
        <div class="form-group">
            <label>Senha:</label>
            <input type="password" name="senha" required class="form-control">
        </div>
        
        <button type="submit" class="btn btn-primary">Entrar</button>
    </form>
    
    <p class="mt-3">Não tem conta? <a href="register.php">Registre-se aqui</a></p>
</div>

<?php include 'includes/footer.php'; ?>