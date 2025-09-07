import React from 'react';

// --- Komponen Ikon untuk Navigasi ---
const HomeIcon = () => (
  <svg
    className='w-6 h-6'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    />
  </svg>
);
const QuizIcon = () => (
  <svg
    className='w-6 h-6'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
);
const AdminIcon = () => (
  <svg
    className='w-6 h-6'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
    ></path>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    ></path>
  </svg>
);
const LogoutIcon = () => (
  <svg
    className='w-6 h-6'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
    />
  </svg>
);
// --- IKON BARU UNTUK TOMBOL CLOSE ---
const CloseIcon = () => (
  <svg
    className='w-8 h-8 text-gray-500 hover:text-gray-800'
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
// ------------------------------------

function SidebarMenu({
  isOpen,
  onClose,
  onLogout,
  onNavigate,
  userName,
  isAdminModeAvailable,
}) {
  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? 'transform-none' : 'translate-x-full'
      } pointer-events-none`}
    >
      <div className='relative w-64 h-full bg-gray-50 shadow-2xl p-4 flex flex-col font-[var(--font-nunito)] pointer-events-auto'>
        {/* --- HEADER MENU DENGAN TOMBOL CLOSE --- */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-gray-800'>Menu</h2>
          <button onClick={onClose} className='p-1 -mr-1 rounded-full'>
            <CloseIcon />
          </button>
        </div>
        {/* -------------------------------------- */}

        <nav className='flex-grow flex flex-col gap-2'>
          <button
            onClick={() => {
              onNavigate('beranda');
              onClose();
            }}
            className='flex items-center gap-4 text-left text-lg font-bold text-gray-700 p-3 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors'
          >
            <HomeIcon />
            <span>Beranda</span>
          </button>
          <button
            onClick={() => {
              onNavigate('kuis');
              onClose();
            }}
            className='flex items-center gap-4 text-left text-lg font-bold text-gray-700 p-3 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors'
          >
            <QuizIcon />
            <span>Kuis</span>
          </button>
          {isAdminModeAvailable && (
            <button
              onClick={() => {
                onNavigate('admin');
                onClose();
              }}
              className='flex items-center gap-4 text-left text-lg font-bold text-purple-700 p-3 rounded-lg hover:bg-purple-100 transition-colors'
            >
              <AdminIcon />
              <span>Mode Admin</span>
            </button>
          )}
        </nav>

        <div className='flex flex-col gap-2'>
          <div className='border-t border-gray-200 pt-4 flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg'>
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className='text-base font-bold text-gray-800'>{userName}</p>
              <p className='text-sm text-gray-500'>Pengguna Isyara</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className='w-full flex items-center justify-center gap-4 text-left text-lg font-bold text-red-500 p-3 mt-2 rounded-lg hover:bg-red-50 transition-colors'
          >
            <LogoutIcon />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SidebarMenu;
