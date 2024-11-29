-- Si la db ya existía, la eliminamos para luego volver a crearla
-- (De esta forma mantenemos actualizados los datos de la db de prueba
-- con lo maquetado acá)

DROP SCHEMA IF EXISTS `%DBNAME%`;

-- Creacion de base de datos

CREATE SCHEMA IF NOT EXISTS `%DBNAME%`;

-- Escogemos esta base de datos

USE `%DBNAME%`;

-- Creacion de tablas

CREATE TABLE IF NOT EXISTS Estados (
  id_estado INT AUTO_INCREMENT,
  orden INT NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_estado)
);

CREATE TABLE IF NOT EXISTS Usuarios (
  id_usuario INT AUTO_INCREMENT,
  correo VARCHAR(250) NOT NULL UNIQUE,
  hash VARCHAR(60) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  foto_perfil TEXT,
  verificado BOOLEAN,
  PRIMARY KEY (id_usuario)
);

CREATE TABLE IF NOT EXISTS Tareas (
  id_tarea INT AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(250),
  fecha_creacion DATETIME,
  fecha_limite DATETIME,
  orden INT NOT NULL,
  prioridad INT,
  id_estado INT,
  PRIMARY KEY (id_tarea),
  FOREIGN KEY (id_estado) REFERENCES Estados(id_estado) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Usuarios_Tareas (
  id_relacion INT AUTO_INCREMENT,
  id_usuario INT,
  id_tarea INT,
  PRIMARY KEY (id_relacion),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_tarea) REFERENCES Tareas(id_tarea) ON DELETE CASCADE
);

-- Insertar datos a la base base de datos

INSERT IGNORE INTO Estados (nombre, orden) VALUES ('Backlog', 0);
INSERT IGNORE INTO Estados (nombre, orden) VALUES ('To Do', 1);
INSERT IGNORE INTO Estados (nombre, orden) VALUES ('In Process', 2);
INSERT IGNORE INTO Estados (nombre, orden) VALUES ('Done', 3);

INSERT IGNORE INTO Usuarios (correo, hash, nombre, apellido) VALUES ('usuario1@example.com', '$2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa', 'Juan', 'Pérez');
INSERT IGNORE INTO Usuarios (correo, hash, nombre, apellido) VALUES ('usuario2@example.com', '$2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa', 'Ana', 'López');
INSERT IGNORE INTO Usuarios (correo, hash, nombre, apellido) VALUES ('usuario3@example.com', '$2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa', 'Luis', 'García');

INSERT IGNORE INTO Tareas (nombre, descripcion, fecha_limite, id_estado, orden) VALUES ('Tarea 1', 'Descripción de la Tarea 1', '2024-12-31', 1, 0);
INSERT IGNORE INTO Tareas (nombre, descripcion, fecha_limite, id_estado, orden) VALUES ('Tarea 2', 'Descripción de la Tarea 2', '2024-11-30', 2, 1);
INSERT IGNORE INTO Tareas (nombre, descripcion, fecha_limite, id_estado, orden) VALUES ('Tarea 3', 'Descripción de la Tarea 3', '2024-10-31', 3, 2);
INSERT IGNORE INTO Tareas (nombre, descripcion, fecha_limite, id_estado, orden) VALUES ('Tarea 4', 'Descripción de la Tarea 4', '2024-10-31', 3, 3);

INSERT IGNORE INTO Usuarios_Tareas (id_usuario, id_tarea) VALUES (1, 1);  -- Juan tiene Tarea 1
INSERT IGNORE INTO Usuarios_Tareas (id_usuario, id_tarea) VALUES (1, 2);  -- Juan tiene Tarea 2
INSERT IGNORE INTO Usuarios_Tareas (id_usuario, id_tarea) VALUES (2, 2);  -- Ana tiene Tarea 2
INSERT IGNORE INTO Usuarios_Tareas (id_usuario, id_tarea) VALUES (2, 3);  -- Ana tiene Tarea 3
INSERT IGNORE INTO Usuarios_Tareas (id_usuario, id_tarea) VALUES (3, 1);  -- Luis tiene Tarea 1
