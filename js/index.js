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

//inicializa la red neuronal
const net = new brain.NeuralNetwork();

//Entrenar la red neuronal
net.train(processedData.map(item => ({ input: item.input, output: item.output })));

// Esperar a que el DOM esté completamente cargado para manipularlo
document.addEventListener('DOMContentLoaded', function () {
    const listaLibrosElement = document.getElementById('lista-libros');

    datosEntrenamientoLibros.forEach(libro => {
        const libroElement = document.createElement('div');
        libroElement.innerHTML = `
        <strong>${libro.details.nombre}</strong>
        por ${libro.details.autor}
        - Publicado en ${libro.input.fecha}
        - Tipo: ${libro.input.type}
        <img src="${libro.input.imagen}" alt="Portada de ${libro.input.nombre}" style="width:100px; height:auto;">`;
        listaLibrosElement.appendChild(libroElement);
    });
});

const libroVisto = { nombre: "El Señor de los Anillos", autor: "J.R.R. Tolkien", fecha: 1954 };
console.log("Libro visto por el usuario:", libroVisto);

const puntuaciones = processedData.map(item => ({
    score: net.run(item.input),
    details: item.details
}));

const filtrarpuntuaciones = puntuaciones.filter(item => 
    !(item.details.nombre === libroVisto.nombre && item.details.autor === libroVisto.autor)
);

const ordenarPuntuaciones = filtrarpuntuaciones.sort((a, b) => b.score - a.score);
const topDeLibros = ordenarPuntuaciones.slice(0, 3);

const librosRecomendadosElement = document.getElementById('libros-recomendados');

topDeLibros.forEach((book, index) => {
    const recomendacionElement = document.createElement('div');
    recomendacionElement.innerHTML = 
    `${index + 1}. <strong>${book.details.nombre}
    </strong> por ${book.details.autor}
    - Puntuación de 'like': ${book.score}
    <img src="${book.details.imagen}" alt="Portada de ${book.details.nombre}" style="width:100px; height:auto;">`;
    
    
    librosRecomendadosElement.appendChild(recomendacionElement);
    console.log(book);
});