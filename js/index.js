//Array con datos de libros
const apiLibros = [
    {
        title: "El principito",
        type: "Novela",
    },
    {
        title: "El arte de la guerra",
        type: "Ensayo",
    },
    {
        title: "El amor en los tiempos del cólera",
        type: "Novela",
    },
    {
        title: "El código Da Vinci",
        type: "Novela",
    },
    {
        title: "El perfume",
        type: "Drama",
    },
    {
        title: "El señor de los anillos",
        type: "Fantasía",
    },
    {
        title: "Cien años de soledad",
        type: "Novela",
    },
    {
        title: "1984",
        type: "Ciencia ficción",
    },
    {
        title: "Harry Potter y la piedra filosofal",
        type: "Fantasía",
    },
    {
        title: "Crónica de una muerte anunciada",
        type: "Novela",
    },
    {
        title: "Moby Dick",
        type: "Aventura",
    }
];

const datosEntrenamiento = []

// Convertir los datos de la API en un formato compatible para entrenar el modelo
apiLibros.forEach((libro) => {
    const entrada = {}
    entrada[libro.title] = 0 //Establece la propiedad en 0
    datosEntrenamiento.push({input: entrada,output: {liked: 1}}) //si ha visto un libro, le gusta
})
console.log("datosEntrenamiento", datosEntrenamiento)

const net = new brain.NeuralNetwork();

//entrenar el modelo
net.train(datosEntrenamiento);

//supongamos que el usuario ha visto el siguiente libro

const titulosLibros = Object.keys(datosEntrenamiento[1].input)
console.log("titulosLibros", titulosLibros)

//Resultado de la predicción
const resultado = net.run(titulosLibros)
console.log("resultado", resultado) // predice el 0.9

// Encontrar el libro con la probabilidad más alta
const libroRecomendado = datosEntrenamiento.find((dato) => resultado[Object.keys(dato.input)[0]] > 0.5);

if (libroRecomendado) {
    console.log("Libro recomendado:", Object.keys(libroRecomendado.input)[0]);
} else {
    console.log("No se encontró ningún libro recomendado.");
} // está en el else, hay que investigar por qué no se encuentra el libro recomendado