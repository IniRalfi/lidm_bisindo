import React, { useRef, useEffect, useState } from "react";

import * as tf from "@tensorflow/tfjs";
import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import TrainingModule from "./TrainingModule"; // Kita akan buat file ini selanjutnya

const LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const modelJsonRef = useRef(null);
  const modelWeightsRef = useRef(null);
  const labelsRef = useRef(null);

  const [handLandmarker, setHandLandmarker] = useState(null);
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState([]);
  const [predictedLetter, setPredictedLetter] = useState("?");

  const [webcamRunning, setWebcamRunning] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const [recordedData, setRecordedData] = useState({}); // Menyimpan data per huruf
  const [isRecording, setIsRecording] = useState(false);
  const [currentLetter, setCurrentLetter] = useState(null);

  const isRecordingRef = useRef(false);
  const currentLetterRef = useRef(null);

  useEffect(() => {
    isRecordingRef.current = isRecording;
    currentLetterRef.current = currentLetter;
  }, [isRecording, currentLetter]);

  useEffect(() => {
    const createHandLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      const newHandLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `/models/hand_landmarker.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });
      setHandLandmarker(newHandLandmarker);
    };
    createHandLandmarker();
  }, []);

  const enableCam = () => {
    /* ... kode sama ... */
    if (!handLandmarker || webcamRunning) return;
    setWebcamRunning(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
  };

  const toggleDetection = () => setIsDetecting((prev) => !prev);
  useEffect(() => {
    if (isDetecting) predictWebcam();
  }, [isDetecting]);

  // --- PERUBAHAN UTAMA DI SINI ---
  const startRecording = (letter) => {
    setCurrentLetter(letter);
    setIsRecording(true);
    const letterFrames = []; // Penampung sementara hanya untuk sesi ini

    const recordInterval = setInterval(() => {
      // Setiap frame, kita rekam jika ada landmarks
      const video = videoRef.current;
      if (video && handLandmarker) {
        const results = handLandmarker.detectForVideo(video, Date.now());
        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0].flatMap((lm) => [
            lm.x,
            lm.y,
            lm.z,
          ]);
          letterFrames.push({ letter: letter, landmarks });
        }
      }
    }, 100); // Rekam data setiap 100ms

    setTimeout(() => {
      clearInterval(recordInterval);
      setIsRecording(false);
      setCurrentLetter(null);

      if (letterFrames.length > 0) {
        // Simpan data baru ke state utama
        setRecordedData((prevData) => ({
          ...prevData,
          [letter]: letterFrames,
        }));
        // Langsung unduh file JSON untuk huruf ini
        saveLetterData(letter, letterFrames);
      }
    }, 3000); // Durasi perekaman 3 detik
  };

  const loadModel = async () => {
    const jsonFile = modelJsonRef.current.files[0];
    const weightsFile = modelWeightsRef.current.files[0];
    const labelsFile = labelsRef.current.files[0];

    if (!jsonFile || !weightsFile || !labelsFile) {
      alert(
        "Harap pilih ketiga file: model.json, model.weights.bin, dan labels.json"
      );
      return;
    }

    try {
      const loadedModel = await tf.loadLayersModel(
        tf.io.browserFiles([jsonFile, weightsFile])
      );
      setModel(loadedModel);

      const reader = new FileReader();
      reader.onload = (e) => setLabels(JSON.parse(e.target.result));
      reader.readAsText(labelsFile);

      console.log("Model dan Label berhasil dimuat!");
      alert("Model dan Label berhasil dimuat!");
    } catch (error) {
      console.error("Gagal memuat model:", error);
      alert("Gagal memuat model. Cek console untuk detail.");
    }
  };

  const saveLetterData = (letter, data) => {
    const dataStr = JSON.stringify(data);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `dataset_${letter}.json`;
    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const predictWebcam = () => {
    if (!isDetecting || !videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0) {
      window.requestAnimationFrame(predictWebcam);
      return;
    }

    const canvas = canvasRef.current;
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    const canvasCtx = canvas.getContext("2d");
    const results = handLandmarker.detectForVideo(video, Date.now());

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    if (results.landmarks && results.landmarks.length > 0) {
      const drawingUtils = new DrawingUtils(canvasCtx);
      for (const landmark of results.landmarks) {
        drawingUtils.drawConnectors(landmark, HandLandmarker.HAND_CONNECTIONS, {
          color: "#22d3ee",
          lineWidth: 4,
        });
        drawingUtils.drawLandmarks(landmark, {
          color: "#c026d3",
          lineWidth: 1,
          radius: 4,
        });
      }

      // Logika Prediksi
      if (model && labels.length > 0) {
        const landmarks = results.landmarks[0].flatMap((lm) => [
          lm.x,
          lm.y,
          lm.z,
        ]);
        const inputTensor = tf.tensor2d([landmarks]);

        const prediction = model.predict(inputTensor);
        const predictionData = prediction.dataSync();
        const predictedIndex = predictionData.indexOf(
          Math.max(...predictionData)
        );

        setPredictedLetter(labels[predictedIndex]);

        tf.dispose([inputTensor, prediction]); // Penting untuk memori
      }
    }

    window.requestAnimationFrame(predictWebcam);
  };

  return (
    <div className="bg-gray-800 min-h-screen text-white p-4 space-y-8">
      {/* Bagian Perekaman */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Perekaman Dataset BISINDO
        </h1>
        {/* ... (UI Video & Tombol Kontrol sama) ... */}
        <div className="w-full max-w-2xl border-4 border-cyan-500 rounded-lg shadow-lg relative">
          <video
            ref={videoRef}
            className="w-full h-auto rounded-md z-10"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-20"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white font-bold p-4 rounded-md z-30 text-6xl">
            {predictedLetter}
          </div>

          {isRecording && (
            <div className="absolute top-2 left-2 bg-red-600 text-white font-bold p-2 rounded-md z-30 animate-pulse">
              Merekam Huruf: {currentLetter}
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-center items-end gap-4 my-4">
          <button
            onClick={enableCam}
            disabled={!handLandmarker || webcamRunning}
            className="btn-primary"
          >
            Nyalakan Webcam
          </button>
          <button
            onClick={toggleDetection}
            disabled={!webcamRunning || !model}
            className={`btn-secondary ${
              isDetecting ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {isDetecting ? "Hentikan Deteksi" : "Mulai Prediksi"}
          </button>
          <div className="flex flex-col items-center gap-2 p-2 border border-gray-600 rounded-lg">
            <p className="text-xs">Pilih 3 File Model:</p>
            <div className="flex gap-2">
              <input
                type="file"
                ref={modelJsonRef}
                accept=".json"
                className="file-input"
              />
              <input
                type="file"
                ref={modelWeightsRef}
                accept=".bin"
                className="file-input"
              />
              <input
                type="file"
                ref={labelsRef}
                accept=".json"
                className="file-input"
              />
            </div>
            <button onClick={loadModel} className="btn-primary text-sm w-full">
              Muat Model
            </button>
          </div>
        </div>
        <div className="w-full max-w-4xl p-4 bg-gray-700 rounded-lg mt-4">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Klik huruf untuk merekam (otomatis menyimpan per huruf)
          </h2>
          <div className="grid grid-cols-5 md:grid-cols-9 gap-2">
            {LETTERS.map((letter) => (
              <button
                key={letter}
                onClick={() => startRecording(letter)}
                disabled={!isDetecting || isRecording}
                className="btn-letter"
              >
                {letter}{" "}
                <span className="text-xs text-cyan-300 block">
                  ({recordedData[letter]?.length || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Garis Pemisah */}
      <hr className="border-gray-600 w-full max-w-4xl mx-auto" />

      {/* Bagian Pelatihan Model (Komponen Baru) */}
      <TrainingModule />
    </div>
  );
}

export default App;
