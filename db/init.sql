CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `mail` varchar(255) UNIQUE,
  `password` varchar(255),
  `role` ENUM('ADMIN', 'COLABORADOR', 'USER'),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `portafolio` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int UNIQUE NOT NULL,
  `total_value` decimal(10,2),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `bonos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `type` ENUM('CETE', 'tasa_fija'),
  `valor_nominal` decimal(10,2),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `posiciones` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `portafolio_id` int NOT NULL,
  `bono_id` int NOT NULL,
  `cantidad` int,
  `precio_promedio` decimal(10,2),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `transacciones` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `bono_id` int NOT NULL,
  `tipo` ENUM('compra', 'venta'),
  `cantidad` int,
  `precio` decimal(10,2),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE UNIQUE INDEX `posiciones_index_0`
ON `posiciones` (`portafolio_id`, `bono_id`);

ALTER TABLE `portafolio`
ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `posiciones`
ADD FOREIGN KEY (`portafolio_id`) REFERENCES `portafolio` (`id`);

ALTER TABLE `posiciones`
ADD FOREIGN KEY (`bono_id`) REFERENCES `bonos` (`id`);

ALTER TABLE `transacciones`
ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `transacciones`
ADD FOREIGN KEY (`bono_id`) REFERENCES `bonos` (`id`);


INSERT INTO users (name, mail, password, role)
VALUES (
  'Mari',
  'admin@gmail.com',
  '1234',
  'ADMIN'
);



