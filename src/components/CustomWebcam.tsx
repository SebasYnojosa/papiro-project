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
            <div className="flex-1 flex items-center justify-center bg-gray-100">
                {imageSrc ? (
                    <img src={imageSrc} alt="webcam" />
                ) : (
                    <div className="text-center">
                        <p>La captura aparecerá aquí</p>
                    </div>
                )}
            </div>

            <div className="flex-1 bg-gray-200">
                <Webcam ref={webcamRef} className="w-full h-full object-cover"/>
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