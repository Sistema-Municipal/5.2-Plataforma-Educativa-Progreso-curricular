// SIMULACIÓN DE LA PERSISTENCIA DE DATOS (BASE DE DATOS EN MEMORIA)
const db_alumnos = {
    501: { id: 501, nombre: "Carlos Gómez", id_carrera: 1 }
};

const db_modulos_carrera = {
    11: { id_carrera: 1, nombre: "Introducción a la Programación" },
    12: { id_carrera: 1, nombre: "Bases de Datos I" },
    13: { id_carrera: 1, nombre: "Programación Orientada a Objetos" },
    14: { id_carrera: 1, nombre: "Desarrollo Web Frontend" }
};

// Tabla relacional de Progreso (Estado inicial)
let db_progreso_alumno = {
    "501-11": "Completado",
    "501-12": "Pendiente",
    "501-13": "Pendiente",
    "501-14": "Pendiente"
};

// Datos fijos del contexto de la sesión actual
const idAlumnoActual = 501;
const idCarreraActual = 1;

// CONTROLADORES DE INTERFAZ
const feedback = document.getElementById('feedback');
const progressBar = document.getElementById('progress-bar');
const progressPercentage = document.getElementById('progress-percentage');

// 1. CAPA DE INTERFAZ DE USUARIO (UI) - Acción Concreta
function enviarProgreso(idModulo) {
    // Datos enviados hacia la capa de procesamiento
    const payload = {
        idAlumno: idAlumnoActual,
        idCarrera: idCarreraActual,
        idModulo: idModulo,
        estadoModulo: "Completado"
    };

    // Envío simulado al proceso del Backend
    const resultadoBackend = backendProcesarProgreso(payload);

    // 4. RETORNO Y VISUALIZACIÓN (FEEDBACK)
    if (resultadoBackend.status === "success") {
        mostrarFeedback(resultadoBackend.msg, "success");
        
        // Actualización Visual en Pantalla del Módulo afectado
        actualizarModuloEnPantalla(idModulo);
        
        // Actualización Visual de la barra de progreso
        actualizarBarraDeProgreso(resultadoBackend.nuevoPorcentaje);
    } else {
        mostrarFeedback(resultadoBackend.msg, "error");
    }
}

// =======================================================
// CAPA 2: LÓGICA Y VALIDACIÓN DE DATOS (BACKEND SIMULADO)
// =======================================================
function backendProcesarProgreso(datos) {
    const { idAlumno, idCarrera, idModulo, estadoModulo } = datos;

    // VALIDACIÓN 1: Verificar que el alumno exista en la base de datos
    if (!db_alumnos[idAlumno]) {
        return { status: "error", msg: "Alumno no encontrado." };
    }

    // VALIDACIÓN 2: Comprobar que el módulo pertenezca a la carrera del alumno
    const moduloEncontrado = db_modulos_carrera[idModulo];
    if (!moduloEncontrado || moduloEncontrado.id_carrera !== idCarrera) {
        return { status: "error", msg: "El módulo no corresponde a la carrera." };
    }

    // VALIDACIÓN 3: Verificar que el módulo no haya sido marcado previamente como completado
    const llaveProgreso = `${idAlumno}-${idModulo}`;
    if (db_progreso_alumno[llaveProgreso] === "Completado") {
        return { status: "error", msg: "El módulo ya fue completado." };
    }

    // --- PROCESAMIENTO MATEMÁTICO / LÓGICO ---
    
    // Operación de Escritura: Actualizar el estado del módulo en el registro del alumno
    db_progreso_alumno[llaveProgreso] = estadoModulo; // ModuloXX = "Completado"

    // Consultas previas de conteo (Lectura):
    // 1. Obtener la cantidad total de módulos de la carrera
    const modulosTotales = Object.keys(db_modulos_carrera).length;

    // 2. Contar la cantidad de módulos completados por el alumno
    let modulosCompletados = 0;
    Object.keys(db_progreso_alumno).forEach(llave => {
        if (llave.startsWith(`${idAlumno}-`) && db_progreso_alumno[llave] === "Completado") {
            modulosCompletados++;
        }
    });

    // 3. Calcular el porcentaje utilizando la fórmula estipulada
    // Porcentaje de avance = (Módulos completados / Módulos totales) * 100
    const porcentajeAvance = (modulosCompletados / modulosTotales) * 100;

    return {
        status: "success",
        msg: `¡Progreso actualizado! Módulo registrado con éxito.`,
        nuevoPorcentaje: porcentajeAvance
    };
}

// --- FUNCIONES AUXILIARES DE ACTUALIZACIÓN VISUAL ---

function actualizarModuloEnPantalla(idModulo) {
    const card = document.querySelector(`.module-card[data-id="${idModulo}"]`);
    if (card) {
        card.classList.add('completed');
        card.querySelector('.status-badge').innerText = "Completado";
        const boton = card.querySelector('.btn-complete');
        boton.innerText = "Completado";
        boton.disabled = true;
    }
}

function actualizarBarraDeProgreso(porcentaje) {
    progressBar.style.width = `${porcentaje}%`;
    progressPercentage.innerText = `${porcentaje}%`;
}

function mostrarFeedback(mensaje, tipo) {
    feedback.innerText = mensaje;
    feedback.className = `feedback-msg ${tipo}`;
    feedback.style.display = "block";
}