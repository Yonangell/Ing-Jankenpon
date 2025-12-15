/**
 * @file Script principal para el juego de Piedra, Papel o Tijera.
 * Maneja la lógica del juego, la interfaz de usuario y la persistencia de datos.
 */

/**
 * @typedef {object} Estadisticas
 * @property {number} rondas Número total de rondas jugadas.
 * @property {number} usuario Número de victorias del usuario.
 * @property {number} computadora Número de victorias de la computadora.
 * @property {number} empates Número de empates.
 * @property {Array<{usuario: string, computadora: string, resultado: string}>}
 * historial Registro de las últimas 5 rondas.
 */

/** @type {estadisticas} */
let estadisticas = {
  rondas: 0,
  usuario: 0,
  computadora: 0,
  empates: 0,
  historial: [],
};

/** @type {string} Clave de localStorage para las estadísticas del juego. */
const STORAGE_KEY = "juegoPiedraPapelTijeraStat";
/** @type {string} Clave de localStorage para la preferencia de tema (claro/oscuro). */
const STORAGE_THEME_KEY = "juegoPiedraPapelTijeraTheme";

/**
 * Función inicia el juego que se ejecuta al cargar el DOM.
 * Carga estadísticas y tema desde localStorage y actualiza la UI.
 */
function iniciarJuego() {
  cargarEstadisticas();
  actualizarUI();
  cargarModoOscuro();
}

/**
 * Carga las estadísticas guardadas de localStorage si existen y actualiza el objeto 'estadisticas'.
 */
function cargarEstadisticas() {
  const datosGuardados = localStorage.getItem(STORAGE_KEY);
  if (datosGuardados) {
    estadisticas = JSON.parse(datosGuardados);
  }
}

/**
 * Guarda el objeto 'estadisticas' actual en localStorage como una cadena JSON.
 */
function guardarEstadisticas() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estadisticas));
}

/**
 * Actualiza dinámicamente todos los elementos de la interfaz de usuario (UI)
 * con los valores actuales del objeto 'estadisticas'.
 */
function actualizarUI() {
  document.getElementById("rondas-jugadas").textContent = estadisticas.rondas;
  document.getElementById("ganadas-usuario").textContent = estadisticas.usuario;
  document.getElementById("ganadas-comput").textContent =
    estadisticas.computadora;
  document.getElementById("rondas-empates").textContent = estadisticas.empates;

  const listaRondas = document.getElementById("lista-rondas");
  listaRondas.innerHTML = "";
  estadisticas.historial.forEach((item) => {
    const li = document.createElement("li");
    let color = "text-gray-800 dark:text-gray-100";
    if (item.resultado === "Ganaste") color = "text-green-500 font-mono";
    if (item.resultado === "Perdiste") color = "text-red-500 font-mono";

    li.className = `p-2 bg-gray-100 dark:bg-gray-700 rounded ${color}`;
    li.textContent = `Tú elegiste ${item.usuario} vs computadora eligio ${item.computadora} | Resultado: ${item.resultado}`;
    listaRondas.appendChild(li);
  });
}

/**
 * Reinicia todas las estadísticas a sus valores iniciales (cero)
 * y actualiza la UI y localStorage.
 */

function reiniciarResultados() {
  estadisticas = {
    rondas: 0,
    usuario: 0,
    computadora: 0,
    empates: 0,
    historial: [],
  };

  document.getElementById("resultado-partida").textContent =
    "Estadísticas reiniciadas ¡Comienza de nuevo!";
  guardarEstadisticas();
  actualizarUI();
}

/**
 * Ejecuta una sola ronda del juego de Piedra, Papel o Tijera.
 * Determina el ganador, actualiza las estadísticas y la UI.
 * @param {string} elegirUsuario - La opción elegida por el usuario ('piedra',
 * 'papel', 'tijera').
 */
function jugarRonda(elegirUsuario) {
  const opciones = ["piedra", "papel", "tijera"];
  // Aqui selecciona la computadora una de las 3 opciones aleatoriamente
  const elegirComputadora = opciones[Math.floor(Math.random() * 3)];

  let resultadoTexto = "";
  let resultadoTipo = "";

  if (elegirUsuario === elegirComputadora) {
    resultadoTexto = "¡Empate!";
    resultadoTipo = "Empate";
    estadisticas.empates++;
  } else if (
    (elegirUsuario === "piedra" && elegirComputadora === "tijera") ||
    (elegirUsuario === "papel" && elegirComputadora === "piedra") ||
    (elegirUsuario === "tijera" && elegirComputadora === "papel")
  ) {
    resultadoTexto = "¡Ganaste la ronda!";
    resultadoTipo = "Ganaste";
    estadisticas.usuario++;
  } else {
    resultadoTexto = "¡Perdiste la ronda!";
    resultadoTipo = "Perdiste";
    estadisticas.computadora++;
  }

  estadisticas.rondas++;

  // Aqui actualiza el mensaje principal del resultado
  document.getElementById(
    "resultado-partida"
  ).textContent = `${resultadoTexto} (Tú: ${elegirUsuario} vs Comp: ${elegirComputadora})`;

  // Añade la ronda actual al principio del historial
  estadisticas.historial.unshift({
    usuario: elegirUsuario,
    computadora: elegirComputadora,
    resultado: resultadoTipo,
  });

  // Limita el historial a las ultimas 5 rondas
  if (estadisticas.historial.length > 5) {
    estadisticas.historial.pop(); // Elimina la ultima ronda del arreglo
  }

  guardarEstadisticas();
  actualizarUI();
}

/**
 * Carga la preferencia de modo oscuro/claro del usuario desde localStorage
 * o detecta la preferencia del sistema operativo si no hay una guardada.
 */
function cargarModoOscuro() {
  const temaOscuro = localStorage.getItem(STORAGE_THEME_KEY);

  const bodyTag = document.body;

  if (
    temaOscuro === "dark" ||
    (!temaOscuro && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    bodyTag.classList.add("dark");
    bodyTag.style.backgroundColor = "#111827"; 
    bodyTag.style.color = "#f9fafb"; 
  } else {
    bodyTag.classList.remove("dark");
    bodyTag.style.backgroundColor = "#f3f4f6"; 
    bodyTag.style.color = "#111827"; 
  }

  const botonModo = document.querySelector(
    'button[onclick="toggleModoOscuro()"]'
  );
  if (botonModo) {
    const spanTexto = botonModo.querySelector("span");
    if (spanTexto) {
      spanTexto.textContent = bodyTag.classList.contains("dark")
        ? "Cambiar a modo claro"
        : "Cambiar a modo oscuro";
    }
  }
}

/**
 * Alterna entre el modo claro y oscuro de la interfaz y guarda la preferencia en localStorage.
 */

function toggleModoOscuro() {
  // const htmlTag = document.documentElement;
  const bodyTag = document.body;

  if (bodyTag.classList.contains("dark")) {
    bodyTag.classList.remove("dark");
    bodyTag.style.backgroundColor = "#f3f4f6"; 
    bodyTag.style.color = "#111827"; 
    localStorage.setItem(STORAGE_THEME_KEY, "light");
  } else {
    bodyTag.classList.add("dark");
    bodyTag.style.backgroundColor = "#111827"; 
    bodyTag.style.color = "#f9fafb"; 
    localStorage.setItem(STORAGE_THEME_KEY, "dark");
  }

  const botonModo = document.querySelector(
    'button[onclick="toggleModoOscuro()"]'
  );
  if (botonModo) {
    const spanTexto = botonModo.querySelector("span");
    if (spanTexto) {
      spanTexto.textContent = bodyTag.classList.contains("dark")
        ? "Cambiar a modo claro"
        : "Cambiar a modo oscuro";
    }
  }
}

// Event listener que inicia la aplicación cuando el DOM está completamente cargado.
document.addEventListener("DOMContentLoaded", iniciarJuego);
