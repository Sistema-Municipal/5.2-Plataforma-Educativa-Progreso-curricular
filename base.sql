-- Crear tabla de Carreras
CREATE TABLE Carreras (
    id_carrera INT PRIMARY KEY AUTOINCREMENT,
    nombre_carrera VARCHAR(100) NOT NULL
);

-- Crear tabla de Módulos (Cada módulo pertenece a una carrera)
CREATE TABLE Modulos (
    id_modulo INT PRIMARY KEY AUTOINCREMENT,
    id_carrera INT,
    nombre_modulo VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_carrera) REFERENCES Carreras(id_carrera)
);

-- Crear tabla de Alumnos
CREATE TABLE Alumnos (
    id_alumno INT PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    id_carrera INT,
    FOREIGN KEY (id_carrera) REFERENCES Carreras(id_carrera)
);

-- Crear tabla de Progreso (Maneja las operaciones de lectura y escritura de avance)
CREATE TABLE ProgresoAlumno (
    id_alumno INT,
    id_modulo INT,
    estado_modulo VARCHAR(20) DEFAULT 'Pendiente', -- 'Pendiente' o 'Completado'
    PRIMARY KEY (id_alumno, id_modulo),
    FOREIGN KEY (id_alumno) REFERENCES Alumnos(id_alumno),
    FOREIGN KEY (id_modulo) REFERENCES Modulos(id_modulo)
);

-- --- INSERCIÓN DE DATOS DE PRUEBA ---
INSERT INTO Carreras (id_carrera, nombre_carrera) VALUES (1, 'Desarrollo de Software');

-- Insertamos 4 módulos para la carrera (para facilitar la prueba del porcentaje)
INSERT INTO Modulos (id_modulo, id_carrera, nombre_modulo) VALUES 
(11, 1, 'Introducción a la Programación'),
(12, 1, 'Bases de Datos I'),
(13, 1, 'Programación Orientada a Objetos'),
(14, 1, 'Desarrollo Web Frontend');

-- Alumno registrado en la carrera 1
INSERT INTO Alumnos (id_alumno, nombre, id_carrera) VALUES (501, 'Carlos Gómez', 1);

-- Inicializamos el progreso del alumno (Módulo 11 ya completado, el resto pendiente)
INSERT INTO ProgresoAlumno (id_alumno, id_modulo, estado_modulo) VALUES 
(501, 11, 'Completated'),
(501, 12, 'Pendiente'),
(501, 13, 'Pendiente'),
(501, 14, 'Pendiente');