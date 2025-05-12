CREATE TABLE `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `usuario` VARCHAR(50) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `nivel` VARCHAR(20) DEFAULT 'Iniciante',
  `data_cadastro` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_unico` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;