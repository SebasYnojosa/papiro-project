import os
os.environ["NUMBA_DISABLE_JIT"] = "1" # Desactivar JIT para evitar problemas con la librería rembg
from flask import Flask, jsonify, request
from PIL import Image
from rembg import remove

app = Flask(__name__)

# Carpeta para almacenar archivos estáticos
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'backend/app', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


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
            # Guardar la imagen cortada
            cropped_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            img_cropped.save(cropped_path)
    except Exception as e:
        return jsonify({"error": f"Error al procesar la imagen: {str(e)}"}), 500
    finally:
        # Eliminar la imagen temporal
        if os.path.exists(temp_path):
            os.remove(temp_path)
    
    return jsonify({"message": "Imagen subida exitosamente"}), 200
   
   
if __name__ == '__main__':
    app.run(debug=True)