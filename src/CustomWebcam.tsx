import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react"

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

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {imageSrc ? (
                <img src={imageSrc} alt="webcam" />
            ) : (
                <Webcam height={600} width={600} ref={webcamRef} />
            )}
            <div className="btn-container">
                {imageSrc ? (
                    <button onClick={retake}>Retake photo</button>
                ) : (
                    <button onClick={capture}>Capture photo</button>
                )}
            </div>
        </div>
    )
}

export default CustomWebcam