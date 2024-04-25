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

console.log("Libros recomendados:");
topDeLibros.forEach((book, index) => {
    console.log(`${index + 1}. Libro: ${book.details.nombre}, Autor: ${book.details.autor}, Puntuación de 'like': ${book.score}`);
});
