import React from 'react';

const Starburst = ({ className }) => (
  <svg
    className={`absolute ${className}`}
    viewBox='0 0 200 200'
    fill='#FFC800'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M100 0L121.23 60.36L180.9 69.1L139.64 110.36L152.45 170.9L100 139.64L47.55 170.9L60.36 110.36L19.1 69.1L78.77 60.36L100 0Z'
      transform='scale(1.5) rotate(15)'
    />
  </svg>
);

function SuccessPage({ spelledWord, onBackToHome }) {
  return (
    <div className='min-h-screen w-full bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-[var(--font-nunito)]'>
      {/* Hiasan Latar Belakang */}
      <Starburst className='top-1/4 -left-28 w-60 h-60 opacity-90' />
      <Starburst className='top-1/3 -right-24 w-72 h-72 opacity-90' />
      <Starburst className='bottom-1/4 -left-16 w-48 h-48 opacity-90' />

      <main className='z-10 flex flex-col items-center gap-6 text-center text-gray-800'>
        <p className='text-2xl font-bold'>Halo</p>
        <div className='text-6xl font-extrabold text-blue-500 tracking-widest border-4 border-blue-500 p-4 rounded-lg'>
          {spelledWord || 'KATA'}
        </div>
        <p className='text-2xl font-bold'>Senang berkenalan denganmu!</p>

        <button
          onClick={onBackToHome}
          className='mt-8 w-full max-w-sm bg-[#099FE5] text-white font-bold text-xl py-4 px-8 rounded-full shadow-lg hover:bg-blue-600 transition'
        >
          Kembali ke Beranda
        </button>
      </main>
    </div>
  );
}

export default SuccessPage;
