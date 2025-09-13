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
import QuizGamePage from './pages/QuizGamePage';
import QuizCountdownPage from './pages/QuizCountdownPage';
import QuizResultPage from './pages/QuizResultPage';
import StoryPage from './pages/StoryPage';
import AngkaPage from './pages/AngkaPage';
import AngkaDetailPage from './pages/AngkaDetailPage';

// untuk mode admin
const IS_ADMIN_MODE_AVAILABLE = import.meta.env.VITE_SHOW_ADMIN_PAGE === 'true';

function App() {
  // State untuk mengontrol sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [finalWord, setFinalWord] = useState('');

  const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });
  const [selectedNumber, setSelectedNumber] = useState(null);

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
    setIsSidebarOpen(false);
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
    setIsSidebarOpen(false);
  };

  const handleQuizFinish = (result) => {
    setQuizResult(result);
    setCurrentPage('quizResult');
  };

  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
    setCurrentPage('angkaDetail');
  };

  // Logika untuk menampilkan halaman yang benar berdasarkan state
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
              onNavigateToAngka={() => handleNavigation('angka')}
              onNavigateToNamaChallenge={() =>
                handleNavigation('namaChallenge')
              }
            />
          );
        case 'kuis':
          return (
            <KuisPage
              onMenuClick={() => setIsSidebarOpen(true)}
              onNavigateToGame={() => handleNavigation('quizCountdown')}
              onNavigateToStory={() => handleNavigation('story')}
            />
          );
        case 'angka':
          return (
            <AngkaPage
              onBack={() => handleNavigation('beranda')}
              onNumberSelect={handleNumberSelect}
            />
          );
        case 'angkaDetail':
          return (
            <AngkaDetailPage
              number={selectedNumber}
              onBack={() => handleNavigation('angka')}
            />
          );
        case 'story':
          return (
            <StoryPage
              onBack={() => handleNavigation('kuis')}
              onFinish={handleQuizFinish}
            />
          );
        case 'quizCountdown':
          return (
            <QuizCountdownPage
              onCountdownFinish={() => handleNavigation('quizGame')}
            />
          );
        case 'quizGame':
          return (
            <QuizGamePage
              onBackToMenu={() => handleNavigation('kuis')}
              onQuizComplete={handleQuizFinish}
            />
          );

        case 'quizResult':
          // Tampilkan halaman hasil dengan data dari state
          return (
            <QuizResultPage
              score={quizResult.score}
              totalQuestions={quizResult.total}
              onFinish={() => handleNavigation('kuis')}
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
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        userName='Rafli Pratama'
        isAdminModeAvailable={IS_ADMIN_MODE_AVAILABLE}
      />
      {renderPage()}
    </div>
  );
}

export default App;
