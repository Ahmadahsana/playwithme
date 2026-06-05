# ✅ PlayWithMe — Task Board

> Lihat [plan.md](plan.md) untuk visi lengkap dan arsitektur.
> Update status task ini setelah setiap sesi kerja.

**Legend:** 🔴 Todo · 🟡 In Progress · 🟢 Done · ⏸️ Blocked

---

## 🏁 Phase 1 — Foundation & Portal Hero
> **Goal:** Halaman pertama sudah cukup memukau untuk membuat orang penasaran

### 1.1 Setup & Struktur
- 🟢 `DONE` Init project Nuxt 4
- 🟢 `DONE` Setup Tailwind CSS 4 dengan `@tailwindcss/vite`
- 🟢 `DONE` Pindah `assets/` ke dalam `app/` (Nuxt 4 convention)
- 🟢 `DONE` Install dependencies tambahan: `gsap`, `matter-js`, `pinia`
- 🟢 `DONE` Setup Pinia store (global state: audio on/off, score, settings)
- 🟢 `DONE` Setup page transitions global di `app.vue`

### 1.2 Composables Dasar
- 🟢 `DONE` `composables/useHaptics.ts` — Vibration API patterns
- 🟢 `DONE` `composables/useCanvas.ts` — Setup canvas, resize handler, RAF cleanup
- 🟢 `DONE` `composables/useAnimationFrame.ts` — RAF lifecycle dengan pause/resume
- 🟢 `DONE` `composables/useKeyboardAware.ts` — visualViewport keyboard detection
- 🟢 `DONE` `composables/usePressable.ts` — Spring physics + cancel-on-drag logic

### 1.3 UI Components Dasar
- 🟢 `DONE` `components/ui/PressableBtn.vue` — Tombol dengan spring physics (sesuai Guidelines #1)
- 🟢 `DONE` `components/ui/SkeletonCard.vue` — Shimmer loading skeleton (sesuai Guidelines #5b)
- 🟢 `DONE` `components/ui/PermissionModal.vue` — Explainer sebelum minta izin mic/notif
- 🟢 `DONE` `components/ui/PageTransition.vue` — Fade + slide transition (diimplementasi via nuxt.config.ts)
- 🟢 `DONE` `components/ui/IconCrossFade.vue` — Cross-fade wrapper untuk ikon (Guidelines #2)

### 1.4 Hero Portal (`pages/index.vue`)
- 🟢 `DONE` **Particle Background Canvas** — Ribuan partikel yang bergerak & reaktif terhadap mouse (diimplementasikan di `HeroCanvas.vue`)
  - Partikel membentuk konstelasi (connected lines jika berdekatan)
  - Mouse repel/attract effect
  - Spawn burst saat klik
- 🟢 `DONE` **3D Parallax Text** — "PLAY WITH ME" dengan depth layer berbeda (diimplementasikan di `Portal3DText.vue`)
  - Mouse move = teks bergeser dengan kedalaman berbeda
  - Glitch effect subtle saat hover
- 🟢 `DONE` **Playground Portal Cards** — 8 kartu yang melayang (diimplementasikan di `PlaygroundCard.vue`)
  - 3D perspective tilt mengikuti posisi kursor (mousemove per card)
  - Glow effect pada border saat hover
  - Floating animation dengan timing offset berbeda tiap kartu
  - Spring physics saat diklik (Guidelines #1)
- 🟢 `DONE` **Scanline + Noise overlay** — Efek retro monitor subtle
- 🟢 `DONE` **Ambient sound toggle** — Tombol on/off suara ambient (diimplementasikan via `useAudio.ts`)
- 🟢 `DONE` **Shimmer loading screen** — Saat pertama masuk (Guidelines #5b)

### 1.5 Navbar & Layout Update
- 🟢 `DONE` Update `AppNavbar.vue` — Link ke Playground hub & About
- 🟢 `DONE` Hapus halaman yang tidak relevan (features.vue, explore.vue, pricing.vue)
- 🟢 `DONE` Update `AppFooter.vue` dengan info portfolio

---

## 🎮 Phase 2 — Quick Win Games (Visual Impact Tinggi)
> **Goal:** 3 experience paling "wow" dulu — bisa langsung dipamerkan

### 2.1 🌌 Particle Galaxy (`pages/playground/galaxy.vue`)
- 🟢 `DONE` Canvas setup fullscreen dengan resize handler
- 🟢 `DONE` Sistem partikel dengan gravitasi (ribuan titik, 60fps stabil)
- 🟢 `DONE` Mouse drag = field gravitasi bergerak
- 🟢 `DONE` Klik = supernova explosion (burst partikel berwarna)
- 🟢 `DONE` Scroll = zoom in/out galaksi
- 🟢 `DONE` Color mode toggle (nebula merah, cyan, gold, dll)
- 🟢 `DONE` FPS counter display (menunjukkan performa)
- 🟢 `DONE` Tombol "Reset" dan "Screenshot" (download canvas sebagai PNG)

### 2.2 💻 Matrix Rain Interactive (`pages/playground/matrix.vue`)
- 🟢 `DONE` Canvas fullscreen dengan karakter Katakana + Latin
- 🟢 `DONE` Rain columns dengan kecepatan & opacity berbeda-beda
- 🟢 `DONE` Keyboard input: teks yang diketik muncul tersisip dalam rain
- 🟢 `DONE` Easter egg: ketik "neo" → efek bullet-time (rain melambat dramatis)
- 🟢 `DONE` Easter egg: ketik nama developer → rain berhenti & pesan muncul
- 🟢 `DONE` Color picker untuk warna rain (default hijau, bisa ganti)
- 🟢 `DONE` Speed slider (lambat–cepat)
- 🟢 `DONE` "Send message" mode — ketik pesan → tampil di tengah layar dramatis

### 2.3 🌊 Fluid Cursor (`pages/playground/fluid.vue`)
- 🟢 `DONE` WebGL shader / Canvas fluid simulation
- 🟢 `DONE` Kursor meninggalkan jejak cairan berwarna yang menyebar
- 🟢 `DONE` Warna berubah berdasarkan kecepatan gerakan mouse
- 🟢 `DONE` Tap/klik = splash efek (densitas & kecepatan disuntikkan)
- 🟢 `DONE` Color palette selector (6 preset tema warna)
- 🟢 `DONE` Viscosity slider (encer → kental)
- 🟢 `DONE` "Freeze" mode: matikan simulasi, hasilnya bisa di-screenshot

---

## 🏆 Phase 3 — Full Playground
> **Goal:** Semua 8 experience selesai dan bisa dimainkan

### 3.1 🎱 Physics Sandbox (`pages/playground/physics.vue`)
- 🟢 `DONE` Install & setup `matter-js`
- 🟢 `DONE` Ground + dinding tak terlihat sebagai boundary
- 🟢 `DONE` Klik = spawn bola dengan material berbeda (karet, batu, balon)
- 🟢 `DONE` Drag = lempar benda (velocity dari gestur)
- 🟢 `DONE` Gravity slider (0 = weightless, max = heavy)
- 🟢 `DONE` "Wrecking ball" mode: bola besar berayun dari atas
- 🟢 `DONE` Object palette: sphere, box, triangle, polygon
- 🟢 `DONE` Reset button dengan animasi semua objek meledak/terbang

### 3.2 🎨 Generative Art Engine (`pages/playground/generative.vue`)
- 🟢 `DONE` Algoritma Perlin noise untuk pola organik (diimplementasikan via flow field)
- 🟢 `DONE` L-system untuk struktur seperti pohon/fraktal (diimplementasikan via recursive branching tree)
- 🟢 `DONE` Setiap klik "Generate" = seed unik (dari custom string input)
- 🟢 `DONE` Parameter slider: complexity, color harmony, density
- 🟢 `DONE` Real-time preview saat slider digeser
- 🟢 `DONE` Download sebagai PNG (resolusi tinggi)
- 🟢 `DONE` "Share seed" — generate URL dengan seed yang sama untuk dibagikan
- 🟢 `DONE` Gallery / Favorit (semua seed tersimpan di URL / clipboard)

### 3.3 🎵 Audio Visualizer (`pages/playground/audio.vue`)
- 🟢 `DONE` Humane permission modal untuk mic (sesuai Guidelines #5a)
- 🟢 `DONE` Mode 1: Upload file audio (MP3/WAV)
- 🟢 `DONE` Mode 2: Microphone real-time
- 🟢 `DONE` Visualisasi: bar chart frekuensi (FFT)
- 🟢 `DONE` Visualisasi: waveform gelombang suara (oscilloscope)
- 🟢 `DONE` Visualisasi: circular/radial mode
- 🟢 `DONE` Warna berubah dinamis berdasarkan amplitude
- 🟢 `DONE` Beat detection: camera shake dan ambient glow beat
- 🟢 `DONE` BPM / Beat detection display

### 3.4 🐍 Neon Snake (`pages/playground/snake.vue`)
- 🟢 `DONE` Game loop dengan `requestAnimationFrame`
- 🟢 `DONE` Grid-based movement dengan smooth visual interpolation
- 🟢 `DONE` Neon glow trail di belakang ular
- 🟢 `DONE` Particle burst saat makan food
- 🟢 `DONE` Keyboard controls (WASD + Arrow keys)
- 🟢 `DONE` Touch swipe controls untuk mobile
- 🟢 `DONE` Gamepad API support (controller Xbox/PS)
- 🟢 `DONE` Haptic feedback saat makan & mati (Guidelines #3)
- 🟢 `DONE` High score di localStorage & Pinia
- 🟢 `DONE` Level / Speed system (makin cepat sesuai score)
- 🟢 `DONE` Sound effects (Web Audio API synthesized beeps)

### 3.5 🃏 3D Memory Game (`pages/playground/memory.vue`)
- 🟢 `DONE` Grid kartu 4x4 & 6x6 dengan CSS 3D flip
- 🟢 `DONE` Desain kartu: emoji/ikon yang tematis
- 🟢 `DONE` Spring physics saat kartu diklik (Guidelines #1)
- 🟢 `DONE` Shimmer effect saat loading awal / transisi
- 🟢 `DONE` Cross-fade status / emoji
- 🟢 `DONE` Haptic feedback saat match/fail (Guidelines #3)
- 🟢 `DONE` Timer countdown / tracking
- 🟢 `DONE` Score / Moves system
- 🟢 `DONE` Win animation: happy arpeggio synth chime
- 🟢 `DONE` Difficulty selector: 4x4, 6x6

---

## ✨ Phase 4 — Polish & Portfolio Content
> **Goal:** Siap dipublikasikan dan di-share ke dunia

### 4.1 Halaman `/about`
- 🟢 `DONE` Hero section dengan foto + animasi typing nama
- 🟢 `DONE` Timeline skill sebagai progress bar interaktif
- 🟢 `DONE` Tech stack sebagai interactive cards (hover = detail)
- 🟢 `DONE` "What I love" section dengan animated icons
- 🟢 `DONE` Link ke GitHub, LinkedIn, dll

### 4.2 Halaman `/contact`
- 🟢 `DONE` Form dengan keyboard responsiveness (Guidelines #4)
- 🟢 `DONE` Input fields dengan smooth focus animation
- 🟢 `DONE` Submit button dengan loading state + haptic success (Guidelines #3)
- 🟢 `DONE` Success state dengan confetti animation

### 4.3 Playground Hub (`pages/playground/index.vue`)
- 🟢 `DONE` Gallery semua 8 experience dengan preview
- 🟢 `DONE` Preview interaktif: hover = mini preview langsung di kartu
- 🟢 `DONE` Difficulty badge (Easy/Medium/Hard)
- 🟢 `DONE` "New" badge untuk experience terbaru

### 4.4 Performance & Quality
- 🟢 `DONE` Lighthouse audit — target score 90+ semua kategori
- 🟢 `DONE` `prefers-reduced-motion` di semua animasi (Guidelines #2)
- 🟢 `DONE` Canvas cleanup (clearInterval, cancelAnimationFrame) di onUnmounted
- 🟢 `DONE` Lazy load setiap game canvas (tidak load sebelum visible)
- 🟢 `DONE` Error boundaries per game (jika 1 game crash, tidak merusak halaman lain)
- 🟢 `DONE` `<meta>` tags & OG image untuk social sharing

### 4.5 Deployment
- 🔴 Setup Vercel / Netlify
- 🔴 Custom domain
- 🔴 Environment variables (jika ada)
- 🔴 Final QA di berbagai device (mobile, tablet, desktop)

---

## 📈 Progress Summary

| Phase | Tasks | Done | Progress |
|-------|-------|------|----------|
| Phase 1 — Foundation | 25 | 25 | ▓▓▓▓▓▓▓▓▓▓ 100% |
| Phase 2 — Quick Win | 15 | 15 | ▓▓▓▓▓▓▓▓▓▓ 100% |
| Phase 3 — Full Games | 25 | 25 | ▓▓▓▓▓▓▓▓▓▓ 100% |
| Phase 4 — Polish     | 23 | 19 | ▓▓▓▓▓▓▓▓░░ 82.6% |
| **Total**            | **88** | **84** | **95.4%**  |

---

## 🗒️ Notes & Decisions

- **Canvas vs WebGL**: Mulai dengan Canvas 2D untuk semua game kecuali Fluid (perlu WebGL untuk performa)
- **Matter.js**: Pilih Matter.js bukan Rapier karena API-nya lebih ramah untuk Vue integration
- **GSAP**: Digunakan hanya untuk page transitions dan animasi non-game. Canvas animations pakai RAF sendiri
- **Audio**: Selalu tampilkan PermissionModal sebelum akses microphone
- **Mobile**: Semua game WAJIB punya mode touch. Gamepad API sebagai bonus
- **Performance budget**: Target 60fps stabil. Jika partikel < 60fps, kurangi jumlah otomatis

---

*Update terakhir: 2026-06-04 | Next: Mulai Phase 4 — Polish & Portfolio Content*
