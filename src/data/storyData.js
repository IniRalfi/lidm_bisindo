// Naskah sekarang memiliki 4 adegan: Intro, Pertanyaan, Jawaban Benar, Jawaban Salah

export const storyScript = [
  // Adegan 0: Intro
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
  // Adegan 1: Pertanyaan
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
        image: '/assets/tangan/BISINDO_B.png',
      },
    ],
    question: {
      options: ['K', 'B', 'C', 'R'],
      correctAnswer: 'B',
    },
    buttonText: 'Periksa',
  },
  // Adegan 2: JIKA JAWABAN BENAR
  {
    scene: 3,
    type: 'dialogue',
    characters: {
      left: { name: 'Dori', image: '/assets/character/dori.png' },
      right: { name: 'Frans', image: '/assets/character/frans.png' },
    },
    dialogue: [
      { speaker: 'Frans', text: 'Oh mudah banget, itu B!' },
      {
        speaker: 'Dori',
        text: 'Wahh hebat banget kamu, masih ingat, makasih ya',
      },
      { speaker: 'Frans', text: 'hehe, sama sama' },
    ],
    buttonText: 'Selesai',
  },
  // Adegan 3: JIKA JAWABAN SALAH
  {
    scene: 4,
    type: 'dialogue',
    characters: {
      left: { name: 'Dori', image: '/assets/character/dori_bingung.png' },
      right: { name: 'Frans', image: '/assets/character/frans.png' },
    },
    dialogue: [
      { speaker: 'Dori', text: 'hmmm beneran? kayaknya salah deh' },
      { speaker: 'Frans', text: 'waduh!!! aku lupa juga' },
      { speaker: 'Dori', text: 'kita belajar lagi yuk!' },
    ],
    buttonText: 'Belajar Lagi',
  },
];
