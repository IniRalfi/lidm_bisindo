import React from 'react';

// Komponen Ikon
const HamburgerIcon = () => (
  <svg
    className='w-8 h-8 text-white'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M4 6h16M4 12h16m-7 6h7'
    />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    className='w-8 h-8 text-white'
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

// IDE EKSEKUSI: Komponen Kartu Kuis yang bisa digunakan ulang
// Ini membuat kode utama lebih bersih dan mudah dikelola.
const QuizCard = ({ title, onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full p-4 text-white font-bold text-lg rounded-2xl flex justify-between items-center transition-all duration-150 
            ${
              disabled
                ? 'bg-gray-400 shadow-[0_4px_0_0_#a0a0a0] cursor-not-allowed'
                : 'bg-[#099FE5] shadow-[0_4px_0_0_#0887C3] hover:bg-[#0aadec] active:shadow-none active:translate-y-0.5'
            }`}
  >
    <span>{title}</span>
    <ChevronRightIcon />
  </button>
);

function KuisPage({ onMenuClick, onNavigateToGame }) {
  return (
    <div className='min-h-screen w-full bg-white font-[var(--font-nunito)]'>
      {/* Header Oranye */}
      <header className='bg-[#FF9600] p-6 pb-12'>
        <div className='w-full max-w-md mx-auto flex justify-between items-center'>
          <h1 className='text-4xl font-bold text-white'>Kuis</h1>
          <button onClick={onMenuClick} className='p-2'>
            <HamburgerIcon />
          </button>
        </div>
      </header>

      {/* Konten Utama dengan efek "menjorok ke atas" */}
      <main className='w-full max-w-md mx-auto bg-white rounded-t-2xl -mt-6 p-6 flex flex-col gap-8'>
        {/* Bagian Kuis Dasar */}
        <section>
          <h2 className='text-2xl font-bold text-gray-800 mb-3'>Dasar</h2>
          <div className='flex flex-col gap-3'>
            <QuizCard
              title='Tebak Gambar dan Huruf'
              onClick={onNavigateToGame}
            />
          </div>
        </section>

        {/* Bagian Kuis Akan Hadir */}
        <section>
          <h2 className='text-2xl font-bold text-gray-400 mb-3'>Akan Hadir</h2>
          <div className='flex flex-col gap-3'>
            <QuizCard title='Tebak Kata Sehari-hari' disabled={true} />
            <QuizCard title='Tebak Kalimat' disabled={true} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default KuisPage;
