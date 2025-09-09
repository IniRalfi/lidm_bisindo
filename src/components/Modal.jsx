import React from 'react';

// Ikon untuk tombol close
const CloseIcon = () => (
  <svg
    className='w-6 h-6 text-gray-400 hover:text-gray-800'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M6 18L18 6M6 6l12 12'
    />
  </svg>
);

function Modal({ isOpen, onClose, title, children }) {
  // Jika tidak 'isOpen', jangan tampilkan apa-apa
  if (!isOpen) return null;

  return (
    // Backdrop dengan efek kaca buram yang akan menimpa halaman di belakangnya
    <div className='fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-[var(--font-nunito)] animate-fade-in'>
      {/* Kartu Pop-up */}
      <div className='relative bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm flex flex-col items-center gap-4 text-center shadow-2xl animate-pop-in'>
        {/* Tombol Close di pojok kanan atas */}
        <button
          onClick={onClose}
          className='absolute top-2 right-2 p-2 rounded-full'
        >
          <CloseIcon />
        </button>

        {/* Judul Pop-up */}
        <h2 className='text-2xl font-bold text-gray-800 mt-4'>{title}</h2>

        {/* Konten Pop-up (bisa diisi apa saja) */}
        <div className='text-base text-gray-600 w-full'>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
