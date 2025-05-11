import os
from flask import Flask, jsonify, request

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
    
    # Por ejemplo, guardar la imagen en el directorio UPLOAD_FOLDER
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)
    
    return jsonify({"message": "Imagen subida exitosamente"}), 200
   
   
if __name__ == '__main__':
    app.run(debug=True)