export const tutorialSteps = [
  {
    id: 'welcome',
    title: 'Hai!',
    text: 'Selamat datang di Auri,\napakah kamu ingin\nmengikuti panduan Auri?',
    isCentered: true,
  },

  // Langkah 1: Menyorot Menu Hamburger
  {
    id: 'side-menu',
    title: 'Side Menu',
    text: 'Kamu bisa melihat beranda, kuis, dan akun disini.',
    highlightElementId: 'hamburger-menu',
    positionClasses: 'top-24 right-6',
  },

  // Langkah 2: Menyorot Bagian Materi
  {
    id: 'materi',
    title: 'Materi',
    text: 'Kamu bisa melihat dan mencoba BISINDO disini.',
    highlightElementId: 'materi-section',
    positionClasses: 'top-1/3 left-6',
  },

  // Langkah 3: Menyorot Bagian Tantangan
  {
    id: 'tantangan',
    title: 'Tantangan Sederhana',
    text: 'Kamu bisa melatih pemahamanmu dengan tantangan sederhana disini.',
    highlightElementId: 'tantangan-section',
    positionClasses: 'top-1/2 left-6',
  },
];
