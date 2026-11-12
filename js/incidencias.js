// Lógica de dominio del registro de incidencias.
// No depende del DOM, por eso se puede probar con `node --test`.

export const PRIORIDADES = ["baja", "media", "alta"];
export const ESTADOS = ["abierta", "en_progreso", "cerrada"];

export const ETIQUETAS_ESTADO = {
  abierta: "Abierta",
  en_progreso: "En progreso",
  cerrada: "Cerrada",
};

/**
 * Valida los datos de una nueva incidencia.
 * @returns {string[]} lista de errores (vacía si es válida)
 */
export function validarIncidencia({ titulo, descripcion, prioridad } = {}) {
  const errores = [];
  if (!titulo || titulo.trim().length < 3) {
    errores.push("El título debe tener al menos 3 caracteres.");
  }
  if (!descripcion || descripcion.trim().length === 0) {
    errores.push("La descripción es obligatoria.");
  }
  if (!PRIORIDADES.includes(prioridad)) {
    errores.push("La prioridad no es válida.");
  }
  return errores;
}

/**
 * Crea una incidencia nueva a partir de los datos del formulario.
 * Lanza un Error si los datos no son válidos.
 */
export function crearIncidencia(datos, lista = [], ahora = new Date()) {
  const errores = validarIncidencia(datos);
  if (errores.length > 0) {
    throw new Error(errores.join(" "));
  }
  return {
    id: siguienteId(lista),
    titulo: datos.titulo.trim(),
    descripcion: datos.descripcion.trim(),
    prioridad: datos.prioridad,
    estado: "abierta",
    fecha: ahora.toISOString(),
  };
}

/** Devuelve el siguiente id disponible (máximo actual + 1). */
export function siguienteId(lista) {
  return lista.reduce((max, inc) => Math.max(max, inc.id), 0) + 1;
}

/** Ordena las incidencias de la más reciente a la más antigua. */
export function ordenarPorFecha(lista) {
  return [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha));
}
