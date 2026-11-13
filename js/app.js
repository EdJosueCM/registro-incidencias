// Capa de interfaz: conecta el formulario, el filtro y la lista con la lógica de dominio.
// Las reglas de negocio viven en incidencias.js; este archivo solo presenta y reacciona.
import {
  crearIncidencia,
  validarIncidencia,
  ordenarPorFecha,
  filtrarPorEstado,
  avanzarEstado,
  siguienteEstado,
  ESTADOS,
  ETIQUETAS_ESTADO,
  FILTRO_TODOS,
} from "./incidencias.js";

const CLAVE = "incidencias";
const IDIOMA = "es-EC";
const CAMPOS = ["titulo", "descripcion", "prioridad"];

const ETIQUETAS_PRIORIDAD = { baja: "Baja", media: "Media", alta: "Alta" };

// Criterio común para elegir prioridad, visible debajo del selector.
const AYUDA_PRIORIDAD = {
  baja: "Molesta, pero se puede seguir trabajando.",
  media: "Afecta el trabajo, aunque hay una alternativa.",
  alta: "Bloquea el trabajo y no hay alternativa.",
};

// Botón que lleva cada estado al siguiente. Las cerradas no tienen botón.
const ACCIONES = { abierta: "Iniciar", en_progreso: "Cerrar" };

const AVISOS_ESTADO = {
  en_progreso: (id) => `Incidencia #${id} en progreso`,
  cerrada: (id) => `Incidencia #${id} cerrada`,
};

const VACIO_POR_FILTRO = {
  abierta: "No hay incidencias abiertas",
  en_progreso: "No hay incidencias en progreso",
  cerrada: "No hay incidencias cerradas",
};

const $ = (id) => document.getElementById(id);

const form = $("form-incidencia");
const contadorTituloEl = $("contador-titulo");
const ayudaPrioridadEl = $("ayuda-prioridad");
const filtroEl = $("filtro-estado");
const tituloListaEl = $("titulo-lista");
const listaEl = $("lista");
const vacioEl = $("vacio");
const vacioTituloEl = $("vacio-titulo");
const vacioTextoEl = $("vacio-texto");
const verTodasEl = $("ver-todas");
const avisoEl = $("aviso");

let incidencias = cargar();
// El navegador puede restaurar la opción marcada al recargar: se toma la que esté marcada.
let filtro = filtroEl.querySelector("input:checked")?.value ?? FILTRO_TODOS;

// ---------- Persistencia ----------

function cargar() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(incidencias));
  } catch {
    // Sin almacenamiento disponible: la app sigue funcionando en memoria.
  }
}

// ---------- Fechas ----------

const formatoFecha = new Intl.DateTimeFormat(IDIOMA, { dateStyle: "long", timeStyle: "short" });
const formatoDia = new Intl.DateTimeFormat(IDIOMA, { day: "numeric", month: "short", year: "numeric" });
const formatoRelativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

function fechaCompleta(iso) {
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime()) ? "" : formatoFecha.format(fecha);
}

function tiempoRelativo(iso, ahora = Date.now()) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return "";
  const segundos = Math.round((fecha.getTime() - ahora) / 1000);
  const distancia = Math.abs(segundos);
  if (distancia < 45) return "ahora";
  if (distancia < 3600) return formatoRelativo.format(Math.round(segundos / 60), "minute");
  if (distancia < 86400) return formatoRelativo.format(Math.round(segundos / 3600), "hour");
  if (distancia < 7 * 86400) return formatoRelativo.format(Math.round(segundos / 86400), "day");
  return formatoDia.format(fecha);
}

// ---------- Construcción de elementos (sin innerHTML: el texto del usuario nunca se interpreta como HTML) ----------

function el(etiqueta, atributos = {}, ...hijos) {
  const nodo = document.createElement(etiqueta);
  for (const [nombre, valor] of Object.entries(atributos)) {
    if (valor === null || valor === undefined || valor === false) continue;
    if (nombre === "texto") nodo.textContent = valor;
    else if (nombre === "clase") nodo.className = valor;
    else if (nombre.startsWith("on")) nodo.addEventListener(nombre.slice(2), valor);
    else nodo.setAttribute(nombre, valor === true ? "" : String(valor));
  }
  nodo.append(...hijos.filter((hijo) => hijo !== null && hijo !== undefined && hijo !== false));
  return nodo;
}

function crearItem(inc, { resaltar = false } = {}) {
  const paso = ESTADOS.indexOf(inc.estado); // 0: abierta, 1: en progreso, 2: cerrada
  const accion = ACCIONES[inc.estado];

  return el(
    "li",
    {
      clase: `incidencia ${inc.estado}${resaltar ? " resaltada" : ""}`,
      "data-id": inc.id,
      tabindex: "-1",
    },
    el("span", { clase: "incidencia-id", "aria-hidden": "true", texto: `#${inc.id}` }),
    el(
      "div",
      { clase: "incidencia-cuerpo" },
      el(
        "div",
        { clase: "incidencia-cabecera" },
        el(
          "h3",
          { clase: "incidencia-titulo" },
          el("span", { clase: "solo-lectores", texto: `Incidencia ${inc.id}: ` }),
          inc.titulo,
        ),
        el("time", {
          clase: "incidencia-tiempo",
          datetime: inc.fecha,
          title: fechaCompleta(inc.fecha),
          texto: tiempoRelativo(inc.fecha),
        }),
      ),
      el("p", { clase: "incidencia-descripcion", texto: inc.descripcion }),
      el(
        "div",
        { clase: "incidencia-pie" },
        el(
          "span",
          { clase: `chip ${inc.prioridad}` },
          el("i", { clase: `punto ${inc.prioridad}`, "aria-hidden": "true" }),
          el("span", { clase: "solo-lectores", texto: "Prioridad " }),
          ETIQUETAS_PRIORIDAD[inc.prioridad] ?? inc.prioridad,
        ),
        el(
          "span",
          { clase: "estado" },
          el(
            "span",
            { clase: "medidor", "aria-hidden": "true" },
            ...ESTADOS.map((_, i) => el("i", { clase: i <= paso ? "lleno" : null })),
          ),
          el("span", { clase: "solo-lectores", texto: "Estado: " }),
          ETIQUETAS_ESTADO[inc.estado] ?? inc.estado,
        ),
        accion &&
          el("button", {
            type: "button",
            clase: "accion",
            "aria-label": `${accion} la incidencia #${inc.id}`,
            texto: accion,
            // detail === 0 indica que el clic vino del teclado (Enter o Espacio).
            onclick: (evento) => avanzar(inc.id, { desdeTeclado: evento.detail === 0 }),
          }),
      ),
    ),
  );
}

// ---------- Pintado ----------

function render({ resaltarId = null } = {}) {
  const visibles = ordenarPorFecha(filtrarPorEstado(incidencias, filtro));
  listaEl.replaceChildren(...visibles.map((inc) => crearItem(inc, { resaltar: inc.id === resaltarId })));
  actualizarContadores();
  actualizarVacio(visibles.length);
}

function actualizarContadores() {
  for (const cuenta of filtroEl.querySelectorAll("[data-contador]")) {
    cuenta.textContent = filtrarPorEstado(incidencias, cuenta.dataset.contador).length;
  }
}

function actualizarVacio(cantidadVisible) {
  vacioEl.hidden = cantidadVisible > 0;
  if (cantidadVisible > 0) return;

  const total = incidencias.length;
  if (total === 0) {
    vacioTituloEl.textContent = "Aún no hay incidencias";
    vacioTextoEl.textContent = "Cuando registres una, aparecerá aquí con su prioridad y su estado.";
  } else {
    vacioTituloEl.textContent = VACIO_POR_FILTRO[filtro] ?? "No hay incidencias para mostrar";
    vacioTextoEl.textContent =
      total === 1 ? "Hay 1 incidencia en otro estado." : `Hay ${total} incidencias en otros estados.`;
  }
  verTodasEl.hidden = total === 0;
}

// ---------- Formulario ----------

// Valida cada campo por separado con la misma regla de dominio,
// para mostrar cada error junto a su campo.
const DATOS_VALIDOS = { titulo: "Título válido", descripcion: "Descripción válida", prioridad: "media" };

function erroresPorCampo(datos) {
  const errores = {};
  for (const campo of CAMPOS) {
    const [mensaje] = validarIncidencia({ ...DATOS_VALIDOS, [campo]: datos[campo] });
    if (mensaje) errores[campo] = mensaje;
  }
  return errores;
}

function mostrarError(campo, mensaje = "") {
  $(`error-${campo}`).textContent = mensaje;
  const control = campo === "prioridad" ? null : form.elements[campo];
  if (!control) return;
  if (mensaje) control.setAttribute("aria-invalid", "true");
  else control.removeAttribute("aria-invalid");
}

function enfocarCampo(campo) {
  const control =
    campo === "prioridad" ? form.querySelector('[name="prioridad"]') : form.elements[campo];
  control?.focus();
}

function leerFormulario() {
  return Object.fromEntries(new FormData(form));
}

function actualizarContadorTitulo() {
  const titulo = form.elements.titulo;
  contadorTituloEl.textContent = `${titulo.value.length}/${titulo.maxLength}`;
}

function actualizarAyudaPrioridad() {
  ayudaPrioridadEl.textContent = AYUDA_PRIORIDAD[form.elements.prioridad.value] ?? "";
}

// ---------- Avisos ----------

let temporizadorAviso = 0;

function avisar(mensaje) {
  avisoEl.textContent = mensaje;
  avisoEl.classList.add("visible");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => avisoEl.classList.remove("visible"), 3200);
}

// ---------- Acciones ----------

function seleccionarFiltro(valor) {
  filtro = valor;
  const opcion = filtroEl.querySelector(`input[value="${valor}"]`);
  if (opcion) opcion.checked = true;
}

function avanzar(id, { desdeTeclado = false } = {}) {
  const actual = incidencias.find((inc) => inc.id === id);
  if (!actual) return;

  const destino = siguienteEstado(actual.estado);
  incidencias = avanzarEstado(incidencias, id);
  guardar();
  render({ resaltarId: id });
  avisar(AVISOS_ESTADO[destino]?.(id) ?? `Incidencia #${id} actualizada`);

  // Con teclado, el foco vuelve a la misma fila para no perder la posición.
  if (desdeTeclado) {
    const fila = listaEl.querySelector(`[data-id="${id}"]`);
    (fila?.querySelector(".accion") ?? fila ?? tituloListaEl).focus();
  }
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const datos = leerFormulario();
  const errores = erroresPorCampo(datos);
  CAMPOS.forEach((campo) => mostrarError(campo, errores[campo]));

  const primerError = CAMPOS.find((campo) => errores[campo]);
  if (primerError) {
    enfocarCampo(primerError);
    return;
  }

  let nueva;
  try {
    nueva = crearIncidencia(datos, incidencias);
  } catch (error) {
    avisar(error.message);
    return;
  }

  incidencias = [...incidencias, nueva];
  guardar();
  form.reset();
  actualizarContadorTitulo();
  actualizarAyudaPrioridad();

  // Si el filtro activo ocultaría la nueva incidencia, se vuelve a "Todas".
  if (filtrarPorEstado([nueva], filtro).length === 0) seleccionarFiltro(FILTRO_TODOS);
  render({ resaltarId: nueva.id });
  avisar(`Incidencia #${nueva.id} registrada`);
});

form.addEventListener("input", (evento) => {
  const campo = evento.target.name;
  if (campo === "titulo") actualizarContadorTitulo();
  // Solo se revalida un campo que ya muestra un error, para no regañar mientras se escribe.
  if (CAMPOS.includes(campo) && $(`error-${campo}`).textContent) {
    mostrarError(campo, erroresPorCampo(leerFormulario())[campo]);
  }
});

form.addEventListener("change", (evento) => {
  if (evento.target.name === "prioridad") actualizarAyudaPrioridad();
});

filtroEl.addEventListener("change", (evento) => {
  if (evento.target.name !== "filtro") return;
  filtro = evento.target.value;
  render();
});

verTodasEl.addEventListener("click", () => {
  seleccionarFiltro(FILTRO_TODOS);
  render();
  filtroEl.querySelector(`input[value="${FILTRO_TODOS}"]`)?.focus();
});

// Mantiene al día los textos "hace 5 minutos" sin volver a pintar la lista.
setInterval(() => {
  for (const tiempo of listaEl.querySelectorAll("time[datetime]")) {
    tiempo.textContent = tiempoRelativo(tiempo.dateTime);
  }
}, 60_000);

actualizarContadorTitulo();
actualizarAyudaPrioridad();
render();
