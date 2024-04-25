import datosEntrenamientoLibros from './modelo/libro.js';

// Mapeos para los tipos de libros y autores
const typeMapping = {
    "Novela": [1, 0, 0],
    "Fantasía": [0, 1, 0],
    "Terror": [0, 0, 1]
};

const authorMapping = {
    "Gabriel García Márquez": [1, 0, 0, 0],
    "J.R.R. Tolkien": [0, 1, 0, 0],
    "E.L James": [0, 0, 1, 0],
    "William Peter Blatty": [0, 0, 0, 1]
};

// Normaliza el año para la red
function normalizeYear(year) {
    return (year - 1900) / 100;  
}

const processedData = datosEntrenamientoLibros.map(libro => ({
    input: [
        ...typeMapping[libro.input.type],
        ...authorMapping[libro.input.autor],
        normalizeYear(libro.input.fecha)
    ],
    output: [libro.output.like],
    details: libro.details
}));

//inicializar la red neuronal
const net = new brain.NeuralNetwork();

//Entrenar la red neuronal con el modelo de datos
net.train(processedData.map(item => ({ input: item.input, output: item.output })));

// Esperar a que el DOM esté completamente cargado para manipularlo
document.addEventListener('DOMContentLoaded', function () {
    const listaLibrosElement = document.getElementById('lista-libros');

    datosEntrenamientoLibros.forEach(libro => {
        const libroElement = document.createElement('div');
        libroElement.classList.add('col-md-4');
        libroElement.innerHTML = `
        
            <div class="uc-card card-bg--image card-gradient--bottom-blue mb-20" style="max-width: 380px">
                <a>
                    <img
                    class="uc-card-img"
                    src="${libro.input.imagen}" alt="Portada de ${libro.input.nombre}"
                    alt="Portada de ${libro.input.nombre}"
                    />

                    <div class="uc-card_body uc-card_body--absolute">
                    <div class="uc-card card-bg--white mt-auto">
                        <div class="uc-card_body">
                        <h3 class="color-black">
                        ${libro.details.nombre}
                        - Publicado en ${libro.input.fecha}
                        - Tipo: ${libro.input.type}
                        </h3>
                        </div>
                    </div>
                    </div>
                </a>    
            </div>
        `;
        listaLibrosElement.appendChild(libroElement);
    });
});

//Supongamos que el usuario vio este recurso, entró a el, hizo clic
const libroVisto = { nombre: "El Señor de los Anillos", autor: "J.R.R. Tolkien", fecha: 1954 };
console.log("Libro visto por el usuario:", libroVisto);

const puntuaciones = processedData.map(item => ({
    // Correr la red neuronal para obtener la puntuación
    score: net.run(item.input),
    details: item.details
}));
console.log("Puntuaciones de los libros:", puntuaciones);

const filtrarpuntuaciones = puntuaciones.filter(item => 
    !(item.details.nombre === libroVisto.nombre && item.details.autor === libroVisto.autor)
);

//Ordenar las puntuaciones de mayor a menor
const ordenarPuntuaciones = filtrarpuntuaciones.sort((a, b) => b.score - a.score);
const topDeLibros = ordenarPuntuaciones.slice(0, 3);

const librosRecomendadosElement = document.getElementById('libros-recomendados');

topDeLibros.forEach((book, index) => {
    const recomendacionElement = document.createElement('div');
    recomendacionElement.classList.add('col-md-4');

    recomendacionElement.innerHTML = 
    `
        <div class="uc-card card-bg--image card-gradient--bottom-blue" style="max-width: 380px">
        <a>
            <img
            class="uc-card-img"
            src="${book.details.imagen}" alt="Portada de ${book.details.nombre}"
            alt="Portada de ${book.details.nombre}"
            />

            <div class="uc-card_body uc-card_body--absolute">
            <div class="uc-card card-bg--white mt-auto">
                <div class="uc-card_body">
                <h3 class="color-black">
                ${book.details.nombre}
                ${book.details.autor}
                ${book.score}
                </h3>
                </div>
            </div>
            </div>
        </a>    
    </div>
   `;
    
    librosRecomendadosElement.appendChild(recomendacionElement);
    console.log("libros recomendados", book);
});