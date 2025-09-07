import React from 'react';

// IDE EKSEKUSI: Latar belakang yang rumit dari Figma diubah menjadi satu SVG
// Ini jauh lebih bersih, responsif, dan performan daripada banyak div.
const ChallengeBackground = () => (
  <svg
    className='absolute inset-0 w-full h-full z-0'
    preserveAspectRatio='none'
    viewBox='0 0 408 176'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    {/* Warna Latar Utama */}
    <path
      d='M16 0H392C401.373 0 409 7.62742 409 17V159C409 168.373 401.373 176 392 176H16C6.62742 176 0 168.373 0 159V17C0 7.62742 6.62742 0 16 0Z'
      fill='#DAF0FF'
    />
    {/* Awan-awan */}
    <circle
      cx='50'
      cy='30'
      r='50'
      fill='#E5F9FF'
      opacity='0.7'
      transform='rotate(10 50 80)'
    />
    <circle
      cx='180'
      cy='40'
      r='65'
      fill='#E5F9FF'
      opacity='0.7'
      transform='rotate(-5 180 40)'
    />
    <circle
      cx='350'
      cy='50'
      r='55'
      fill='#E5F9FF'
      opacity='0.7'
      transform='rotate(7 350 50)'
    />
    {/* Bukit-bukit Hijau */}
    <circle cx='20' cy='180' r='70' fill='#9DEA3D' />
    <circle cx='120' cy='190' r='80' fill='#9DEA3D' />
    <circle cx='250' cy='185' r='85' fill='#9DEA3D' />
    <circle cx='380' cy='190' r='75' fill='#9DEA3D' />
  </svg>
);

function ChallengeBanner({ onClick }) {
  return (
    // Container utama dengan position relative
    <div className='w-full rounded-2xl relative overflow-hidden'>
      {/* Latar Belakang SVG diletakkan di lapisan paling bawah */}
      <ChallengeBackground />

      {/* Konten Teks & Tombol diletakkan di atas latar belakang */}
      <div className='relative z-10 p-6 flex flex-col gap-2'>
        <h3 className='text-lg font-bold text-gray-800'>
          Coba bentuk sesuai namamu!
        </h3>
        <p className='text-sm text-gray-700'>
          Bentuk huruf namamu menggunakan bahasa isyarat BISINDO!
        </p>
        <button
          onClick={onClick}
          className='mt-2 bg-[#FF9600] text-white font-bold py-3 rounded-full shadow-[0_4px_0_0_#D98000] hover:bg-orange-500 active:shadow-none active:translate-y-0.5 transition-all duration-150'
        >
          Coba Sekarang!
        </button>
      </div>
    </div>
  );
}

export default ChallengeBanner;
