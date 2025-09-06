import React from 'react';

function LandingPage({ onStart }) {
  return (
    <div className='min-h-screen w-full bg-white flex flex-col justify-center items-center p-10 relative overflow-hidden'>
      {/* Bintang Kiri Atas */}
      <img
        src='/assets/bintang-kiri.svg'
        alt='Hiasan Bintang Kiri'
        className='absolute -top-1 -left-16 w-60 h-60 opacity-90 z-0'
      />

      {/* Bintang Kanan Bawah */}
      <img
        src='/assets/bintang-kanan.svg'
        alt='Hiasan Bintang Kanan'
        className='absolute -top-[-80px] -right-24 w-60 h-60 opacity-90 z-0'
      />

      {/* --- Konten Utama --- */}
      <main className='z-10 flex flex-col items-center gap-8 text-center mt-28'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 max-w-md leading-tight'>
          Cara gratis, menyenangkan, dan efektif untuk belajar BISINDO!
        </h1>
        <button
          onClick={onStart}
          className='w-full bg-[#099FE5] text-white font-bold text-md py-4 px-8 rounded-full shadow-[0_6px_0_0_#0887C3] hover:bg-[#0aadec] hover:shadow-[0_4px_0_0_#0887C3] active:shadow-none active:translate-y-1 transition-all duration-150'
        >
          Mulai Sekarang!
        </button>
      </main>
    </div>
  );
}

export default LandingPage;
