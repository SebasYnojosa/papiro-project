import os
os.environ["NUMBA_DISABLE_JIT"] = "1" # Desactivar JIT para evitar problemas con la librería rembg

from flask import Flask, jsonify, request
from PIL import Image
from rembg import remove
from flask_cors import CORS

from tensorflow.keras.models import load_model

import numpy as np

app = Flask(__name__)
CORS(app)

# Carpeta para almacenar archivos estáticos
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'backend/app', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Cargar el modelo de Keras
model_path = os.path.join(os.getcwd(), 'backend/app/model', 'modeloV22.h5')
model = load_model(model_path)

@app.route('/upload', methods=['POST'])
def upload_image():
    # Aquí iría la lógica para manejar la subida de imágenes
    if 'image' not in request.files:
        return jsonify({"error": "No se encontró la imagen en la solicitud"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No se seleccionó ninguna imagen"}), 400
    
    # Guardar temporalmente la imagen original
    temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f"temp_{file.filename}")
    file.save(temp_path)
    
    try: 
        with Image.open(temp_path) as img:
            width, height = img.size
            # Cortar la mitad inferior de la imagen
            img_cropped = img.crop((0, height // 2, width, height))
            # Cortar la imagen en 3 partes de forma horizontal y quedarse con la parte central
            img_cropped = img_cropped.crop((width // 3, 0, 2 * width // 3, height // 2))
            # Quitar el fondo de la imagen
            img_cropped = remove(img_cropped)
            # Pasar la imagen a formato gris
            img_cropped = img_cropped.convert("L")
            # Redimensionar la imagen a 100x100
            img_cropped = img_cropped.resize((100, 100))
            # Guardar la imagen cortada
            cropped_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            img_cropped.save(cropped_path)
            
            # Preparar la imagen para la predicción
            img_array = np.array(img_cropped)  # Normalizar la imagen
            img_array = np.expand_dims(img_array, axis=0)
            
            # Aquí iría la lógica para predecir con el modelo de Keras
            prediction = model.predict(img_array)
            
            return jsonify({"prediction": prediction.tolist()}), 200
            
    except Exception as e:
        return jsonify({"error": f"Error al procesar la imagen: {str(e)}"}), 500
    finally:
        # Eliminar la imagen temporal
        if os.path.exists(temp_path):
            os.remove(temp_path)
    
    return jsonify({"message": "Imagen subida exitosamente"}), 200
   
   
if __name__ == '__main__':
    app.run(debug=True)