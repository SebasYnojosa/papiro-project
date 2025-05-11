import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
import axios from "axios";

const CustomWebcam = () => {
    const webcamRef = useRef<Webcam>(null);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    
    const capture = useCallback(() => {
        const img = webcamRef.current?.getScreenshot();
        if (img) {
            setImageSrc(img);
        }
    }, [webcamRef]);

    const retake = () => {
        setImageSrc(null);
    };

    const uploadImage = async () => {
        if (!imageSrc) return;

        const blob = await fetch(imageSrc).then((res) => res.blob());
        const file = new File([blob], "captura.png", { type: "image/jpeg"})
        
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log("Image uploaded successfully:", response.data);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }

    return (
        <div className="flex h-screen relative">
            <div className="flex-1 flex items-center justify-center bg-gray-100 ">
                El rival aparecerá en la pantalla, por favor espera a que se cargue la cámara.
            </div>

            <div className="flex-1 bg-gray-200">
                {imageSrc ? (
                    <>
                        <img src={imageSrc} alt="captura" className="w-full h-full object-cover" />
                        <div  className="absolute top-0 right-0 w-1/2 h-1/2 bg-opacity-70 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-1/2 w-1/8 h-1/2 bg-opacity-70 pointer-events-none"></div>
                        {/* Bloque bordeado con color verde que cubre un cuarto en el centro */}
                        <div className="absolute bottom-0 right-1/8 w-1/4 h-1/2 border-4 border-green-500 pointer-events-none"></div>
                        {/* Bloque opaco que cubre el último octavo de la parte inferior */}
                        <div className="absolute bottom-0 right-0 w-1/8 h-1/2 bg-opacity-70 pointer-events-none"></div>
                    </>
                ) : (
                    <>
                        <Webcam ref={webcamRef}  className="w-full h-full object-cover"/>
                        <div  className="absolute top-0 right-0 w-1/2 h-1/2 bg-opacity-70 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-1/2 w-1/8 h-1/2 bg-opacity-70 pointer-events-none"></div>
                        {/* Bloque bordeado con color verde que cubre un cuarto en el centro */}
                        <div className="absolute bottom-0 right-1/8 w-1/4 h-1/2 border-4 border-green-500 pointer-events-none"></div>
                        {/* Bloque opaco que cubre el último octavo de la parte inferior */}
                        <div className="absolute bottom-0 right-0 w-1/8 h-1/2 bg-opacity-70 pointer-events-none"></div>
                    </>
                )}
                
            </div>

            {/* Button at the bottom */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                {imageSrc ? (
                    <>
                        <button onClick={retake} className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                            Retomar captura
                        </button>
                        <button onClick={uploadImage} className="px-4 py-2 bg-green-500 text-white rounded ml-2 cursor-pointer">
                            Subir captura
                        </button>
                    </>
                ) : (
                    <button onClick={capture} className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                        Tomar captura
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomWebcam;