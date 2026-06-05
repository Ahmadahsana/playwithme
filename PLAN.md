# 🎮 PlayWithMe — Portfolio Taman Bermain Web
## Implementation Plan

> **Visi:** Sebuah portfolio yang bukan sekadar menampilkan CV digital,
> melainkan sebuah **taman bermain interaktif** yang membuktikan secara langsung
> bahwa web bisa melakukan hal-hal yang selama ini hanya dikira bisa dilakukan oleh aplikasi native.
> Setiap pengunjung harus pergi dengan satu pikiran: *"Kok bisa sih web bisa kayak gini?!"*

---

## 🧭 Arsitektur Pengalaman

```
playwithme.dev
├── / (Portal / Hero)           → Pintu masuk yang memukau — partikel reaktif & 3D teks
├── /about                      → Tentang sang developer, dengan storytelling interaktif  
├── /playground                 → Hub utama taman bermain (galeri semua game/experience)
│   ├── /playground/galaxy          🌌 Particle Galaxy
│   ├── /playground/physics         🎱 Physics Sandbox
│   ├── /playground/generative      🎨 Generative Art Engine
│   ├── /playground/audio           🎵 Audio Visualizer
│   ├── /playground/matrix          💻 Matrix Rain
│   ├── /playground/fluid           🌊 Fluid Cursor Trail
│   ├── /playground/snake           🐍 Neon Snake Game
│   └── /playground/memory          🃏 3D Memory Card Game
└── /contact                    → Form kontak dengan animasi premium
```

---

## 🌟 8 Pengalaman Interaktif (Mini Games & Demos)

### 1. 🌌 Particle Galaxy
**"Sentuh dan ciptakan galaksi"**
- **API:** Canvas 2D + requestAnimationFrame
- **Cara main:** Gerakan mouse = gravitasi. Klik = ledakan partikel. Scroll = zoom galaksi
- **Wow factor:** Ribuan partikel bergerak real-time mengikuti fisika gravitasi
- **Keterkaitan portfolio:** Menunjukkan kemampuan matematika & optimasi rendering

### 2. 🎱 Physics Sandbox
**"Jatuhkan benda, lihat fisika bekerja"**
- **API:** Matter.js (physics engine) + Canvas
- **Cara main:** Klik untuk spawn bola/kotak. Ada gravitasi, bounce, collision detection
- **Wow factor:** Benda-benda bertabrakan secara realistis di dalam browser
- **Keterkaitan portfolio:** Menunjukkan kemampuan integrasi library kompleks

### 3. 🎨 Generative Art Engine
**"Tidak ada dua karya yang sama"**
- **API:** Canvas 2D + Web Crypto API (untuk seed random)
- **Cara main:** Setiap klik "Generate" menghasilkan karya seni prosedural unik. Bisa di-download
- **Wow factor:** Algoritma Perlin noise + L-system menghasilkan pola organik indah
- **Keterkaitan portfolio:** Menunjukkan kreativitas + kemampuan algoritma

### 4. 🎵 Audio Visualizer
**"Musikmu menjadi seni visual"**
- **API:** Web Audio API + Canvas
- **Cara main:** Upload file audio / gunakan microphone → gelombang suara divisualisasikan real-time
- **Wow factor:** Frekuensi audio berubah menjadi animasi cahaya yang bergerak
- **Keterkaitan portfolio:** Menunjukkan penguasaan browser API tingkat lanjut

### 5. 💻 Matrix Rain Interactive
**"Kamu adalah Neo"**
- **API:** Canvas 2D + Keyboard Events
- **Cara main:** Ketik apapun → teks muncul sebagai hujan karakter Matrix. Ada easter egg tersembunyi
- **Wow factor:** Efek Matrix ikonik tapi dikustomisasi dengan input real-time pengguna
- **Keterkaitan portfolio:** Menunjukkan kemampuan kreativitas & DOM manipulation

### 6. 🌊 Fluid Cursor Simulation
**"Kursor yang meninggalkan jejak cairan"**
- **API:** WebGL (shader GLSL) / Canvas dengan fluid simulation algorithm
- **Cara main:** Gerak mouse meninggalkan efek cairan berwarna yang mengalir & menyebar
- **Wow factor:** Simulasi fluida real-time di browser tanpa plugin apapun
- **Keterkaitan portfolio:** Menunjukkan kemampuan WebGL / shader programming

### 7. 🐍 Neon Snake Game
**"Snake tapi dengan estetika cyberpunk"**
- **API:** Canvas 2D + Gamepad API (support controller!)
- **Cara main:** Game snake klasik dengan neon glow, particle trail, dan leaderboard lokal
- **Wow factor:** Support gamepad controller + visual neon yang stunning
- **Keterkaitan portfolio:** Menunjukkan kemampuan game loop & state management

### 8. 🃏 3D Flip Memory Game
**"Kartu yang terasa beneran dibalik"**
- **API:** CSS 3D Transforms + CSS Houdini Paint API
- **Cara main:** Temukan pasangan kartu. Kartu berputar 3D yang realistis. Timer & score system
- **Wow factor:** 3D flip yang meyakinkan, spring physics saat klik, haptic feedback
- **Keterkaitan portfolio:** Menunjukkan penguasaan CSS 3D & UX premium

---

## 🏠 Halaman Portal / Hero

**Konsep:** Bukan sekadar hero section biasa. Saat pertama masuk:

1. **Loading screen** dengan shimmer effect + progress bar (sesuai UI/UX Guidelines #5)
2. **Intro animation**: Nama developer muncul dari partikel yang menyatu
3. **Interactive background**: Ribuan partikel kecil yang bergerak mengikuti kursor
4. **3D Text**: Judul "PLAY WITH ME" dalam efek 3D depth yang bergerak dengan parallax
5. **Portal cards**: 8 kartu playground yang melayang dengan animasi hover 3D perspective tilt
6. **Ambient sound toggle**: Suara ambient cyberpunk yang bisa dinyalakan/dimatikan

---

## 🎨 Design Language

### Palet Warna
```
Background:    #050508  (hampir hitam, sedikit biru)
Primary:       #6366f1  (indigo elektrik)
Secondary:     #d946ef  (magenta neon)
Accent:        #06b6d4  (cyan)
Gold:          #f59e0b  (amber untuk highlight)
Success:       #10b981  (emerald)
```

### Typography
- **Display:** Outfit ExtraBlack (900) — untuk judul besar
- **Body:** Inter — untuk teks konten
- **Code/Mono:** JetBrains Mono — untuk elemen teknis & Matrix rain

### Visual Effects yang Wajib Ada
- ✅ Scanline overlay (efek monitor retro subtle)
- ✅ Chromatic aberration pada hover
- ✅ Noise texture overlay (grain film)
- ✅ Glow effect pada elemen aktif
- ✅ Glassmorphism cards
- ✅ Gradient mesh background yang bergerak lambat

---

## 🔧 Tech Stack

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| Framework | Nuxt 4 + Vue 3 | SSR, file-based routing, auto-imports |
| Styling | Tailwind CSS 4 | CSS-first config, utilities |
| 2D Rendering | Canvas 2D API | Native, zero deps untuk particles/games |
| Physics | Matter.js | Physics engine ringan & powerful |
| 3D | Three.js (optional, per scene) | WebGL abstraction |
| Audio | Web Audio API | Native, no deps |
| Animation | GSAP (untuk page transitions) | Smooth, timeline-based |
| State | Pinia | Vue-native state management |
| Fonts | Google Fonts + JetBrains Mono | Konsisten di semua device |

---

## 📐 Struktur File Rencana

```
app/
├── assets/
│   └── css/main.css
├── components/
│   ├── ui/
│   │   ├── SkeletonCard.vue        ← shimmer loading
│   │   ├── PressableBtn.vue        ← spring physics button
│   │   ├── PermissionModal.vue     ← humane permission
│   │   └── PageTransition.vue      ← fade/slide transitions
│   ├── portal/
│   │   ├── HeroCanvas.vue          ← partikel interaktif
│   │   ├── Portal3DText.vue        ← judul 3D parallax
│   │   └── PlaygroundCard.vue      ← kartu portal dengan 3D tilt
│   └── games/
│       ├── ParticleGalaxy.vue
│       ├── PhysicsSandbox.vue
│       ├── GenerativeArt.vue
│       ├── AudioVisualizer.vue
│       ├── MatrixRain.vue
│       ├── FluidCursor.vue
│       ├── NeonSnake.vue
│       └── MemoryGame.vue
├── composables/
│   ├── useHaptics.ts               ← haptic feedback
│   ├── useKeyboardAware.ts         ← keyboard responsiveness
│   ├── useCanvas.ts                ← canvas helper
│   ├── useAnimationFrame.ts        ← RAF lifecycle management
│   └── useAudio.ts                 ← Web Audio API helper
├── layouts/
│   └── default.vue
└── pages/
    ├── index.vue                   ← Portal Hero
    ├── about.vue
    ├── playground/
    │   ├── index.vue               ← Playground Hub
    │   ├── galaxy.vue
    │   ├── physics.vue
    │   ├── generative.vue
    │   ├── audio.vue
    │   ├── matrix.vue
    │   ├── fluid.vue
    │   ├── snake.vue
    │   └── memory.vue
    └── contact.vue
```

---

## 🚀 Fase Pengembangan

### Phase 1 — Foundation & Portal (Prioritas Tertinggi)
> Target: Halaman pertama yang sudah memukau

- [ ] Redesign halaman `/` menjadi portal yang menakjubkan
- [ ] Particle system interaktif sebagai background hero
- [ ] 3D text effect dengan parallax
- [ ] Portal cards dengan 3D perspective tilt hover
- [ ] Composables dasar (useHaptics, useCanvas, useAnimationFrame)
- [ ] UI components (PressableBtn dengan spring physics, SkeletonCard)
- [ ] Page transition yang smooth

### Phase 2 — Quick Win Games (Dampak Visual Tinggi)
> Target: 3 game yang paling "wow" duluan

- [ ] 🌌 Particle Galaxy
- [ ] 💻 Matrix Rain Interactive  
- [ ] 🌊 Fluid Cursor Simulation

### Phase 3 — Full Playground
> Target: Semua 8 experience selesai

- [ ] 🎱 Physics Sandbox (Matter.js)
- [ ] 🎨 Generative Art Engine
- [ ] 🎵 Audio Visualizer
- [ ] 🐍 Neon Snake Game
- [ ] 🃏 3D Memory Game

### Phase 4 — Polish & Portfolio Content
> Target: Siap dipublikasikan

- [ ] Halaman `/about` dengan storytelling interaktif
- [ ] Halaman `/contact` dengan form animasi premium
- [ ] SEO optimization
- [ ] Performance audit (target: Lighthouse 90+)
- [ ] Responsive & mobile optimization
- [ ] Deploy ke Vercel/Netlify

---

## 📊 Success Metrics

Seorang pengunjung dianggap "takjub" jika:
- ⏱️ Waktu di halaman > 3 menit
- 🔄 Mengunjungi > 3 playground experiences
- 📤 Membagikan link ke orang lain
- 💬 Meninggalkan pesan: *"Ini dibuat pakai web?!"*

---

*Dibuat: 2026-06-04 | Status: Planning*
