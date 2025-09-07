import React, { useState, useEffect } from 'react';

// Urutan teks yang akan ditampilkan
const countdownSequence = ['3', '2', '1', 'Mulai!'];

function QuizCountdownPage({ onCountdownFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Jika urutan sudah selesai, panggil fungsi untuk pindah halaman
    if (currentIndex >= countdownSequence.length) {
      onCountdownFinish();
      return;
    }

    // Atur timer untuk mengubah teks setiap 1 detik
    const timer = setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, 1000);

    // Bersihkan timer jika komponen di-unmount (penting!)
    return () => clearTimeout(timer);
  }, [currentIndex, onCountdownFinish]);

  const currentText = countdownSequence[currentIndex];
  // Cek apakah teks saat ini adalah angka atau bukan
  const isNumber = !isNaN(parseInt(currentText));

  return (
    <div className='min-h-screen w-full bg-white flex justify-center items-center overflow-hidden font-[var(--font-nunito)]'>
      {/* Tampilkan teks hanya jika belum selesai */}
      {currentText && (
        <h1
          // `key` di sini adalah trik untuk me-reset animasi setiap kali teks berubah
          key={currentText}
          // PERUBAHAN DI SINI: Ukuran font sekarang kondisional
          className={`font-extrabold text-[#099FE5] animate-pop-in ${
            isNumber ? 'text-[20rem]' : 'text-8xl' // Ukuran besar untuk angka, lebih kecil untuk "Mulai!"
          }`}
        >
          {currentText}
        </h1>
      )}
    </div>
  );
}

export default QuizCountdownPage;
