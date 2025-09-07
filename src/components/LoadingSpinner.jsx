import React, { useState, useEffect } from 'react';

// Sub-komponen untuk satu titik agar kode lebih bersih
// Menerima properti warna dan status aktif (untuk ukuran)
const Dot = ({ color, isActive }) => {
  const sizeClass = isActive ? 'w-12 h-12' : 'w-6 h-6'; // Ukuran besar jika aktif, kecil jika tidak
  return (
    <div
      className={`rounded-full ${color} ${sizeClass} transition-all duration-500 ease-in-out`}
    ></div>
  );
};

function LoadingSpinner() {
  // State untuk melacak kolom mana yang sedang "aktif" (0, 1, atau 2)
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Setiap 600 milidetik, pindah ke kolom aktif berikutnya
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 600);

    // Penting: bersihkan interval saat komponen tidak lagi ditampilkan
    return () => clearInterval(interval);
  }, []);

  // Definisikan warna untuk setiap kolom
  const colors = ['bg-[#89E219]', 'bg-[#099FE5]', 'bg-[#FF9600]'];

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className='p-5 bg-black rounded-lg border border-purple-500 shadow-lg'>
        <div className='grid grid-cols-3 gap-5'>
          {/* Baris 1 */}
          <Dot color={colors[0]} isActive={activeIndex === 0} />
          <Dot color={colors[1]} isActive={activeIndex === 1} />
          <Dot color={colors[2]} isActive={activeIndex === 2} />

          {/* Baris 2 */}
          <Dot color={colors[0]} isActive={activeIndex === 1} />
          <Dot color={colors[1]} isActive={activeIndex === 2} />
          <Dot color={colors[2]} isActive={activeIndex === 0} />

          {/* Baris 3 */}
          <Dot color={colors[0]} isActive={activeIndex === 2} />
          <Dot color={colors[1]} isActive={activeIndex === 0} />
          <Dot color={colors[2]} isActive={activeIndex === 1} />
        </div>
      </div>
      <p className='text-gray-500 font-semibold animate-pulse'>Memuat...</p>
    </div>
  );
}

export default LoadingSpinner;
