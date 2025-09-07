import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from '@mediapipe/tasks-vision';

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

function NamaChallengePage({ onBack, onFinish }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  const [handLandmarker, setHandLandmarker] = useState(null);
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk logika game
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [predictedLetter, setPredictedLetter] = useState('...');
  const [spelledWord, setSpelledWord] = useState([]); // Menyimpan kata yang dieja
  const sessionPredictionsRef = useRef([]);

  // Setup & muat model (sama seperti sebelumnya)
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

  // Mengelola kamera (sama seperti sebelumnya)
  useEffect(() => {
    if (handLandmarker && model) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        });
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [handLandmarker, model]);

  // Loop prediksi (mirip, tapi hanya update state `predictedLetter`)
  const predictLoop = () => {
    if (!videoRef.current || !handLandmarker) return;
    const video = videoRef.current;
    if (video.videoWidth === 0) {
      animationFrameId.current = window.requestAnimationFrame(predictLoop);
      return;
    }
    const results = handLandmarker.detectForVideo(video, Date.now());
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    if (canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (results.landmarks && results.landmarks.length > 0) {
      // if (canvas) {
      //   const drawingUtils = new DrawingUtils(canvasCtx);
      //   drawingUtils.drawConnectors(
      //     results.landmarks[0],
      //     HandLandmarker.HAND_CONNECTIONS,
      //     { color: '#22d3ee' }
      //   );
      //   drawingUtils.drawLandmarks(results.landmarks[0], { color: '#c026d3' });
      // }

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
      const currentPrediction = labels[predictedIndex];
      setPredictedLetter(currentPrediction);

      if (isRecording) {
        sessionPredictionsRef.current.push(currentPrediction);
      }
      tf.dispose([inputTensor, prediction]);
    }
    animationFrameId.current = window.requestAnimationFrame(predictLoop);
  };

  useEffect(() => {
    // Mengontrol loop
    if (!isLoading) {
      animationFrameId.current = window.requestAnimationFrame(predictLoop);
    }
    return () => {
      if (animationFrameId.current)
        window.cancelAnimationFrame(animationFrameId.current);
    };
  }, [isLoading, isRecording, model]);

  // Fungsi untuk menganalisis hasil rekaman 3 detik
  const evaluateSession = () => {
    const predictions = sessionPredictionsRef.current;
    if (predictions.length === 0) {
      alert(
        'Gerakan tidak terdeteksi. Pastikan tangan Anda terlihat jelas di kamera.'
      );
      return;
    }
    // Cari huruf yang paling sering muncul
    const mode = predictions
      .sort(
        (a, b) =>
          predictions.filter((v) => v === a).length -
          predictions.filter((v) => v === b).length
      )
      .pop();

    setSpelledWord((prev) => [...prev, mode]);
  };

  // Fungsi untuk memulai rekaman
  const handleStartRecording = () => {
    if (isRecording) return;
    setIsRecording(true);
    setCountdown(3);
    sessionPredictionsRef.current = [];

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      setIsRecording(false);
      evaluateSession();
    }, 3000);
  };

  // Fungsi BARU untuk mengulangi huruf terakhir
  const handleRepeat = () => {
    setSpelledWord((prev) => prev.slice(0, -1)); // Hapus huruf terakhir
  };

  const handleFinish = () => {
    if (spelledWord.length > 0) {
      onFinish(spelledWord.join(''));
    } else {
      alert('Anda belum membentuk huruf apapun!');
    }
  };

  return (
    <div className='min-h-screen w-full bg-white text-gray-800'>
      <div className='w-full max-w-md mx-auto'>
        <header className='sticky top-0 bg-white bg-opacity-80 backdrop-blur-sm z-20 py-4 px-4 flex items-center gap-4 border-b border-gray-200'>
          <button onClick={onBack} className='p-2 -ml-2'>
            <ArrowLeftIcon />
          </button>
          <h1 className='text-2xl font-bold'>Bentuk Katamu!</h1>
        </header>

        <main className='p-4 flex flex-col gap-6'>
          <div className='w-full aspect-video bg-gray-900 rounded-xl border-4 border-blue-400 overflow-hidden relative'>
            {isLoading && (
              <p className='absolute inset-0 flex items-center justify-center text-gray-500'>
                Memuat...
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

          <div className='p-4 bg-gray-100 rounded-lg min-h-[80px] flex flex-wrap items-center justify-center gap-2'>
            {spelledWord.length === 0 && (
              <span className='text-gray-400'>
                Kotak huruf akan muncul di sini...
              </span>
            )}
            {spelledWord.map((char, index) => (
              <div
                key={index}
                className='w-12 h-16 rounded-lg flex items-center justify-center text-2xl font-bold bg-green-500 text-white animate-pop-in'
              >
                {char}
              </div>
            ))}
          </div>

          {/* Tampilkan Langkah-langkah hanya jika belum ada huruf */}
          {spelledWord.length === 0 && (
            <div>
              <h2 className='text-xl font-bold mb-2'>Langkah-langkah:</h2>
              <div className='text-gray-700 space-y-1'>
                <p>1. Arahkan tanganmu ke kamera untuk membentuk satu huruf.</p>
                <p>
                  2. Klik <strong>'Mulai Rekam!'</strong> untuk merekam huruf
                  pertama selama 3 detik.
                </p>
              </div>
            </div>
          )}

          <div className='mt-4 flex flex-col gap-3'>
            {/* Tampilkan tombol "Mulai" jika belum ada huruf */}
            {spelledWord.length === 0 ? (
              <button
                onClick={handleStartRecording}
                disabled={isLoading || isRecording}
                className={`w-full text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 disabled:opacity-50 ${
                  isRecording ? 'bg-[#D80000]' : 'bg-blue-500'
                }`}
              >
                {isRecording ? `Merekam... ${countdown}` : 'Mulai Rekam!'}
              </button>
            ) : (
              // PERUBAHAN DI SINI: Tombol disusun ke bawah
              <div className='flex flex-col gap-3'>
                <button
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className='w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 disabled:opacity-50'
                >
                  {isRecording ? `Merekam... ${countdown}` : 'Lanjut'}
                </button>
                <button
                  onClick={handleRepeat}
                  disabled={isRecording}
                  className='w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 disabled:opacity-50'
                >
                  Ulangi
                </button>
                <button
                  onClick={handleFinish}
                  disabled={isRecording}
                  className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 disabled:opacity-50'
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default NamaChallengePage;
