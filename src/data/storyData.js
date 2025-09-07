// Daftar semua huruf yang kita punya gambarnya sebagai "dataset"
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

// Fungsi untuk mengacak array (utility)
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Fungsi utama untuk MEMBUAT cerita kuis yang acak
export const generateStoryQuiz = () => {
  // 1. Pilih satu huruf jawaban yang benar secara acak
  const correctLetter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

  // 2. Ambil 3 huruf salah secara acak yang BUKAN jawaban benar
  const wrongAnswers = shuffleArray(
    ALPHABET.filter((l) => l !== correctLetter)
  ).slice(0, 3);

  // 3. Gabungkan jawaban benar dan salah, lalu acak posisinya
  const options = shuffleArray([correctLetter, ...wrongAnswers]);

  // 4. Bangun "naskah" cerita secara dinamis dengan data acak yang sudah kita buat
  const storyScript = [
    // Adegan 0: Intro (tetap sama)
    {
      scene: 1,
      type: 'dialogue',
      characters: {
        left: { name: 'Dori', image: '/assets/character/dori.png' },
        right: { name: 'Frans', image: '/assets/character/frans.png' },
      },
      dialogue: [
        { speaker: 'Dori', text: 'Hai Frans! aku mau tanya dong' },
        { speaker: 'Frans', text: 'Hai Dori! boleh, tanya aja' },
      ],
      buttonText: 'Lanjut',
    },
    // Adegan 1: Pertanyaan (sekarang dinamis)
    {
      scene: 2,
      type: 'question',
      characters: {
        left: { name: 'Dori', image: '/assets/character/dori_bingung.png' },
        right: { name: 'Frans', image: '/assets/character/frans.png' },
      },
      dialogue: [
        {
          speaker: 'Dori',
          text: 'Kemarin kan bu Tuti ngasih gambar ini di kelas, apa ya hurufnya?',
          image: `/assets/tangan/BISINDO_${correctLetter}.png`,
        }, // <-- Gambar dinamis
      ],
      question: {
        options: options, // <-- Pilihan dinamis
        correctAnswer: correctLetter, // <-- Jawaban benar dinamis
      },
      buttonText: 'Periksa',
    },
    // Adegan 2: JIKA JAWABAN BENAR (sekarang dinamis)
    {
      scene: 3,
      type: 'dialogue',
      characters: {
        left: { name: 'Dori', image: '/assets/character/dori.png' },
        right: { name: 'Frans', image: '/assets/character/frans.png' },
      },
      dialogue: [
        { speaker: 'Frans', text: `Oh mudah banget, itu ${correctLetter}!` }, // <-- Teks dinamis
        {
          speaker: 'Dori',
          text: 'Wahh hebat banget kamu, masih ingat, makasih ya',
        },
        { speaker: 'Frans', text: 'hehe, sama sama' },
      ],
      buttonText: 'Selesai',
    },
    // Adegan 3: JIKA JAWABAN SALAH (tetap sama)
    {
      scene: 4,
      type: 'dialogue',
      characters: {
        left: { name: 'Dori', image: '/assets/character/dori_bingung.png' },
        right: { name: 'Frans', image: '/assets/character/frans_bingung.png' },
      },
      dialogue: [
        { speaker: 'Dori', text: 'hmmm beneran? kayaknya salah deh' },
        { speaker: 'Frans', text: 'waduh!!! aku lupa juga' },
        { speaker: 'Dori', text: 'kita belajar lagi yuk!' },
      ],
      buttonText: 'Belajar Lagi',
    },
  ];

  return storyScript;
};
