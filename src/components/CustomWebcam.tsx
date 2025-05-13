import Webcam from "react-webcam";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const CustomWebcam = () => {
    const webcamRef = useRef<Webcam>(null);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [jugada, setJugada] = useState<number | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [isPredicted, setIsPredicted] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [counter, setCounter] = useState(3);

    const [jugadaIA, setJugadaIA] = useState<number | null>(null);
    const navigate = useNavigate();

    const opciones = ["Papel", "Piedra", "Tijera"];

    
    
    const uploadImage = useCallback(async () => {
        console.log("uploadImage se ejecutó");
        const jugadaIA = elegirJugadaIA();
        const resultado = jugada !== null ? obtenerResultado(jugada, jugadaIA) : "Jugada no válida";
        console.log("IA:", jugadaIA, "Resultado:", resultado);

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

    

const elegirJugadaIA = () => {
    const eleccion = Math.floor(Math.random() * 3); // 0, 1, 2
    setJugadaIA(eleccion);
    return eleccion;
};

const obtenerResultado = (jugador: number, ia: number) => {
    if (jugador === ia) return "Empate";
    if (
        (jugador === 0 && ia === 1) || // Papel gana a Piedra
        (jugador === 1 && ia === 2) || // Piedra gana a Tijera
        (jugador === 2 && ia === 0)    // Tijera gana a Papel
    ) return "Ganaste";
    return "Perdiste";
};



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
            <button onClick={() => navigate('/instrucciones')} className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white rounded">
  Instrucciones
</button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                {imageSrc ? (
                    <>
                        <button onClick={retake} className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                            Intentar de nuevo
                        </button>
                    </>
                ) : (
                    <button onClick={capture} className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                        Empezar
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
            {isPredicted && jugadaIA !== null && (
  <div className="absolute top-3/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow">
    <p className="text-lg">IA: {handleJugada(jugadaIA)}</p>
    <p className="text-lg font-bold">{obtenerResultado(jugada!, jugadaIA)}</p>
  </div>
)}
            {/* Resultado de la predicción */}
            {isPredicted && jugada !== null && (
                <div className="absolute top-3/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow">
                    <p className="text-lg">Tu jugada: {handleJugada(jugada)}</p>
                </div>
            )}
            
        </div>
    );
};

export default CustomWebcam;