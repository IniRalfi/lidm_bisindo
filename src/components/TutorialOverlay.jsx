import React, { useState, useEffect } from 'react';
import { tutorialSteps } from '../data/tutorialData';

// Komponen Tooltip (tidak berubah)
const Tooltip = ({ step, onNext, onPrev, onSkip }) => {
  const isFirstStep = step.id === 'welcome';
  return (
    <div
      className={`absolute z-20 bg-white rounded-lg p-4 w-64 shadow-2xl animate-pop-in font-[var(--font-nunito)] ${
        step.isCentered
          ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          : step.positionClasses
      }`}
    >
      <h3 className='text-xl font-bold text-gray-800 text-center'>
        {step.title}
      </h3>
      <p className='text-sm text-gray-600 my-2 text-center whitespace-pre-line'>
        {step.text}
      </p>
      <div className='flex gap-2 mt-4'>
        {isFirstStep ? (
          <>
            <button
              onClick={onSkip}
              className='flex-1 bg-gray-400 text-white font-bold py-1 px-4 rounded-lg shadow-md hover:bg-gray-500 transition'
            >
              Tidak
            </button>
            <button
              onClick={onNext}
              className='flex-1 bg-blue-500 text-white font-bold py-1 px-4 rounded-lg shadow-md hover:bg-blue-600 transition'
            >
              Ayo!
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onPrev}
              className='flex-1 bg-blue-500 text-white font-bold py-1 px-4 rounded-lg shadow-md hover:bg-blue-600 transition'
            >
              Kembali
            </button>
            <button
              onClick={onNext}
              className='flex-1 bg-blue-500 text-white font-bold py-1 px-4 rounded-lg shadow-md hover:bg-blue-600 transition'
            >
              {step.id === 'tantangan' ? 'Selesai' : 'Lanjut'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

function TutorialOverlay({ onFinish }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState({ display: 'none' });

  const currentStep = tutorialSteps[stepIndex];

  // --- PERBAIKAN UTAMA DI SINI ---
  // Logika ini sekarang akan "sabar" menunggu elemen muncul
  useEffect(() => {
    if (currentStep.isCentered || !currentStep.highlightElementId) {
      setHighlightStyle({ display: 'none' });
      return;
    }

    let attempts = 0;
    const maxAttempts = 20; // Coba selama 1 detik (20 x 50ms)

    const interval = setInterval(() => {
      const element = document.getElementById(currentStep.highlightElementId);

      if (element) {
        // Jika elemen ditemukan, atur style dan hentikan pencarian
        clearInterval(interval);
        const rect = element.getBoundingClientRect();
        setHighlightStyle({
          width: `${rect.width + 20}px`,
          height: `${rect.height + 20}px`,
          top: `${rect.top - 10}px`,
          left: `${rect.left - 10}px`,
          display: 'block',
          borderRadius: '16px',
        });
      } else if (attempts >= maxAttempts) {
        // Jika setelah 1 detik elemen tetap tidak ada, hentikan pencarian
        clearInterval(interval);
      }
      attempts++;
    }, 50); // Coba setiap 50 milidetik

    // Penting: bersihkan interval jika komponen berubah
    return () => clearInterval(interval);
  }, [stepIndex, currentStep]);

  const handleNext = () => {
    if (stepIndex < tutorialSteps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 1) {
      setStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className='fixed inset-0 z-50 bg-gray-900 bg-opacity-30 backdrop-blur-sm animate-fade-in'>
      <div
        className='absolute bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] transition-all duration-300 ease-in-out'
        style={highlightStyle}
      ></div>
      <Tooltip
        step={currentStep}
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={onFinish}
      />
    </div>
  );
}

export default TutorialOverlay;
