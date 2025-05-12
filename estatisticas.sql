CREATE TABLE `estatisticas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `unidade` int(11) NOT NULL,
  `corretas` int(11) NOT NULL DEFAULT 0,
  `erradas` int(11) NOT NULL DEFAULT 0,
  `ultima_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_unidade` (`usuario_id`,`unidade`),
  CONSTRAINT `estatisticas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;