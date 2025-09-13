import React from 'react';
import angkaData from '../data/angkaData.json'; // Impor data dari file JSON

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

function AngkaDetailPage({ number, onBack }) {
  // Ambil data spesifik untuk angka yang dipilih dari file JSON
  const detail = angkaData[number];

  // Pengaman jika data tidak ditemukan
  if (!detail) {
    return (
      <div className='p-4'>
        <p>Detail untuk angka "{number}" tidak ditemukan.</p>
        <button onClick={onBack} className='btn-primary mt-4'>
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full bg-white font-[var(--font-nunito)] text-gray-800'>
      <div className='w-full max-w-md mx-auto'>
        <header className='sticky top-0 bg-white bg-opacity-80 backdrop-blur-sm z-20 py-4 px-4 flex items-center gap-4 border-b border-gray-200'>
          <button onClick={onBack} className='p-2 -ml-2'>
            <ArrowLeftIcon />
          </button>
          <h1 className='text-2xl font-bold'>{detail.title}</h1>
        </header>

        <main className='p-4 flex flex-col gap-6'>
          {/* Gambar Utama */}
          <div className='w-full bg-white rounded-xl border-2 border-gray-200 p-4 flex flex-col items-center gap-4'>
            <img
              src={detail.image}
              alt={detail.title}
              className='w-48 h-auto object-contain'
            />
            <p className='text-4xl font-bold text-gray-600'>{number}</p>
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

          {/* Tombol Selesai */}
          <button
            onClick={onBack}
            className='w-full mt-4 bg-[#099FE5] text-white font-bold text-xl py-4 px-8 rounded-full shadow-lg hover:bg-blue-600 transition'
          >
            Selesai
          </button>
        </main>
      </div>
    </div>
  );
}

export default AngkaDetailPage;
