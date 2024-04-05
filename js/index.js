const net = new brain.NeuralNetwork()

const datosEntrenamientoLibros = [
    {
        input: {
            type: "Novela",
            autor: "Gabriel García Márquez",
            fecha: 1967
        },
        output: {
            like: 1
        }
    },
    {
        input: {
            type: "Fantasía",
            autor: "J.R.R. Tolkien",
            fecha: 1954
        },
        output: {
            like: 0
        }
    },
    {
        input: {
            type: "Novela",
            autor: "E.L James",
            fecha: 2019
        },
        output: {
            like: 1
        }
    }
];

// Itera sobre los datos de entrenamiento y escoge un libro que le guste al usuario
function obtenerLibroMostrado(datosEntrenamientoLibros) {
    let libroMostradoAlUsuario = null;

    datosEntrenamientoLibros.forEach((libro, index) => {
        const entradaLibro = libro.input;
        const salidaUsuario = libro.output;

        // Verifica si al usuario vio el libro
        if (salidaUsuario.like === 1) {
            libroMostradoAlUsuario = entradaLibro;
            console.log("Libro mostrado al usuario (Índice " + index + "):", libroMostradoAlUsuario);
            return 
        }
    });

    return  { libroMostradoAlUsuario };
}

//entrenar el modelo en base a los datos de datosEntrenamientoLibros
const trainingResult = net.train(datosEntrenamientoLibros);
console.log({trainingResult});


//Tomar el libro que le gusta al usuario y predecir si le gustará otro libro
const { libroMostradoAlUsuario } = obtenerLibroMostrado(datosEntrenamientoLibros);
console.log({libroMostrado: libroMostradoAlUsuario});

// Convertir ese objeto que me devuelve, cada valor debe ser transformado en [0, 1, 2]
// para que el modelo pueda hacer la predicción

const entrada = {
    type: 0,
    autor: 1,
    fecha: 2
};

//resultado de la predicción
const resultado = net.run(entrada);
console.log("Resultado de la predicción:", resultado);

// en base a ese resultado, recomendar un libro al usuario que le guste

if (resultado.like > 0.5) {
    console.log("Te recomendamos el libro:", libroMostradoAlUsuario);
} else {
    console.log("No te recomendamos el libro:", libroMostradoAlUsuario);
}
