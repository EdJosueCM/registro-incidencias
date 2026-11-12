import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validarIncidencia,
  crearIncidencia,
  siguienteId,
  ordenarPorFecha,
} from "../js/incidencias.js";

const valida = { titulo: "Error al iniciar sesión", descripcion: "No carga", prioridad: "alta" };

test("una incidencia completa es válida", () => {
  assert.deepEqual(validarIncidencia(valida), []);
});

test("rechaza título corto, descripción vacía y prioridad inválida", () => {
  const errores = validarIncidencia({ titulo: "ab", descripcion: "  ", prioridad: "urgente" });
  assert.equal(errores.length, 3);
});

test("crearIncidencia asigna id, estado abierta y fecha", () => {
  const fecha = new Date("2026-11-12T10:00:00Z");
  const inc = crearIncidencia(valida, [{ id: 4 }], fecha);
  assert.equal(inc.id, 5);
  assert.equal(inc.estado, "abierta");
  assert.equal(inc.fecha, fecha.toISOString());
});

test("crearIncidencia limpia espacios", () => {
  const inc = crearIncidencia({ ...valida, titulo: "  Hola mundo  " });
  assert.equal(inc.titulo, "Hola mundo");
});

test("crearIncidencia lanza error con datos inválidos", () => {
  assert.throws(() => crearIncidencia({ titulo: "", descripcion: "", prioridad: "x" }));
});

test("siguienteId empieza en 1 con lista vacía", () => {
  assert.equal(siguienteId([]), 1);
});

test("ordenarPorFecha pone primero la más reciente sin mutar la lista", () => {
  const lista = [
    { id: 1, fecha: "2026-01-01T00:00:00.000Z" },
    { id: 2, fecha: "2026-03-01T00:00:00.000Z" },
  ];
  const ordenada = ordenarPorFecha(lista);
  assert.deepEqual(ordenada.map((i) => i.id), [2, 1]);
  assert.equal(lista[0].id, 1);
});
