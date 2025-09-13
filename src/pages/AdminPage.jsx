import React, { useRef, useEffect, useState } from 'react';

import * as tf from '@tensorflow/tfjs';
import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from '@mediapipe/tasks-vision';
import TrainingModule from '../TrainingModule';

const LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

function AdminPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [handLandmarker, setHandLandmarker] = useState(null);
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState([]);
  const [predictedLetter, setPredictedLetter] = useState('?');
  const [isLoadingModel, setIsLoadingModel] = useState(true);

  const [webcamRunning, setWebcamRunning] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const [recordedData, setRecordedData] = useState({});
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
        '/wasm' //
      );
      const newHandLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `/models/hand_landmarker.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      });
      setHandLandmarker(newHandLandmarker);
    };
    createHandLandmarker();
  }, []);

  useEffect(() => {
    const loadModelAndLabels = async () => {
      try {
        // Muat model dari folder public/models
        const loadedModel = await tf.loadLayersModel(
          '/models/bisindo-model.json'
        );
        setModel(loadedModel);

        // Muat label dari folder public/models
        const labelsResponse = await fetch('/models/bisindo-labels.json');
        const loadedLabels = await labelsResponse.json();
        setLabels(loadedLabels);

        console.log('Model dan Label berhasil dimuat secara otomatis!');
      } catch (error) {
        console.error('Gagal memuat model secara otomatis:', error);
      } finally {
        setIsLoadingModel(false);
      }
    };
    loadModelAndLabels();
  }, []);

  const enableCam = () => {
    if (!handLandmarker || webcamRunning) return;
    setWebcamRunning(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
  };

  const toggleDetection = () => {
    console.log("Tombol 'Mulai/Hentikan Prediksi' diklik!");
    setIsDetecting((prev) => !prev);
  };

  useEffect(() => {
    if (isDetecting) {
      predictWebcam();
    }
  }, [isDetecting]);

  const startRecording = (letter) => {
    setCurrentLetter(letter);
    setIsRecording(true);
    const letterFrames = [];

    const recordInterval = setInterval(() => {
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
        setRecordedData((prevData) => ({
          ...prevData,
          [letter]: letterFrames,
        }));
        saveLetterData(letter, letterFrames);
      }
    }, 3000); // Durasi perekaman 3 detik
  };

  // TIDAK DI PAKE NAMUN PENTING UNTUK DEBUGGING dan PENGEMBANGAN
  // const loadModel = async () => {
  //   const jsonFile = modelJsonRef.current.files[0];
  //   const weightsFile = modelWeightsRef.current.files[0];
  //   const labelsFile = labelsRef.current.files[0];

  //   if (!jsonFile || !weightsFile || !labelsFile) {
  //     alert(
  //       "Harap pilih ketiga file: model.json, model.weights.bin, dan labels.json"
  //     );
  //     return;
  //   }

  //   try {
  //     const loadedModel = await tf.loadLayersModel(
  //       tf.io.browserFiles([jsonFile, weightsFile])
  //     );
  //     setModel(loadedModel);

  //     const reader = new FileReader();
  //     reader.onload = (e) => setLabels(JSON.parse(e.target.result));
  //     reader.readAsText(labelsFile);

  //     console.log("Model dan Label berhasil dimuat!");
  //     alert("Model dan Label berhasil dimuat!");
  //   } catch (error) {
  //     console.error("Gagal memuat model:", error);
  //     alert("Gagal memuat model. Cek console untuk detail.");
  //   }
  // };

  const saveLetterData = (letter, data) => {
    const dataStr = JSON.stringify(data);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `dataset_${letter}.json`;
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const predictWebcam = () => {
    if (!isDetecting || !videoRef.current) {
      if (isDetecting) window.requestAnimationFrame(predictWebcam);
      return;
    }

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
    const canvasCtx = canvas.getContext('2d');
    const results = handLandmarker.detectForVideo(video, Date.now());

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.landmarks && results.landmarks.length > 0) {
      // Gambar hasil deteksi tangan di kanvas
      // (Komentar ini untuk mengingatkan bahwa bagian ini bisa diaktifkan kembali jika diperlukan)
      // --- BAGIAN GAMBARAN TANGAN DINONAKTIFKAN SEMENTARA ---

      // const drawingUtils = new DrawingUtils(canvasCtx);
      // for (const landmark of results.landmarks) {
      //   drawingUtils.drawConnectors(landmark, HandLandmarker.HAND_CONNECTIONS, {
      //     color: "#22d3ee",
      //     lineWidth: 4,
      //   });
      //   drawingUtils.drawLandmarks(landmark, {
      //     color: "#c026d3",
      //     lineWidth: 1,
      //     radius: 4,
      //   });
      // }

      // --- LOG DIAGNOSTIK ---

      console.log(
        'Mencoba prediksi. Status Model:',
        model,
        'Status Labels:',
        labels
      );

      if (model && labels.length > 0) {
        console.log('%cBerhasil masuk ke blok prediksi!', 'color: lightgreen;');

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

        console.log(
          `Indeks Prediksi: ${predictedIndex}, Huruf: ${labels[predictedIndex]}`
        );

        setPredictedLetter(labels[predictedIndex]);
        tf.dispose([inputTensor, prediction]);
      }
    }

    window.requestAnimationFrame(predictWebcam);
  };
  return (
    <div className='bg-gray-800 min-h-screen text-white p-4 flex flex-col items-center space-y-6'>
      {/* BAGIAN 1: JUDUL DAN PREDIKSI */}
      <div className='w-full max-w-2xl flex flex-col items-center'>
        <h1 className='text-3xl font-bold mb-4 text-center'>
          Auri: Pengenalan BISINDO Real-time
        </h1>
        <div className='w-full border-4 border-cyan-500 rounded-lg shadow-lg relative'>
          <video
            ref={videoRef}
            className='w-full h-auto rounded-md z-10'
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className='absolute top-0 left-0 w-full h-full z-20'
          />
          <div className='absolute bottom-2 right-2 bg-black bg-opacity-70 text-white font-bold p-4 rounded-md z-30 text-6xl'>
            {predictedLetter}
          </div>
          {isRecording && (
            <div className='absolute top-2 left-2 bg-red-600 text-white font-bold p-2 rounded-md z-30 animate-pulse'>
              Merekam Huruf: {currentLetter}
            </div>
          )}
        </div>

        <div className='flex flex-wrap justify-center items-center gap-4 my-4'>
          <button
            onClick={enableCam}
            disabled={!handLandmarker || webcamRunning}
            className='btn-primary'
          >
            Nyalakan Webcam
          </button>

          {isLoadingModel ? (
            <p className='text-cyan-300 font-semibold animate-pulse'>
              ⏳ Memuat Model AI...
            </p>
          ) : (
            <button
              onClick={toggleDetection}
              disabled={!webcamRunning}
              className={`btn-secondary ${
                isDetecting ? 'bg-red-500' : 'bg-green-500'
              }`}
            >
              {isDetecting ? 'Hentikan Prediksi' : 'Mulai Prediksi'}
            </button>
          )}
        </div>
      </div>

      {/* GARIS PEMISAH */}
      <hr className='border-gray-600 w-full max-w-4xl' />

      {/* BAGIAN 2: PEREKAMAN DATA */}
      <div className='w-full max-w-4xl p-4 bg-gray-700 rounded-lg'>
        <h2 className='text-xl font-semibold mb-2 text-center'>
          Perekaman Dataset (Otomatis Menyimpan per Huruf)
        </h2>
        <div className='grid grid-cols-5 md:grid-cols-9 gap-2'>
          {LETTERS.map((letter) => (
            <button
              key={letter}
              onClick={() => startRecording(letter)}
              disabled={!isDetecting || isRecording}
              className='btn-letter'
            >
              {letter}{' '}
              <span className='text-xs text-cyan-300 block'>
                ({recordedData[letter]?.length || 0})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* GARIS PEMISAH */}
      <hr className='border-gray-600 w-full max-w-4xl' />

      {/* BAGIAN 3: PELATIHAN MODEL */}
      <TrainingModule />
    </div>
  );
}

export default AdminPage;
