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

  // Buat kuis baru saat halaman pertama kali dimuat
  useEffect(() => {
    setQuestions(generateQuiz());
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerValue) => {
    if (isChecked) return; // Jangan biarkan mengubah jawaban setelah diperiksa
    setSelectedAnswer(answerValue);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    setIsChecked(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
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

  // Helper untuk styling tombol/kartu jawaban
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

  if (questions.length === 0) {
    return <div>Memuat Kuis...</div>;
  }

  return (
    <div className='min-h-screen w-full bg-white font-[var(--font-nunito)] text-gray-800'>
      <div className='w-full max-w-md mx-auto'>
        <header className='sticky top-0 bg-white z-20 py-4 px-4 flex items-center gap-4 border-b border-gray-200'>
          <button onClick={onBackToMenu} className='p-2 -ml-2'>
            <ArrowLeftIcon />
          </button>
          <div className='flex-grow flex justify-center gap-2'>
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  index === currentQuestionIndex
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </header>

        <main className='p-6 flex flex-col gap-8'>
          {/* Soal */}
          <div>
            <h2 className='text-2xl font-bold text-center'>
              {currentQuestion.questionText
                .split(currentQuestion.questionValue)
                .map((text, index) =>
                  index === 0 ? (
                    <span key={index}>
                      {text}
                      <span className='text-blue-500'>
                        {currentQuestion.questionValue}
                      </span>
                    </span>
                  ) : (
                    text
                  )
                )}
            </h2>
          </div>

          {/* Konten Soal & Pilihan Jawaban */}
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

          {/* Tombol Aksi */}
          <div className='mt-4'>
            {isChecked ? (
              <button
                onClick={handleNextQuestion}
                className={`w-full text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              >
                Lanjut
              </button>
            ) : (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedAnswer}
                className='w-full bg-gray-300 text-gray-600 font-bold text-lg py-4 rounded-xl transition-all duration-200 disabled:opacity-50 enabled:bg-blue-500 enabled:text-white'
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
