document.addEventListener('DOMContentLoaded', obtenerPalabraDeAPI);

const button = document.getElementById("guess-button");
const input = document.getElementById("guess-input");

let intentos = 6;
let palabra = ''; // La palabra seleccionada de la API

button.addEventListener("click", intentar);
input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        intentar();
        event.preventDefault();
    }
});

function obtenerPalabraDeAPI() {
    fetch('https://random-word-api.herokuapp.com/word?lang=es') // Solicita 10 palabras
        .then(response => response.json())
        .then(data => {
            const palabraCincoLetras = data.find(p => p.length === 5); // Encuentra la primera palabra de 5 letras
            if (palabraCincoLetras) {
                palabra = palabraCincoLetras.toUpperCase(); // Actualiza la palabra a adivinar
                console.log("Palabra seleccionada: ", palabra); // Para propósitos de depuración
            } else {
                // Si no se encuentra ninguna palabra de 5 letras, vuelve a intentar
                obtenerPalabraDeAPI();
            }
        })
        .catch(error => console.log('Error al obtener palabras de la API', error));
}

function intentar() {
    let INTENTO = leerIntento();
    if (INTENTO.length !== 5) {
        alert('Por favor, introduce una palabra de 5 letras.');
        return;
    }
    if (INTENTO === palabra) {
        terminar("<h1>¡GANASTE!😀</h1>");
    } else {
        actualizarGrid(INTENTO);
        intentos--;
        if (intentos == 0) {
            terminar(`<h1>¡PERDISTE! La palabra correcta era: ${palabra} 😖</h1>`);
        }
    }
    input.value = ''; // Limpiar el input después de cada intento
}

function actualizarGrid(INTENTO) {
    const GRID = document.getElementById("grid");
    const ROW = document.createElement('div');
    ROW.className = 'row';
    for (let i = 0; i < palabra.length; i++) {
        const SPAN = document.createElement('span');
        SPAN.className = 'letter';
        SPAN.innerHTML = INTENTO[i] ?? '';
        SPAN.style.backgroundColor = getColor(INTENTO, i);
        ROW.appendChild(SPAN);
    }
    GRID.appendChild(ROW);
}

function getColor(INTENTO, i) {
    if (INTENTO[i] === palabra[i]) {
        return '#79b851'; // Verde
    } else if (palabra.includes(INTENTO[i])) {
        return '#f3c237'; // Amarillo
    } else {
        return '#a4aec4'; // Gris
    }
}

function leerIntento() {
    let intento = input.value.toUpperCase();
    return intento;
}

function terminar(mensaje) {
    const INPUT = document.getElementById("guess-input");
    INPUT.disabled = true;
    button.disabled = true;
    let contenedor = document.getElementById('guesses');
    contenedor.innerHTML = mensaje;
}
