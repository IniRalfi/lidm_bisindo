import React, { useState } from 'react';

// Komponen Ikon Mata (untuk show/hide password)
const EyeIcon = ({ isVisible }) => (
  <svg
    className='w-6 h-6 text-gray-500'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    {isVisible ? (
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242'
      />
    ) : (
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
      />
    )}
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
    />
  </svg>
);

// Komponen Ikon Google
const GoogleIcon = () => (
  <svg className='w-6 h-6' viewBox='0 0 24 24'>
    <path
      fill='#4285F4'
      d='M22.56,12.25C22.56,11.45 22.48,10.65 22.34,9.88H12.27V14.4H18.2C17.93,16.03 17.1,17.41 15.82,18.25V21.09H19.6C21.6,19.09 22.56,16 22.56,12.25Z'
    />
    <path
      fill='#34A853'
      d='M12.27,23C15.06,23 17.43,22.06 19.09,20.55L15.82,18.25C14.91,18.88 13.68,19.27 12.27,19.27C9.72,19.27 7.55,17.58 6.75,15.25H2.91V18.09C4.56,21.06 8.13,23 12.27,23Z'
    />
    <path
      fill='#FBBC05'
      d='M6.75,15.25C6.5,14.59 6.36,13.88 6.36,13.14C6.36,12.4 6.5,11.69 6.75,11.04V8.2H2.91C1.93,10.06 1.45,12.35 1.45,14.86C1.45,17.37 1.93,19.66 2.91,21.52L6.75,18.77V15.25Z'
    />
    <path
      fill='#EA4335'
      d='M12.27,6.91C13.78,6.91 15.06,7.45 16.06,8.4L19.16,5.3C17.43,3.74 15.06,2.73 12.27,2.73C8.13,2.73 4.56,4.94 2.91,7.91L6.75,10.75C7.55,8.42 9.72,6.91 12.27,6.91Z'
    />
  </svg>
);

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Kredensial rahasia untuk satu akun
    const correctEmail = '1@gmail.com';
    const correctPassword = '1';

    if (email === correctEmail && password === correctPassword) {
      alert('Login berhasil!');
      onLoginSuccess(); // Panggil fungsi ini untuk berpindah halaman
    } else {
      alert('Email atau sandi salah!');
    }
  };

  return (
    <div className='min-h-screen w-full bg-white flex flex-col justify-center items-center p-6 font-[var(--font-nunito)]'>
      <form
        onSubmit={handleLogin}
        className='w-full max-w-sm flex flex-col gap-6'
      >
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>Masuk</h1>
          <p className='text-gray-500'>Hai, selamat datang kembali!</p>
        </div>

        {/* Form Inputs */}
        <div className='flex flex-col gap-3'>
          <div>
            <label className='text-base font-bold text-gray-800 mb-1 block'>
              Email
            </label>
            <input
              type='email'
              placeholder='Masukkan email Anda'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
              required
            />
          </div>
          <div>
            <label className='text-base font-bold text-gray-800 mb-1 block'>
              Sandi
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Masukkan sandi Anda'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute inset-y-0 right-0 flex items-center pr-3'
              >
                <EyeIcon isVisible={showPassword} />
              </button>
            </div>
            <a
              href='#'
              className='text-sm text-gray-500 hover:text-blue-500 text-right block mt-1'
            >
              Lupa kata sandi?
            </a>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className='flex flex-col gap-4'>
          <button
            type='submit'
            className='w-full bg-[#099FE5] text-white font-bold py-4 rounded-full shadow-lg hover:bg-blue-600 transition disabled:opacity-50'
            disabled={!email || !password}
          >
            Masuk
          </button>
          <div className='flex items-center gap-4'>
            <hr className='flex-grow border-gray-300' />
            <span className='text-gray-500 text-sm'>Atau masuk dengan</span>
            <hr className='flex-grow border-gray-300' />
          </div>
          <button
            type='button'
            className='w-full bg-white text-gray-800 font-semibold py-4 rounded-full border border-gray-400 flex items-center justify-center gap-2 hover:bg-gray-100 transition'
          >
            <GoogleIcon />
            <span>Google</span>
          </button>
        </div>

        {/* Link Daftar */}
        <p className='text-center text-gray-500'>
          Belum punya akun?{' '}
          <a href='#' className='font-bold text-[#099FE5] hover:underline'>
            Daftar
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
