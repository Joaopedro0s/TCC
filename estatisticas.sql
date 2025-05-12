CREATE TABLE `estatisticas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `unidade` INT NOT NULL,
  `acertos` INT DEFAULT 0,
  `erros` INT DEFAULT 0,
  `ultima_atualizacao` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_unidade` (`id_usuario`, `unidade`),
  CONSTRAINT `fk_usuario` FOREIGN KEY (`id_usuario`) 
    REFERENCES `usuarios` (`id`) 
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;