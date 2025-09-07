import React, { useState } from 'react';
import { storyScript } from '../data/storyData';

// Komponen Ikon & Dialog (tidak berubah)
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
const DialogueBubble = ({ speaker, text, image, speakerPosition }) => {
  const isLeft = speakerPosition === 'left';
  return (
    <div
      className={`flex flex-col w-full max-w-xs ${
        isLeft ? 'items-start' : 'items-end'
      }`}
    >
      <p
        className={`font-bold text-lg ${
          isLeft ? 'text-orange-500' : 'text-lime-600'
        }`}
      >
        {speaker}
      </p>
      <div className='bg-white border border-gray-200 rounded-lg p-3'>
        <p className='text-gray-800'>{text}</p>
        {image && (
          <img src={image} alt='Soal' className='mt-2 rounded-md w-20' />
        )}
      </div>
    </div>
  );
};

function StoryPage({ onBack, onFinish }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null); // 'idle', 'correct', 'incorrect'

  const currentScene = storyScript[sceneIndex];

  // --- FUNGSI UTAMA YANG DIPERBAIKI TOTAL ---
  const handleNext = () => {
    // Logika saat berada di adegan pertanyaan
    if (currentScene.type === 'question') {
      if (!selectedAnswer) {
        alert('Pilih jawaban terlebih dahulu!');
        return;
      }
      const isCorrect = selectedAnswer === currentScene.question.correctAnswer;
      setAnswerStatus(isCorrect ? 'correct' : 'incorrect');

      setTimeout(() => {
        // Pilih adegan selanjutnya berdasarkan jawaban
        if (isCorrect) {
          setSceneIndex(2); // Langsung ke adegan "Jawaban Benar" (index 2 di storyData)
        } else {
          setSceneIndex(3); // Langsung ke adegan "Jawaban Salah" (index 3 di storyData)
        }
        // Reset status untuk adegan berikutnya agar tombol tidak disabled
        setAnswerStatus(null);
        setSelectedAnswer(null);
      }, 1500); // Jeda 1.5 detik untuk feedback
      return;
    }

    // Logika untuk adegan lainnya (dialogue)
    switch (sceneIndex) {
      case 0: // Adegan Intro
        setSceneIndex(1); // Lanjut ke adegan Pertanyaan
        break;
      case 2: // Adegan Jawaban Benar
        onFinish({ score: 1, total: 1 }); // Selesaikan kuis dengan skor 1
        break;
      case 3: // Adegan Jawaban Salah
        onBack(); // "Belajar Lagi" berarti kembali ke menu kuis
        break;
      default:
        onBack(); // Fallback jika terjadi kesalahan
        break;
    }
  };

  const getOptionStyle = (option) => {
    if (!answerStatus)
      return selectedAnswer === option
        ? 'bg-blue-200 border-blue-500'
        : 'bg-white border-gray-200';
    if (option === currentScene.question.correctAnswer)
      return 'bg-green-200 border-green-500';
    if (option === selectedAnswer) return 'bg-red-200 border-red-500';
    return 'bg-white border-gray-200';
  };

  return (
    <div className='min-h-screen w-full bg-white font-[var(--font-nunito)] text-gray-800 flex flex-col'>
      <header className='sticky top-0 bg-white z-20 py-4 px-4 flex items-center gap-4 border-b border-gray-200'>
        <button onClick={onBack} className='p-2 -ml-2'>
          <ArrowLeftIcon />
        </button>
        <h1 className='text-2xl font-bold'>Bingung?</h1>
      </header>

      <main className='flex-grow w-full max-w-md mx-auto p-4 flex flex-col justify-between'>
        <div className='flex-grow space-y-4'>
          {currentScene.dialogue?.map((line, index) => (
            <DialogueBubble
              key={index}
              speaker={line.speaker}
              text={line.text}
              image={line.image}
              speakerPosition={line.speaker === 'Dori' ? 'left' : 'right'}
            />
          ))}
        </div>

        {currentScene.type === 'question' && (
          <div className='grid grid-cols-2 gap-4 my-6'>
            {currentScene.question.options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedAnswer(option)}
                className={`rounded-xl border-4 py-4 text-3xl font-bold transition-colors ${getOptionStyle(
                  option
                )}`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        <div className='relative h-72 mt-auto'>
          <img
            src={currentScene.characters.left.image}
            alt={currentScene.characters.left.name}
            className='absolute bottom-0 left-0 h-64'
          />
          <img
            src={currentScene.characters.right.image}
            alt={currentScene.characters.right.name}
            className='absolute bottom-0 right-0 h-64'
          />
        </div>
      </main>

      <footer className='sticky bottom-0 bg-white p-4 border-t border-gray-200'>
        <button
          onClick={handleNext}
          disabled={!!answerStatus && currentScene.type === 'question'}
          className={`w-full text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 disabled:opacity-70 
                        ${
                          answerStatus === 'correct'
                            ? 'bg-green-500'
                            : answerStatus === 'incorrect'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                        }`}
        >
          {/* PERBAIKAN: Teks tombol sekarang bergantung pada answerStatus, bukan isCorrect */}
          {answerStatus && currentScene.type === 'question'
            ? answerStatus === 'correct'
              ? 'Benar!'
              : 'Salah!'
            : currentScene.buttonText}
        </button>
      </footer>
    </div>
  );
}

export default StoryPage;
