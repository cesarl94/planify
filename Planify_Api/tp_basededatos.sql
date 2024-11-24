-- Creacion de base de datos
CREATE SCHEMA `tp_basededatos`;

-- Creacion de tablas

CREATE TABLE Tareas (
  id_tarea INT AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(250),
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_limite DATETIME,
  orden INT,
  prioridad INT,
  id_estado INT,
  PRIMARY KEY (id_tarea),
  FOREIGN KEY (id_estado) REFERENCES Estados(id_estado) ON DELETE CASCADE,
);

CREATE TABLE Usuarios (
  id_usuario INT AUTO_INCREMENT,
  correo VARCHAR(250) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  foto_perfil TEXT,
  verificado BOOLEAN,
  PRIMARY KEY (id_usuario)
);

CREATE TABLE Estados (
  id_estado INT AUTO_INCREMENT,
  orden INT,
  nombre VARCHAR(50) NOT NULL
  PRIMARY KEY (id_estado)
);

CREATE TABLE Usuarios_Tareas (
  id_relacion INT AUTO_INCREMENT,
  id_usuario INT,
  id_tarea INT,
  PRIMARY KEY (id_relacion),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_tarea) REFERENCES Tareas(id_tarea) ON DELETE CASCADE
);

-- Insertar datos a la base base de datos

INSERT INTO Usuarios (correo, nombre, apellido) VALUES 
('usuario1@example.com', 'Juan', 'Pérez'),
('usuario2@example.com', 'Ana', 'López'),
('usuario3@example.com', 'Luis', 'García');


INSERT INTO Tareas (nombre, descripcion, fecha_limite, id_estado) VALUES 
('Tarea 1', 'Descripción de la Tarea 1', '2024-12-31', 1),
('Tarea 2', 'Descripción de la Tarea 2', '2024-11-30', 2),
('Tarea 3', 'Descripción de la Tarea 3', '2024-10-31', 3);
('Tarea 4', 'Descripción de la Tarea 4', '2024-10-31', 3);

INSERT INTO Estados (nombre) VALUES 
('Backlog'),
('To Do'),
('In Process');
('Done');


INSERT INTO Usuarios_Tareas (id_usuario, id_tarea) VALUES 
(1, 1),  -- Juan tiene Tarea 1
(1, 2),  -- Juan tiene Tarea 2
(2, 2),  -- Ana tiene Tarea 2
(2, 3),  -- Ana tiene Tarea 3
(3, 1);  -- Luis tiene Tarea 1
