import React, { useState, useEffect } from 'react';
// Pastikan semua path import ini sudah benar
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BerandaPage from './pages/BerandaPage';
import KamusPage from './pages/KamusPage';
import DetailPage from './pages/DetailPage';
import ChallengePage from './pages/ChallengePage'; // Impor halaman tantangan baru

const IS_ADMIN_MODE_AVAILABLE = import.meta.env.VITE_SHOW_ADMIN_PAGE === 'true';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Halaman aktif: 'landing', 'login', 'beranda', 'kamus', 'detail', 'challenge', 'user', 'admin'
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedLetter, setSelectedLetter] = useState(null);

  useEffect(() => {
    // Cek status login dari localStorage
    const loggedInStatus = localStorage.getItem('userIsLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
      setCurrentPage('beranda'); // Langsung ke beranda jika sudah pernah login
    }
    // Cek "kunci rahasia" admin
    if (IS_ADMIN_MODE_AVAILABLE) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('page') === 'admin') {
        setCurrentPage('admin');
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem('userIsLoggedIn', 'true');
    setIsLoggedIn(true);
    setCurrentPage('beranda');
  };

  const handleLogout = () => {
    localStorage.removeItem('userIsLoggedIn');
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };

  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter); // Simpan huruf yang dipilih
    setCurrentPage('detail'); // Pindah ke halaman detail
  };

  const renderPage = () => {
    if (IS_ADMIN_MODE_AVAILABLE && currentPage === 'admin') {
      return <AdminPage />;
    }

    if (isLoggedIn) {
      switch (currentPage) {
        case 'beranda':
          return (
            <BerandaPage
              onNavigateToKamus={() => setCurrentPage('kamus')}
              onNavigateToKamera={() => setCurrentPage('challenge')} // Arahkan ke challenge umum jika perlu
              onLogout={handleLogout}
            />
          );
        case 'kamus':
          return (
            <KamusPage
              onBack={() => setCurrentPage('beranda')}
              onLetterSelect={handleLetterSelect}
            />
          );
        case 'detail':
          // Tombol "Coba Sekarang" akan memicu perubahan ke halaman 'challenge'
          return (
            <DetailPage
              letter={selectedLetter}
              onBack={() => setCurrentPage('kamus')}
              onStartChallenge={() => setCurrentPage('challenge')}
            />
          );
        case 'challenge':
          // Tampilkan halaman tantangan dengan huruf yang sudah dipilih
          return (
            <ChallengePage
              letter={selectedLetter}
              onBack={() => setCurrentPage('detail')}
            />
          );
        case 'user': // Halaman ini bisa jadi halaman "Free Practice" nanti
          return <UserPage />;
        default:
          return (
            <BerandaPage
              onNavigateToKamus={() => setCurrentPage('kamus')}
              onLogout={handleLogout}
            />
          );
      }
    }

    if (!isLoggedIn && currentPage === 'login') {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

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
