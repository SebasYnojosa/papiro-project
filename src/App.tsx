import CustomWebcam from "./CustomWebcam"


const App = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Webcam Capture</h1>
      <CustomWebcam />
      <p className="mt-4 text-gray-600">Capture your webcam feed!</p>
    </div>
  )
}

export default App