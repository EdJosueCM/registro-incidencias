// Capa de interfaz: conecta el formulario y la lista con la lógica de dominio.
import {
  crearIncidencia,
  validarIncidencia,
  ordenarPorFecha,
  filtrarPorEstado,
  avanzarEstado,
  ETIQUETAS_ESTADO,
} from "./incidencias.js";

const CLAVE = "incidencias";

const form = document.getElementById("form-incidencia");
const listaEl = document.getElementById("lista");
const vacioEl = document.getElementById("vacio");
const contadorEl = document.getElementById("contador");
const erroresEl = document.getElementById("errores");
const filtroEl = document.getElementById("filtro-estado");

let incidencias = cargar();
let filtro = "todos";

function cargar() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? [];
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

function formatearFecha(iso) {
  return new Date(iso).toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" });
}

function span(texto, clase = "") {
  const el = document.createElement("span");
  el.textContent = texto;
  if (clase) el.className = clase;
  return el;
}

function crearItem(inc) {
  const li = document.createElement("li");
  li.className = `incidencia ${inc.prioridad}`;

  const h3 = document.createElement("h3");
  h3.textContent = `#${inc.id} · ${inc.titulo}`;

  const p = document.createElement("p");
  p.textContent = inc.descripcion;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.append(
    span(`Prioridad: ${inc.prioridad}`, "etiqueta"),
    span(ETIQUETAS_ESTADO[inc.estado] ?? inc.estado, "etiqueta"),
    span(formatearFecha(inc.fecha)),
  );

  if (inc.estado !== "cerrada") {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "avanzar";
    boton.textContent = inc.estado === "abierta" ? "Iniciar" : "Cerrar";
    boton.addEventListener("click", () => {
      incidencias = avanzarEstado(incidencias, inc.id);
      guardar();
      render();
    });
    meta.append(boton);
  }

  li.append(h3, p, meta);
  return li;
}

function render() {
  const visibles = ordenarPorFecha(filtrarPorEstado(incidencias, filtro));
  listaEl.replaceChildren(...visibles.map(crearItem));
  contadorEl.textContent = visibles.length;
  vacioEl.hidden = visibles.length > 0;
}

function mostrarErrores(errores) {
  erroresEl.replaceChildren(
    ...errores.map((e) => Object.assign(document.createElement("li"), { textContent: e })),
  );
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const datos = Object.fromEntries(new FormData(form));
  const errores = validarIncidencia(datos);
  mostrarErrores(errores);
  if (errores.length > 0) return;

  incidencias.push(crearIncidencia(datos, incidencias));
  guardar();
  form.reset();
  render();
});

filtroEl.addEventListener("change", () => {
  filtro = filtroEl.value;
  render();
});

render();
