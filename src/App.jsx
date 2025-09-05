import React, { useState, useEffect } from 'react';
import UserPage from './UserPage';
import AdminPage from './AdminPage';

// Baca "saklar rahasia" dari environment variables.
// Variabel ini HANYA akan ada di laptop Anda, tidak di server produksi.
const IS_ADMIN_MODE_AVAILABLE = import.meta.env.VITE_SHOW_ADMIN_PAGE === 'true';

function App() {
  const [currentPage, setCurrentPage] = useState('user');

  // Cek URL untuk "kunci rahasia" hanya jika mode admin tersedia
  useEffect(() => {
    if (IS_ADMIN_MODE_AVAILABLE) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('page') === 'admin') {
        setCurrentPage('admin');
      }
    }
  }, []);

  const renderPage = () => {
    // Tampilkan halaman admin HANYA JIKA mode admin tersedia DAN halaman saat ini adalah admin
    if (IS_ADMIN_MODE_AVAILABLE && currentPage === 'admin') {
      return <AdminPage />;
    }
    // Jika tidak, selalu tampilkan halaman user
    return <UserPage />;
  };

  return (
    <div>
      {/* Tombol untuk beralih HANYA MUNCUL di laptop Anda (mode development) */}
      {IS_ADMIN_MODE_AVAILABLE && (
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
          <button
            onClick={() =>
              setCurrentPage(currentPage === 'user' ? 'admin' : 'user')
            }
            className='bg-purple-600 text-white text-xs p-2 rounded opacity-50 hover:opacity-100'
          >
            Beralih ke Halaman {currentPage === 'user' ? 'Admin' : 'User'}
          </button>
        </div>
      )}

      {renderPage()}
    </div>
  );
}

export default App;
