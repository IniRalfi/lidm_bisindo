import React, { useState, useEffect } from 'react';
// Pastikan semua path import ini sudah benar
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BerandaPage from './pages/BerandaPage';
import KamusPage from './pages/KamusPage';
import DetailPage from './pages/DetailPage'; // Impor halaman detail yang baru

const IS_ADMIN_MODE_AVAILABLE = import.meta.env.VITE_SHOW_ADMIN_PAGE === 'true';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Halaman aktif: 'landing', 'login', 'beranda', 'kamus', 'detail', 'user', 'admin'
  const [currentPage, setCurrentPage] = useState('landing');

  // State BARU untuk menyimpan huruf mana yang sedang dipilih pengguna
  const [selectedLetter, setSelectedLetter] = useState(null);

  useEffect(() => {
    if (IS_ADMIN_MODE_AVAILABLE) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('page') === 'admin') {
        setCurrentPage('admin');
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('beranda');
  };

  // Fungsi BARU untuk menangani saat pengguna memilih huruf di KamusPage
  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter); // 1. Simpan huruf yang dipilih
    setCurrentPage('detail'); // 2. Pindah ke halaman detail
  };

  const renderPage = () => {
    if (IS_ADMIN_MODE_AVAILABLE && currentPage === 'admin') {
      return <AdminPage />;
    }

    // Logika setelah pengguna login
    if (isLoggedIn) {
      switch (currentPage) {
        case 'beranda':
          return (
            <BerandaPage
              onNavigateToKamus={() => setCurrentPage('kamus')}
              onNavigateToKamera={() => setCurrentPage('user')}
            />
          );
        case 'kamus':
          // Kirim fungsi handleLetterSelect ke KamusPage agar bisa dipanggil saat kartu diklik
          return (
            <KamusPage
              onBack={() => setCurrentPage('beranda')}
              onLetterSelect={handleLetterSelect}
            />
          );
        case 'detail':
          // Kirim huruf yang sudah disimpan (selectedLetter) ke DetailPage agar halaman tahu data apa yang harus ditampilkan
          return (
            <DetailPage
              letter={selectedLetter}
              onBack={() => setCurrentPage('kamus')}
              onNavigateToKamera={() => setCurrentPage('user')}
            />
          );
        case 'user':
          return <UserPage />;
        default:
          // Jika ada state aneh, kembalikan ke beranda
          return (
            <BerandaPage
              onNavigateToKamus={() => setCurrentPage('kamus')}
              onNavigateToKamera={() => setCurrentPage('user')}
            />
          );
      }
    }

    // Logika sebelum pengguna login
    if (!isLoggedIn && currentPage === 'login') {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    // Halaman default
    return <LandingPage onStart={() => setCurrentPage('login')} />;
  };

  return (
    <div>
      {/* Tombol Admin (tidak berubah) */}
      {IS_ADMIN_MODE_AVAILABLE && (
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
          <button
            onClick={() =>
              setCurrentPage(currentPage !== 'admin' ? 'admin' : 'landing')
            }
            className='bg-purple-600 text-white text-xs p-2 rounded opacity-50 hover:opacity-100'
          >
            Beralih ke Halaman {currentPage !== 'admin' ? 'Admin' : 'Utama'}
          </button>
        </div>
      )}
      {renderPage()}
    </div>
  );
}

export default App;
