import React from 'react';

// Komponen Ikon sederhana
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

// Komponen Kartu Materi yang bisa digunakan ulang
const MateriCard = ({ title, onClick }) => (
  <button
    onClick={onClick}
    className='w-full p-4 bg-[#099FE5] text-white font-bold text-lg rounded-2xl flex justify-between items-center shadow-[0_4px_0_0_#0887C3] hover:bg-[#0aadec] active:shadow-none active:translate-y-0.5 transition-all duration-150'
  >
    <span>{title}</span>
    <ChevronRightIcon />
  </button>
);

function BerandaPage({ onNavigateToKamera, onNavigateToKamus }) {
  // Nama pengguna bisa dijadikan prop di masa depan
  const userName = 'Rafli';

  return (
    <div className='min-h-screen w-full bg-white p-6 font-[var(--font-nunito)] text-gray-800'>
      {/* Wrapper untuk membatasi lebar di layar besar dan memusatkan konten */}
      <div className='w-full max-w-md mx-auto flex flex-col gap-8'>
        {/* Header */}
        <header className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold'>Hai, {userName}!</h1>
            <p className='text-gray-500'>Selamat datang!</p>
          </div>
          <button className='p-2'>
            <HamburgerIcon />
          </button>
        </header>

        {/* Bagian Materi */}
        <section>
          <h2 className='text-2xl font-bold mb-3'>Materi</h2>
          <div className='flex flex-col gap-3'>
            <MateriCard title='A-Z' onClick={onNavigateToKamus} />
            <MateriCard
              title='Tata Bahasa Dasar'
              onClick={() => alert('Fitur ini akan segera hadir!')}
            />
          </div>
        </section>

        {/* Bagian Tantangan */}
        <section>
          <h2 className='text-2xl font-bold mb-3'>Tantangan Sederhana!</h2>
          {/* Catatan: Pola latar belakang dari Figma sangat kompleks.
              Saya sederhanakan menjadi warna solid untuk menjaga kode tetap bersih,
              namun tetap mempertahankan nuansa desainnya.
            */}
          <div className='w-full bg-[#DAF0FF] p-6 rounded-2xl flex flex-col gap-2'>
            <h3 className='text-lg font-bold text-gray-800'>
              Coba bentuk sesuai namamu!
            </h3>
            <p className='text-sm text-gray-700'>
              Bentuk huruf namamu menggunakan bahasa isyarat BISINDO!
            </p>
            <button
              onClick={onNavigateToKamera}
              className='mt-2 bg-[#FF9600] text-white font-bold py-3 rounded-full shadow-[0_4px_0_0_#D98000] hover:bg-orange-500 active:shadow-none active:translate-y-0.5 transition-all duration-150'
            >
              Coba Sekarang!
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BerandaPage;
