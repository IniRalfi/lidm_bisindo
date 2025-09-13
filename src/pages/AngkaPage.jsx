import React from 'react';

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

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const NumberCard = ({ number, onSelect }) => {
  const imageUrl = `/assets/angka/${number}.png`;
  return (
    <button
      onClick={onSelect}
      className='bg-white rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center p-4 gap-4 aspect-square transition-all duration-200 hover:shadow-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
    >
      <div className='w-24 h-24 flex items-center justify-center'>
        <img
          src={imageUrl}
          alt={`Isyarat tangan untuk angka ${number}`}
          className='max-w-full max-h-full object-contain'
        />
      </div>
      <p className='text-3xl font-bold text-gray-600 '>{number}</p>
    </button>
  );
};

function AngkaPage({ onBack, onNumberSelect }) {
  return (
    <div className='min-h-screen w-full bg-white  text-gray-800'>
      <div className='w-full max-w-md mx-auto'>
        <header className='sticky top-0 bg-white bg-opacity-80 backdrop-blur-sm z-20 py-4 px-4 flex items-center gap-4 border-b border-gray-200'>
          <button onClick={onBack} className='p-2 -ml-2'>
            <ArrowLeftIcon />
          </button>
          <h1 className='text-2xl font-bold'>Angka 0-10</h1>
        </header>
        <main className='p-4'>
          <div className='grid grid-cols-2 gap-4'>
            {numbers.map((num) => (
              <NumberCard
                key={num}
                number={num}
                onSelect={() => onNumberSelect(num)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AngkaPage;
