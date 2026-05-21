CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  lastname VARCHAR(255),
  maternallast VARCHAR(255),
  birthdate DATE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'COLABORADOR', 'USER') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portafolio (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE NOT NULL,
  cash_balance DECIMAL(10,2) DEFAULT 0,     -- Fondos libres
  cetes_balance DECIMAL(10,2) DEFAULT 0,    -- Total invertido en CETES
  bonds_balance DECIMAL(10,2) DEFAULT 0,   -- Total invertido en bonos
  total_balance DECIMAL(10,2) DEFAULT 0,     -- Total invertido en otros bonos
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE bonos (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('CETE', 'tasa_fija') NOT NULL,
  valor_nominal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cetes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  fecha_vencimiento DATE NOT NULL,
  plazo INT NOT NULL,
  tasa_compra DECIMAL(5, 2) NOT NULL,
  monto_invertido DECIMAL(10, 2) NOT NULL,
  portafolio_id BIGINT NOT NULL,

  FOREIGN KEY (portafolio_id) REFERENCES portafolio(id)
);

/*CREATE TABLE posiciones (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  portafolio_id BIGINT NOT NULL,
  bono_id BIGINT NOT NULL,
  cantidad INT DEFAULT 0,
  precio_promedio DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (portafolio_id) REFERENCES portafolio(id),
  FOREIGN KEY (bono_id) REFERENCES bonos(id),

  UNIQUE KEY posiciones_unique (portafolio_id, bono_id)
);*/

CREATE TABLE transacciones (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  bono_id BIGINT,
  tipo ENUM('DEPOSITO', 'RETIRO', 'COMPRA', 'VENTA') NOT NULL,
  monto DECIMAL(10,2) DEFAULT 0, -- Para depositos/retros
  descripcion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (bono_id) REFERENCES bonos(id) -- Puede ser NULL para depositos/retiros
);

INSERT INTO users (name, lastname, maternallast, email, password, role)
VALUES

('Admin', 'Istrador', 'DelSistema', 'admin@gmail.com', '$2a$10$Qsq5WB7IsEp77xkz0U52Cuyh9fcK89veH6AXhs9NZQ2/05CdJeeCy', 'ADMIN'),
('Yamato', 'User', 'Normal', 'user@gmail.com', '$2a$10$Qsq5WB7IsEp77xkz0U52Cuyh9fcK89veH6AXhs9NZQ2/05CdJeeCy', 'USER'),
('Colab', 'Orador', 'DelSistema', 'colab@gmail.com', '$2a$10$Qsq5WB7IsEp77xkz0U52Cuyh9fcK89veH6AXhs9NZQ2/05CdJeeCy', 'COLABORADOR');


-- Creamos los portafolios con el diseño detallado
INSERT INTO portafolio (user_id, cash_balance, cetes_balance, bonds_balance, total_balance, created_at) VALUES
(1, 0, 0, 0, 0, NOW()),
(2, 0, 0, 0, 0, NOW()),
(3, 0, 0, 0, 0, NOW());