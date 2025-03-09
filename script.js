let model;

// Cargar el modelo
async function loadModel() {
    model = await tf.loadLayersModel('https://raw.githubusercontent.com/JORF4R/iandoando/refs/heads/main/modelo_tfjs_model/model.json');
    console.log("Modelo cargado correctamente.");
}

// Leer y preprocesar la imagen
function processImage(imageElement) {
    return tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([224, 224]) // Ajusta según el tamaño de entrada de tu modelo
        .toFloat()
        .expandDims();
}

// Manejar la carga de imagen
document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.getElementById('previewImage');
            imgElement.src = e.target.result;
            imgElement.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// Realizar la predicción
async function predict() {
    if (!model) {
        alert("El modelo aún no se ha cargado.");
        return;
    }

    const imgElement = document.getElementById('previewImage');
    if (!imgElement.src) {
        alert("Sube una imagen primero.");
        return;
    }

    const img = new Image();
    img.src = imgElement.src;
    img.onload = async function() {
        const tensor = processImage(img);
        const predictions = await model.predict(tensor).data();

        // Aquí debes mapear los índices de salida del modelo con las razas de perros
        const labels = ["Labrador", "Bulldog", "Beagle", "Golden Retriever"]; // Reemplaza con las razas reales de tu modelo
        const predictedIndex = predictions.indexOf(Math.max(...predictions));
        const predictedBreed = labels[predictedIndex] || "Desconocida";

        document.getElementById('result').innerText = `Predicción: ${predictedBreed}`;
    };
}

// Cargar el modelo cuando se abre la página
loadModel();
