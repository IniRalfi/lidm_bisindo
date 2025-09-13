import React, { useState, useEffect } from 'react';

const countdownSequence = ['3', '2', '1', 'Mulai!'];

function QuizCountdownPage({ onCountdownFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= countdownSequence.length) {
      onCountdownFinish();
      return;
    }

    // Atur timer untuk mengubah teks setiap 1 detik
    const timer = setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, onCountdownFinish]);

  const currentText = countdownSequence[currentIndex];
  const isNumber = !isNaN(parseInt(currentText));

  return (
    <div className='min-h-screen w-full bg-white flex justify-center items-center overflow-hidden font-[var(--font-nunito)]'>
      {/* Tampilkan teks hanya jika belum selesai */}
      {currentText && (
        <h1
          key={currentText}
          className={`font-extrabold text-[#099FE5] animate-pop-in ${
            isNumber ? 'text-[20rem]' : 'text-8xl'
          }`}
        >
          {currentText}
        </h1>
      )}
    </div>
  );
}

export default QuizCountdownPage;
