import React from 'react';
import kamusData from '../data/kamusData.json'; // Impor "database" kita

// Komponen Ikon
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
const ChevronRightIcon = () => (
  <svg
    className='w-6 h-6 text-white'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M9 5l7 7-7 7'
    />
  </svg>
);

function DetailPage({ letter, onBack, onStartChallenge }) {
  // Ambil data spesifik untuk huruf yang dipilih dari file JSON
  const detail = kamusData[letter];

  // Pengaman jika data tidak ditemukan
  if (!detail) {
    return (
      <div>
        <p>Detail untuk huruf "{letter}" tidak ditemukan.</p>
        <button onClick={onBack}>Kembali</button>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full bg-white font-[var(--font-nunito)] text-gray-800'>
      <div className='w-full max-w-md mx-auto'>
        {/* Header Tetap (Sticky) */}
        <header className='sticky top-0 bg-white bg-opacity-80 backdrop-blur-sm z-20 py-4 px-4 flex items-center gap-4 border-b border-gray-200'>
          <button onClick={onBack} className='p-2 -ml-2'>
            <ArrowLeftIcon />
          </button>
          <h1 className='text-2xl font-bold'>{detail.title}</h1>
        </header>

        {/* Konten Utama */}
        <main className='p-4 flex flex-col gap-6'>
          {/* Gambar Utama */}
          <div className='w-full bg-white rounded-xl border-2 border-gray-200 p-4 flex flex-col items-center gap-4'>
            <img
              src={detail.image}
              alt={detail.title}
              className='w-48 h-auto object-contain'
            />
            <p className='text-4xl font-bold text-gray-600'>{letter}</p>
          </div>

          {/* Langkah-langkah */}
          <div>
            <h2 className='text-xl font-bold mb-2'>Langkah-langkah:</h2>
            <ul className='list-disc list-inside space-y-2 text-gray-700'>
              {detail.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          {/* Tombol Aksi */}
          <button
            onClick={onStartChallenge}
            className='w-full mt-4 bg-[#099FE5] text-white font-bold text-lg py-4 px-6 rounded-xl flex justify-between items-center shadow-lg hover:bg-blue-600 transition'
          >
            <span>Coba Sekarang</span>
            <ChevronRightIcon />
          </button>
        </main>
      </div>
    </div>
  );
}

export default DetailPage;
