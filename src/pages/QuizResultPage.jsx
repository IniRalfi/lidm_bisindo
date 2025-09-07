import React from 'react';

function QuizResultPage({ score, totalQuestions, onFinish }) {
  const wrongAnswers = totalQuestions - score;

  return (
    // PERUBAHAN UTAMA DI SINI:
    // Ganti latar belakang hitam menjadi efek kaca buram (backdrop-blur)
    <div className='fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-[var(--font-nunito)] animate-fade-in'>
      {/* Kartu Hasil Kuis (tidak berubah) */}
      <div className='bg-white rounded-3xl border-4 border-gray-200 p-8 w-full max-w-md flex flex-col items-center gap-6 text-center'>
        <h1 className='text-4xl font-bold text-blue-500'>Kuis Selesai!</h1>

        {/* Detail Skor */}
        <div className='w-full flex flex-col gap-4 text-lg'>
          <div className='flex justify-between items-center'>
            <span className='font-bold text-gray-800'>Jenis Kuis</span>
            <span className='font-bold text-gray-500'>Dasar</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='font-bold text-gray-800'>Total Soal Benar</span>
            <span className='font-bold text-green-500'>{score} Soal</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='font-bold text-gray-800'>Total Soal Salah</span>
            <span className='font-bold text-red-500'>{wrongAnswers} Soal</span>
          </div>
        </div>

        {/* Tombol Selesai */}
        <button
          onClick={onFinish}
          className='w-full mt-4 bg-[#099FE5] text-white font-bold text-xl py-4 px-8 rounded-full shadow-lg hover:bg-blue-600 transition'
        >
          Selesai
        </button>
      </div>
    </div>
  );
}

export default QuizResultPage;
