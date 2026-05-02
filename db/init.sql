CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'COLABORADOR', 'USER') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portafolio (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE NOT NULL,
  total_value DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE bonos (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('CETE', 'tasa_fija') NOT NULL,
  valor_nominal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posiciones (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  portafolio_id BIGINT NOT NULL,
  bono_id BIGINT NOT NULL,
  cantidad INT DEFAULT 0,
  precio_promedio DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (portafolio_id) REFERENCES portafolio(id),
  FOREIGN KEY (bono_id) REFERENCES bonos(id),

  UNIQUE KEY posiciones_unique (portafolio_id, bono_id)
);

CREATE TABLE transacciones (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  bono_id BIGINT NOT NULL,
  tipo ENUM('compra', 'venta') NOT NULL,
  cantidad INT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (bono_id) REFERENCES bonos(id)
);

INSERT INTO users (name, email, password, role)
VALUES
('Admin', 'admin@gmail.com', '1234', 'ADMIN'),
('User', 'user@gmail.com', '1234', 'USER'),
('Colab', 'colab@gmail.com', '1234', 'COLABORADOR');