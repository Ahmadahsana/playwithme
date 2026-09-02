// Central profile data — dipakai di navbar, footer, hero, about, dan contact.
// Ubah di sini saja; semua halaman ikut menyesuaikan.

export type SkillGroup = {
  label: string
  items: string[]
}

export type Experience = {
  company: string
  role: string
  period: string // mis. '2022 — 2023' atau 'TBD'
  location?: string
  summary: string
  stack?: string[]
}

export type Project = {
  name: string
  category: string
  description: string
  link?: string
  stack?: string[]
}

export const profile = {
  name: 'Ahmad Ahsan',
  role: 'Software Developer',
  roleShort: 'Software Developer',
  tagline: 'Small step, big dreams.',
  location: 'Jepara & Kudus, Jawa Tengah',
  // 'freelance' | 'open' | 'employed' | 'hidden'
  status: 'freelance' as const,

  email: 'ahmadahsanataqwim@gmail.com',

  socials: {
    github: 'https://github.com/Ahmadahsana',
    linkedin: 'https://www.linkedin.com/in/ahmad-ahsan-b67b15159/',
    // Format internasional tanpa tanda plus / spasi. 08986592674 -> 628986592674.
    // Kosongkan untuk menyembunyikan tombol WhatsApp.
    whatsapp: '628986592674',
  },

  // Kalimat pembuka di hero halaman utama.
  intro:
    'Halo, saya Ahmad Ahsan — Software Developer asal Jepara & Kudus. ' +
    'Sehari-hari membangun aplikasi web dengan Vue/Nuxt di depan dan Laravel, Express, atau NestJS di belakang. ' +
    'Situs ini adalah taman bermain pribadi saya untuk mengeksplorasi batas kemampuan browser.',
} as const

export const skillGroups: SkillGroup[] = [
  { label: 'Frontend', items: ['JavaScript', 'Vue', 'Nuxt', 'Tailwind CSS', 'Canvas & WebGL'] },
  { label: 'Backend', items: ['PHP', 'Laravel', 'Express.js', 'NestJS', 'REST API'] },
  { label: 'Tooling', items: ['Git', 'Vite', 'Pinia', 'MySQL / PostgreSQL'] },
]

export const experiences: Experience[] = [
  {
    company: 'Inovra',
    role: 'Full Stack Developer',
    period: 'Sekarang',
    location: 'Remote',
    summary:
      'Membangun aplikasi web dan sistem informasi untuk klien pemerintahan maupun bisnis — dari sistem perizinan, platform tiket event, hingga e-learning inklusif.',
    stack: ['Vue', 'Nuxt', 'Laravel', 'MySQL'],
  },
  {
    company: 'Freelance',
    role: 'Web Developer',
    period: 'Sekarang',
    summary:
      'Menangani proyek website dan aplikasi custom untuk UMKM, sekolah, dan komunitas — mulai dari company profile hingga aplikasi manajemen.',
    stack: ['Vue', 'Laravel', 'Express.js'],
  },
  {
    company: 'PT Pura Barutama',
    role: 'Software Developer',
    period: 'TBD',
    location: 'Kudus',
    summary:
      'Mengembangkan dan memelihara aplikasi internal untuk mendukung proses produksi dan operasional perusahaan.',
    stack: ['PHP', 'Laravel', 'JavaScript'],
  },
]

// Karya terpilih bersama Inovra. Sumber: https://inovra.id/portofolio
export const projects: Project[] = [
  {
    name: 'TIXU',
    category: 'Platform Tiket Event',
    description:
      'Platform penjualan tiket event all-in-one: e-ticketing, payment gateway Midtrans, dashboard organizer, sistem gate, dan point of sales.',
    link: 'https://www.tixu.co.id/',
  },
  {
    name: 'SportZone',
    category: 'Booking Lapangan Olahraga',
    description:
      'Platform booking lapangan olahraga dengan pencarian venue, jadwal real-time, harga transparan, dan konfirmasi instan. Tersedia juga aplikasi mobile.',
    link: 'https://sportzone.id/',
  },
  {
    name: 'Inklusia Learn',
    category: 'E-Learning Inklusif',
    description:
      'Platform e-learning berbasis Universal Design for Learning untuk mahasiswa berkebutuhan khusus: text-to-speech, font ramah disleksia, video bahasa isyarat, dan akses offline (PWA).',
    link: 'https://inklusialearn.id/',
  },
  {
    name: 'DPMPTSP Kabupaten Kudus',
    category: 'Sistem Perizinan Pemerintah',
    description:
      'Website resmi Dinas Penanaman Modal & PTSP Kabupaten Kudus dengan sistem perizinan online, pelacakan status permohonan, dan informasi layanan publik.',
    link: 'https://dpmptsp.kuduskab.go.id/',
  },
  {
    name: 'Explore Kudus',
    category: 'Website Pariwisata',
    description:
      'Platform kurasi cagar budaya dan destinasi wisata Kudus dengan desain bilingual, paket tur, ticketing, dan katalog produk lokal.',
    link: 'https://kudus-explore.vercel.app/',
  },
  {
    name: 'DK Group',
    category: 'Aplikasi Web',
    description:
      'Sistem aplikasi web dengan integrasi pembayaran Midtrans, dibangun sebagai SPA Vue.js dengan backend Laravel.',
    link: 'https://dkgroup311021.com/',
  },
]
