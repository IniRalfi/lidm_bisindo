import React, { useState, useEffect } from 'react';
// Impor komponen dan semua halaman
import SidebarMenu from './components/SidebarMenu';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BerandaPage from './pages/BerandaPage';
import KamusPage from './pages/KamusPage';
import DetailPage from './pages/DetailPage';
import ChallengePage from './pages/ChallengePage';
import NamaChallengePage from './pages/NamaChallengePage';
import SuccessPage from './pages/SuccessPage';
import AdminPage from './pages/AdminPage';
import KuisPage from './pages/KuisPage';

// Baca "saklar rahasia" untuk mode admin
const IS_ADMIN_MODE_AVAILABLE = import.meta.env.VITE_SHOW_ADMIN_PAGE === 'true';

function App() {
  // State untuk mengontrol sidebar, sekarang terpusat di sini
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State lain untuk alur aplikasi
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [finalWord, setFinalWord] = useState('');

  // Cek status login & mode admin saat aplikasi pertama kali dimuat
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('userIsLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
      setCurrentPage('beranda');
    }
    if (IS_ADMIN_MODE_AVAILABLE) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('page') === 'admin') {
        setCurrentPage('admin');
      }
    }
  }, []);

  // Semua fungsi "handle" untuk alur aplikasi
  const handleLoginSuccess = () => {
    localStorage.setItem('userIsLoggedIn', 'true');
    setIsLoggedIn(true);
    setCurrentPage('beranda');
  };

  const handleLogout = () => {
    localStorage.removeItem('userIsLoggedIn');
    setIsLoggedIn(false);
    setCurrentPage('landing');
    setIsSidebarOpen(false); // Tutup sidebar saat logout
  };

  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter);
    setCurrentPage('detail');
  };

  const handleSpellingFinish = (word) => {
    setFinalWord(word);
    setCurrentPage('success');
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false); // Selalu tutup sidebar setelah navigasi
  };

  // Logika untuk menampilkan halaman yang benar
  const renderPage = () => {
    if (IS_ADMIN_MODE_AVAILABLE && currentPage === 'admin') {
      return <AdminPage />;
    }

    if (isLoggedIn) {
      switch (currentPage) {
        case 'beranda':
          return (
            <BerandaPage
              onMenuClick={() => setIsSidebarOpen(true)}
              onNavigateToKamus={() => handleNavigation('kamus')}
              onNavigateToNamaChallenge={() =>
                handleNavigation('namaChallenge')
              }
            />
          );
        case 'kuis':
          return (
            <KuisPage
              onMenuClick={() => setIsSidebarOpen(true)}
              onBack={() => handleNavigation('beranda')}
              // Untuk sekarang, kita buat tombol kuisnya menampilkan alert dulu
              onNavigateToGame={() =>
                alert('Halaman game kuis akan muncul di sini!')
              }
            />
          );
        case 'kamus':
          return (
            <KamusPage
              onBack={() => handleNavigation('beranda')}
              onLetterSelect={handleLetterSelect}
            />
          );
        case 'detail':
          return (
            <DetailPage
              letter={selectedLetter}
              onBack={() => handleNavigation('kamus')}
              onStartChallenge={() => handleNavigation('challenge')}
            />
          );
        case 'challenge':
          return (
            <ChallengePage
              letter={selectedLetter}
              onBack={() => handleNavigation('detail')}
            />
          );
        case 'namaChallenge':
          return (
            <NamaChallengePage
              onBack={() => handleNavigation('beranda')}
              onFinish={handleSpellingFinish}
            />
          );
        case 'success':
          return (
            <SuccessPage
              spelledWord={finalWord}
              onBackToHome={() => handleNavigation('beranda')}
            />
          );
        default:
          return (
            <BerandaPage
              onMenuClick={() => setIsSidebarOpen(true)}
              onNavigateToKamus={() => handleNavigation('kamus')}
              onNavigateToNamaChallenge={() =>
                handleNavigation('namaChallenge')
              }
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
      {/* Sidebar sekarang berada di level tertinggi dan akan muncul di atas semua halaman jika isSidebarOpen true */}
      {/* Kita juga kirimkan IS_ADMIN_MODE_AVAILABLE ke sini */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        userName='Rafli Pratama' // Bisa dibuat dinamis dari data login nanti
        isAdminModeAvailable={IS_ADMIN_MODE_AVAILABLE}
      />

      {renderPage()}
    </div>
  );
}

export default App;
