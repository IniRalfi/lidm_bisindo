// Daftar semua huruf yang kita punya gambarnya
const ALPHABET = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

// Fungsi untuk mengacak array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// Fungsi untuk membuat satu soal "Tebak Gambar dari Huruf"
const generateQuestion_TebakGambar = (correctLetter) => {
  // Ambil 3 huruf salah secara acak
  const wrongAnswers = shuffleArray(
    ALPHABET.filter((l) => l !== correctLetter)
  ).slice(0, 3);
  // Gabungkan dengan jawaban benar dan acak posisinya
  const options = shuffleArray([correctLetter, ...wrongAnswers]);

  return {
    type: 'tebak_gambar',
    questionText: `Pilih gambar di bawah untuk huruf ${correctLetter}`,
    questionValue: correctLetter,
    options: options.map((letter) => ({
      value: letter,
      imageUrl: `/assets/tangan/BISINDO_${letter}.png`,
    })),
    correctAnswer: correctLetter,
  };
};

// Fungsi untuk membuat satu soal "Tebak Huruf dari Gambar"
const generateQuestion_TebakHuruf = (correctLetter) => {
  // Ambil 3 huruf salah secara acak
  const wrongAnswers = shuffleArray(
    ALPHABET.filter((l) => l !== correctLetter)
  ).slice(0, 3);
  // Gabungkan dengan jawaban benar dan acak posisinya
  const options = shuffleArray([correctLetter, ...wrongAnswers]);

  return {
    type: 'tebak_huruf',
    questionText: 'Pilih huruf di bawah untuk gambar ini',
    questionValue: `/assets/tangan/BISINDO_${correctLetter}.png`,
    options: options.map((letter) => ({
      value: letter,
      text: letter,
    })),
    correctAnswer: correctLetter,
  };
};

// Fungsi utama untuk membuat 5 soal kuis acak
export const generateQuiz = () => {
  const quiz = [];
  const availableLetters = shuffleArray([...ALPHABET]);

  // Buat 5 soal, bergantian antara dua jenis
  for (let i = 0; i < 5; i++) {
    const letter = availableLetters.pop();
    if (i % 2 === 0) {
      quiz.push(generateQuestion_TebakGambar(letter));
    } else {
      quiz.push(generateQuestion_TebakHuruf(letter));
    }
  }
  return quiz;
};
