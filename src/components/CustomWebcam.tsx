import Webcam from "react-webcam";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const CustomWebcam = () => {
    const webcamRef = useRef<Webcam>(null);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [jugada, setJugada] = useState<number | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [isPredicted, setIsPredicted] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [counter, setCounter] = useState(3);
    
    const uploadImage = useCallback(async () => {
        console.log("uploadImage se ejecutó");
        if (!imageSrc) return;
        console.log("La imagen existe");
        

        const blob = await fetch(imageSrc).then((res) => res.blob());
        const file = new File([blob], "captura.png", { type: "image/jpeg"})
        
        const formData = new FormData();
        formData.append("image", file);

        setIsPredicting(true);

        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log("Image uploaded successfully:", response.data);
            const prediction_array = response.data.prediction[0];
            const jugada = prediction_array.indexOf(Math.max(...prediction_array));
            console.log("Predicción:", jugada);
            setJugada(jugada);
            setIsPredicted(true);
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsPredicting(false);
        }
    }, [imageSrc])


    const capture = useCallback(() => {
        setIsCapturing(true);
        setCounter(3); // Reinicia  el contador

        // Inicia el contador
        const interval = setInterval(() => {
            setCounter((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            })
        }, 1000)

        // Espera 3 segundos antes de capturar la imagen
        setTimeout(() => {
            const img = webcamRef.current?.getScreenshot();
            if (img) {
                setImageSrc(img);
            }

            setIsCapturing(false);
        }, 3000);

        
    }, [webcamRef]);

    // Llamada a uploadImage después de capturar la imagen
    useEffect(() => {
        if (imageSrc) {
            uploadImage();
        }
    }, [imageSrc, uploadImage]);

    const retake = () => {
        setImageSrc(null);
        setJugada(null);
        setIsPredicting(false);
        setIsPredicted(false);
        setIsCapturing(false);
    };

    

    const handleJugada = (jugada: number | null) => {
        if (jugada === 0) {
            return "Papel";
        } else if (jugada === 1) {
            return "Piedra";
        } else if (jugada === 2) {
            return "Tijera";
        } else {
            return "No se ha detectado una jugada";
        }
    };

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
                    </>
                ) : (
                    <button onClick={capture} className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                        Tomar captura
                    </button>
                )}
            </div>

            {/* Contador de 3 segundos para capturar la imagen */}
            {isCapturing && (
                <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow">
                    <p className="text-lg">{counter}</p>
                </div>
            )}

            {/* Analizando la imagen, con un contador que cuenta 3 segundos */}
            {isPredicting && (
                <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow">
                    <p>Analizando...</p>
                </div>
            )}

            {/* Resultado de la predicción */}
            {isPredicted && (
                handleJugada(jugada) == "Piedra" ? (
                    <img src="/public/piedra.png" alt="Piedra" className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2" />
                ) : handleJugada(jugada) == "Papel" ? (
                    <img src="/public/papel.png" alt="Papel" className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2" />
                ) : (
                    <img src="/public/tijera.png" alt="Tijera" className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2" />
                ) 
            )}
            
        </div>
    );
};

export default CustomWebcam;