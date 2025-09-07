import React from 'react';

function SuccessPage({ spelledWord, onBackToHome }) {
  return (
    <div className='min-h-screen w-full bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden'>
      <img
        src='/assets/bintang-kiri.svg'
        alt='Hiasan Bintang'
        className='absolute top-4 -left-14 w-50 h-50 opacity-90 z-0'
      />
      <img
        src='/assets/bintang-kanan.svg'
        alt='Hiasan Bintang'
        className='absolute top-[80px] -right-24 w-55 h-55 opacity-90 z-0'
      />
      <img
        src='/assets/bintang-kiri.svg'
        alt='Hiasan Bintang'
        className='absolute bottom-1 -left-1 w-48 h-48 opacity-90 z-0 transform rotate-45'
      />
      {/* ---------------------------------------------------- */}

      <main className='z-10 flex flex-col items-center gap-4 text-center text-gray-800'>
        <p className='text-2xl font-bold'>Halo</p>

        {/* PERBAIKAN: Styling untuk kata yang dieja */}
        <div className='text-5xl font-extrabold text-black-500 tracking-widest p-4 rounded-lg uppercase'>
          {spelledWord || 'KATA'}
        </div>

        <p className='text-xl font-bold'>Senang berkenalan denganmu!</p>

        {/* PERBAIKAN: Styling tombol agar konsisten */}
        <button
          onClick={onBackToHome}
          className='mt-8 w-full max-w-lg bg-[#099FE5] text-white font-bold text-lg py-3 px-8 rounded-xl shadow-lg hover:bg-blue-600 transition'
        >
          Kembali ke Beranda
        </button>
      </main>
    </div>
  );
}

export default SuccessPage;
