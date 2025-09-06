import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from '@mediapipe/tasks-vision';
import kamusData from '../data/kamusData.json'; // Path sudah diperbaiki

const ArrowLeftIcon = () => (
  <svg
    className='w-8 h-8 text-gray-800'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M15 19l-7-7 7-7'
    />
  </svg>
);

function ChallengePage({ letter, onBack }) {
  const detail = kamusData[letter];

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null); // Ref untuk mengontrol loop animasi

  const [handLandmarker, setHandLandmarker] = useState(null);
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [countdown, setCountdown] = useState(5);
  const [isRecording, setIsRecording] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState('idle');
  const predictionsRef = useRef([]);

  // HANYA untuk setup model dan MediaPipe sekali saja
  useEffect(() => {
    const setup = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks('/wasm');
        const newHandLandmarker = await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: `/models/hand_landmarker.task`,
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 1,
          }
        );
        setHandLandmarker(newHandLandmarker);

        const loadedModel = await tf.loadLayersModel(
          '/models/bisindo-model.json'
        );
        setModel(loadedModel);
        const labelsResponse = await fetch('/models/bisindo-labels.json');
        const loadedLabels = await labelsResponse.json();
        setLabels(loadedLabels);
      } catch (error) {
        console.error('Gagal setup:', error);
      } finally {
        setIsLoading(false);
      }
    };
    setup();
  }, []);

  // useEffect terpisah HANYA untuk mengelola kamera
  useEffect(() => {
    if (handLandmarker && model) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        });
    }
    return () => {
      // Fungsi cleanup kamera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [handLandmarker, model]);

  // Loop prediksi utama
  const predictLoop = () => {
    if (!videoRef.current || !handLandmarker) return;

    const video = videoRef.current;

    // --- PERBAIKAN DI SINI ---
    // Tambahkan pengecekan untuk memastikan video sudah siap dengan ukurannya
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      animationFrameId.current = window.requestAnimationFrame(predictLoop);
      return; // Lewati frame ini jika video belum siap
    }
    // -------------------------

    const results = handLandmarker.detectForVideo(video, Date.now());
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    if (canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (results.landmarks && results.landmarks.length > 0) {
      if (canvas) {
        const drawingUtils = new DrawingUtils(canvasCtx);
        drawingUtils.drawConnectors(
          results.landmarks[0],
          HandLandmarker.HAND_CONNECTIONS,
          { color: '#22d3ee' }
        );
        drawingUtils.drawLandmarks(results.landmarks[0], { color: '#c026d3' });
      }

      if (isRecording && model) {
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
        const predictedLetter = labels[predictedIndex];
        console.log('Prediksi terekam:', predictedLetter);
        predictionsRef.current.push(predictedLetter);
        tf.dispose([inputTensor, prediction]);
      }
    }
    animationFrameId.current = window.requestAnimationFrame(predictLoop);
  };

  // useEffect terpisah HANYA untuk MENGONTROL loop prediksi
  useEffect(() => {
    if (!isLoading) {
      animationFrameId.current = window.requestAnimationFrame(predictLoop);
    }
    return () => {
      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isLoading, isRecording, model]); // Loop akan di-restart dengan state terbaru jika dependensi ini berubah

  const handleStartChallenge = () => {
    if (isRecording) return;
    setChallengeStatus('recording');
    setIsRecording(true);
    setCountdown(5);
    predictionsRef.current = [];
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    setTimeout(() => {
      clearInterval(timer);
      setIsRecording(false);
      evaluateChallenge();
    }, 5000);
  };

  const evaluateChallenge = () => {
    const predictions = predictionsRef.current;
    console.log('--- EVALUASI TANTANGAN ---');
    console.log('Huruf target:', letter);
    console.log('Semua prediksi:', predictions);

    if (predictions.length < 5) {
      // Membutuhkan minimal beberapa frame untuk dianggap valid
      console.error('Prediksi yang terekam terlalu sedikit.');
      setChallengeStatus('failure');
    } else {
      const correctPredictions = predictions.filter((p) => p === letter).length;
      const accuracy = correctPredictions / predictions.length;
      console.log(`Akurasi: ${(accuracy * 100).toFixed(2)}%`);

      if (accuracy > 0.5) {
        // Turunkan ambang batas sedikit
        setChallengeStatus('success');
      } else {
        setChallengeStatus('failure');
      }
    }
    setTimeout(() => setChallengeStatus('idle'), 3000);
  };

  // ... (Fungsi getButtonClass dan getButtonText tidak berubah) ...
  const getButtonClass = () => {
    switch (challengeStatus) {
      case 'recording':
        return 'bg-[#D80000] shadow-[0_4px_0_0_#a80000]';
      case 'success':
        return 'bg-green-500 shadow-[0_4px_0_0_#15803d]';
      case 'failure':
        return 'bg-red-700 shadow-[0_4px_0_0_#991b1b]';
      default:
        return 'bg-[#099FE5] shadow-[0_4px_0_0_#0887C3] hover:bg-[#0aadec]';
    }
  };
  const getButtonText = () => {
    if (challengeStatus === 'recording') return `Rekam... ${countdown}`;
    if (challengeStatus === 'success') return 'Sukses!';
    if (challengeStatus === 'failure') return 'Salah, Coba Lagi';
    return 'Rekam';
  };

  return (
    <div className='min-h-screen w-full bg-white font-[var(--font-nunito)] text-gray-800'>
      <div className='w-full max-w-md mx-auto'>
        {/* ... (seluruh JSX tidak berubah) ... */}
        <header className='sticky top-0 bg-white bg-opacity-80 backdrop-blur-sm z-20 py-4 px-4 flex items-center gap-4 border-b border-gray-200'>
          <button onClick={onBack} className='p-2 -ml-2'>
            <ArrowLeftIcon />
          </button>
          <h1 className='text-2xl font-bold'>{detail?.title || 'Tantangan'}</h1>
        </header>

        <main className='p-4 flex flex-col gap-6'>
          <div className='w-full aspect-video bg-gray-200 rounded-xl border-4 border-blue-500 overflow-hidden relative'>
            {isLoading && (
              <p className='absolute inset-0 flex items-center justify-center text-gray-500'>
                Memuat Kamera & AI...
              </p>
            )}
            <video
              ref={videoRef}
              className='w-full h-full object-cover'
              autoPlay
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className='absolute top-0 left-0 w-full h-full'
            />
          </div>

          <div>
            <h2 className='text-xl font-bold mb-2'>Langkah-langkah:</h2>
            <ul className='list-disc list-inside space-y-2 text-gray-700'>
              {detail?.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className='text-center text-gray-600'>Timer : 5 detik</div>
          <button
            onClick={handleStartChallenge}
            disabled={isRecording || isLoading}
            className={`w-full text-white font-bold text-lg py-4 px-6 rounded-xl transition-all duration-200 ${getButtonClass()} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {getButtonText()}
          </button>
        </main>
      </div>
    </div>
  );
}

export default ChallengePage;
