import React from 'react';
import ChallengeBanner from '../components/ChallengeBanner';

// Ikon-ikon ini masih diperlukan oleh komponen ini
const HamburgerIcon = () => (
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
const MateriCard = ({ title, onClick }) => (
  <button
    onClick={onClick}
    className='w-full p-4 bg-[#099FE5] text-white font-bold text-lg rounded-2xl flex justify-between items-center shadow-[0_4px_0_0_#0887C3] hover:bg-[#0aadec] active:shadow-none active:translate-y-0.5 transition-all duration-150'
  >
    <span>{title}</span>
    <ChevronRightIcon />
  </button>
);

// PERUBAHAN: Prop disederhanakan. Hanya menerima onMenuClick dan fungsi navigasi.
function BerandaPage({
  onNavigateToKamus,
  onNavigateToAngka,
  onNavigateToNamaChallenge,
  onMenuClick,
}) {
  const userName = 'Rafli';

  return (
    <div className='min-h-screen w-full bg-white p-6 font-[var(--font-nunito)] text-gray-800'>
      {/* SidebarMenu sudah tidak ada lagi di sini */}

      <div className='w-full max-w-md mx-auto flex flex-col gap-8'>
        <header className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold'>Hai, {userName}!</h1>
            <p className='text-gray-500'>Selamat datang!</p>
          </div>
          {/* PERUBAHAN: Tombol ini sekarang memanggil onMenuClick yang dikirim dari App.jsx */}
          <button onClick={onMenuClick} className='p-2'>
            <HamburgerIcon />
          </button>
        </header>

        {/* Bagian Materi (tidak berubah) */}
        <section>
          <h2 className='text-2xl font-bold mb-3'>Materi</h2>
          <div className='flex flex-col gap-3'>
            <MateriCard title='A-Z' onClick={onNavigateToKamus} />
            <MateriCard
              title='Angka 0-10'
              onClick={() => onNavigateToAngka()}
            />
            <MateriCard
              title='Tata Bahasa Dasar'
              onClick={() => alert('Fitur ini akan segera hadir!')}
            />
          </div>
        </section>

        {/* Bagian Tantangan (tidak berubah) */}
        <section>
          <h2 className='text-2xl font-bold mb-3'>Tantangan Sederhana!</h2>
          <ChallengeBanner onClick={onNavigateToNamaChallenge} />
        </section>
      </div>
    </div>
  );
}

export default BerandaPage;
