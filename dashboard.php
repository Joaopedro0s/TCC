<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit();
}

$usuario_id = $_SESSION['usuario_id'];
$registros = obterRegistrosUsuario($usuario_id);

include 'includes/header.php';
?>

<div class="container">
    <h2>Meu Dashboard</h2>
    
    <div class="row">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    Minhas Atividades Recentes
                </div>
                <div class="card-body">
                    <?php if (empty($registros)): ?>
                        <p>Nenhuma atividade registrada ainda.</p>
                    <?php else: ?>
                        <ul class="list-group">
                            <?php foreach ($registros as $registro): ?>
                                <li class="list-group-item">
                                    <?= $registro['atividade'] ?> - 
                                    <?= $registro['unidade'] ?> - 
                                    <?= $registro['acerto'] ? '✅ Acerto' : '❌ Erro' ?> - 
                                    <small><?= date('d/m/Y H:i', strtotime($registro['data_registro'])) ?></small>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    Registrar Nova Atividade
                </div>
                <div class="card-body">
                    <form method="POST" action="registrar_atividade.php">
                        <div class="form-group">
                            <label>Atividade:</label>
                            <input type="text" name="atividade" required class="form-control">
                        </div>
                        
                        <div class="form-group">
                            <label>Unidade:</label>
                            <select name="unidade" class="form-control">
                                <option value="Unidade 1">Unidade 1</option>
                                <option value="Unidade 2">Unidade 2</option>
                                <option value="Unidade 3">Unidade 3</option>
                            </select>
                        </div>
                        
                        <div class="form-group form-check">
                            <input type="checkbox" name="acerto" id="acerto" class="form-check-input">
                            <label for="acerto" class="form-check-label">Acertou?</label>
                        </div>
                        
                        <button type="submit" class="btn btn-success">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>