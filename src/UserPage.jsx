import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from '@mediapipe/tasks-vision';

function UserPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [handLandmarker, setHandLandmarker] = useState(null);
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState([]);
  const [predictedLetter, setPredictedLetter] = useState('?');
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // 1. Setup MediaPipe
  useEffect(() => {
    const createHandLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks('/wasm');
      const newHandLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `/models/hand_landmarker.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      });
      setHandLandmarker(newHandLandmarker);
    };
    createHandLandmarker();
  }, []);

  // 2. Muat Model AI secara otomatis
  useEffect(() => {
    const loadModelAndLabels = async () => {
      try {
        const loadedModel = await tf.loadLayersModel(
          '/models/bisindo-model.json'
        );
        setModel(loadedModel);
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

  // 3. Logika untuk menyalakan webcam & prediksi
  const enableCam = () => {
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
    if (isDetecting) {
      predictWebcam();
    }
  }, [isDetecting, model]);

  const predictWebcam = () => {
    if (!isDetecting || !videoRef.current) return;
    // ... (sisa fungsi predictWebcam sama persis dengan yang sudah Anda buat)
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
      const drawingUtils = new DrawingUtils(canvasCtx);
      for (const landmark of results.landmarks) {
        drawingUtils.drawConnectors(landmark, HandLandmarker.HAND_CONNECTIONS, {
          color: '#22d3ee',
          lineWidth: 4,
        });
        drawingUtils.drawLandmarks(landmark, {
          color: '#c026d3',
          lineWidth: 1,
          radius: 4,
        });
      }

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
        tf.dispose([inputTensor, prediction]);
      }
    }
    window.requestAnimationFrame(predictWebcam);
  };

  return (
    <div className='bg-gray-800 min-h-screen text-white p-4 flex flex-col items-center justify-center'>
      <h1 className='text-4xl font-bold mb-4 text-center'>Isyara</h1>
      <p className='text-lg mb-8 text-gray-300'>
        Penerjemah Bahasa Isyarat BISINDO Real-time
      </p>

      <div className='w-full max-w-2xl border-4 border-cyan-500 rounded-lg shadow-lg relative'>
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
      </div>

      <div className='flex flex-wrap justify-center items-center gap-4 my-6'>
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
  );
}

export default UserPage;
