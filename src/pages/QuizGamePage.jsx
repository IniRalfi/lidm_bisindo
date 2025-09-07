import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../data/quizData';

// Komponen Ikon
const ArrowLeftIcon = () => (
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
      d='M15 19l-7-7 7-7'
    />
  </svg>
);

function QuizGamePage({ onBackToMenu, onQuizComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [questionResults, setQuestionResults] = useState([]);

  // Buat kuis baru saat halaman pertama kali dimuat
  useEffect(() => {
    setQuestions(generateQuiz());
  }, []);

  // --- PERUBAHAN UTAMA DI SINI ---
  // Pindahkan pengecekan loading ke paling atas.
  // Jika data soal belum siap, jangan lanjutkan eksekusi kode di bawahnya.
  if (questions.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center font-bold text-xl'>
        Memuat Kuis...
      </div>
    );
  }

  // Kode di bawah ini HANYA akan berjalan jika questions.length > 0
  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleAnswerSelect = (answerValue) => {
    if (isChecked) return;
    setSelectedAnswer(answerValue);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    setIsChecked(true);
    const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isAnswerCorrect) {
      setScore((prev) => prev + 1);
    }
    setQuestionResults((prev) => [...prev, isAnswerCorrect]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsChecked(false);
    } else {
      onQuizComplete({ score: score, total: questions.length });
    }
  };

  const getOptionStyle = (optionValue) => {
    if (!isChecked) {
      return selectedAnswer === optionValue
        ? 'bg-blue-200 border-blue-500'
        : 'bg-white border-gray-200';
    }
    if (optionValue === currentQuestion.correctAnswer) {
      return 'bg-green-200 border-green-500';
    }
    if (
      optionValue === selectedAnswer &&
      optionValue !== currentQuestion.correctAnswer
    ) {
      return 'bg-red-200 border-red-500';
    }
    return 'bg-white border-gray-200';
  };

  return (
    <div className='min-h-screen w-full bg-white font-[var(--font-nunito)] text-gray-800'>
      <div className='w-full max-w-md mx-auto'>
        <header className='sticky top-0 bg-white z-20 py-4 px-4 flex items-center gap-4 border-b border-gray-200'>
          <button onClick={onBackToMenu} className='p-2 -ml-2'>
            <ArrowLeftIcon />
          </button>
          <div className='flex-grow flex justify-center gap-2'>
            {questions.map((_, index) => {
              const isPastQuestion = index < currentQuestionIndex;
              const isCurrentQuestion = index === currentQuestionIndex;
              let bubbleClass = 'bg-gray-200 text-gray-500';

              if (isCurrentQuestion) {
                bubbleClass = 'bg-blue-500 text-white';
              } else if (isPastQuestion) {
                bubbleClass = questionResults[index]
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white';
              }

              return (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${bubbleClass}`}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </header>

        <main className='p-6 flex flex-col gap-5'>
          <div className='min-h-[64px] flex items-center justify-center'>
            <h2 className='text-2xl font-bold text-center'>
              {currentQuestion.type === 'tebak_gambar' ? (
                <span>
                  Pilih gambar di bawah untuk huruf{' '}
                  <span className='text-blue-500'>
                    {currentQuestion.questionValue}
                  </span>
                </span>
              ) : (
                <span>{currentQuestion.questionText}</span>
              )}
            </h2>
          </div>

          {currentQuestion.type === 'tebak_gambar' && (
            <div className='grid grid-cols-2 gap-4'>
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(option.value)}
                  className={`rounded-xl border-4 p-4 flex items-center justify-center aspect-square transition-colors ${getOptionStyle(
                    option.value
                  )}`}
                >
                  <img
                    src={option.imageUrl}
                    alt={`Pilihan ${option.value}`}
                    className='max-w-full max-h-24 object-contain'
                  />
                </button>
              ))}
            </div>
          )}
          {currentQuestion.type === 'tebak_huruf' && (
            <div className='flex flex-col items-center gap-6'>
              <div className='w-48 h-48 rounded-xl border-4 border-gray-200 p-4 flex items-center justify-center'>
                <img
                  src={currentQuestion.questionValue}
                  alt='Soal Gambar'
                  className='max-w-full max-h-full object-contain'
                />
              </div>
              <div className='w-full grid grid-cols-2 gap-4'>
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswerSelect(option.value)}
                    className={`rounded-xl border-4 py-4 text-3xl font-bold transition-colors ${getOptionStyle(
                      option.value
                    )}`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className=' flex items-center justify-center'>
            {isChecked && (
              <div
                className={`text-center font-bold text-2xl animate-pop-in ${
                  isCorrect ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {isCorrect ? 'Benar!' : 'Salah!'}
              </div>
            )}
          </div>

          <div>
            {isChecked ? (
              <button
                onClick={handleNextQuestion}
                className={`w-full text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 ${
                  isCorrect
                    ? 'bg-green-500 shadow-[0_4px_0_0_#15803d]'
                    : 'bg-red-500 shadow-[0_4px_0_0_#b91c1c]'
                }`}
              >
                Lanjut
              </button>
            ) : (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedAnswer}
                className='w-full bg-gray-300 text-gray-600 font-bold text-lg py-4 rounded-xl transition-all duration-200 disabled:opacity-50 enabled:bg-blue-500 enabled:text-white enabled:shadow-[0_4px_0_0_#0887C3]'
              >
                Periksa
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default QuizGamePage;
