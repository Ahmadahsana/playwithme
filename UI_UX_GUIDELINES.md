# 🎯 PlayWithMe — UI/UX Guidelines & Design Principles

> Dokumen ini adalah acuan wajib untuk setiap pengembangan UI/UX di project **PlayWithMe**.
> Setiap komponen, halaman, dan interaksi harus mengikuti prinsip-prinsip berikut.

---

## 1. 🫧 Fisika Pegas & Status Tekan (Spring Physics & Press States)

**Prinsip:**
Tombol dan elemen interaktif harus terasa "kenyal" atau mengecil saat ditekan, memberikan kepastian kepada pengguna bahwa aplikasi mendeteksi niat mereka. Interaksi juga harus **bisa dibatalkan** — jika pengguna menggeser jari/kursor menjauh sebelum melepas, aksi tidak jadi dilakukan.

**Tujuan Implementasi:**
- Setiap `<button>`, `<a>`, dan elemen interaktif wajib memiliki efek `scale-down` saat `active` / `mousedown` / `touchstart`
- Gunakan `transition` dengan `cubic-bezier` spring-like (contoh: `cubic-bezier(0.34, 1.56, 0.64, 1)`) untuk efek "bouncing back"
- Implementasikan logika **cancel-on-drag**: jika `pointermove` terdeteksi setelah `pointerdown` melebihi threshold (±10px), batalkan aksi

**Referensi CSS:**
```css
.pressable {
  transition: transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 150ms ease;
}
.pressable:active {
  transform: scale(0.94);
  opacity: 0.85;
}
```

**Referensi JS (cancel-on-drag):**
```js
let startX, startY, cancelled = false
el.addEventListener('pointerdown', e => { startX = e.clientX; startY = e.clientY; cancelled = false })
el.addEventListener('pointermove', e => {
  if (Math.abs(e.clientX - startX) > 10 || Math.abs(e.clientY - startY) > 10) cancelled = true
})
el.addEventListener('pointerup', e => { if (!cancelled) doAction() })
```

---

## 2. ✨ Animasi yang Sangat Halus (Subtle Animations)

**Prinsip:**
Hindari animasi berlebihan yang membuat aplikasi terasa murahan atau "noisy". Animasi harus **bermakna**, **cepat**, dan **tidak menghalangi pengguna**. Setiap transisi harus terasa alami.

**Tujuan Implementasi:**
- **Cross-fade pada ikon**: Saat state berubah (misal: ikon like → liked), gunakan opacity fade bukan pergantian mendadak
- **Zoom native saat membuka gambar**: Gunakan `transform: scale()` dari posisi thumbnail aslinya (shared element transition)
- **Fade-in saat pertama muat**: Setiap halaman/gambar yang baru dimuat harus fade-in dari opacity 0 → 1
- Durasi animasi: **100–300ms** untuk micro-interaction, **300–500ms** untuk transisi halaman
- Selalu gunakan `prefers-reduced-motion` untuk aksesibilitas

**Referensi CSS:**
```css
@media (prefers-reduced-motion: no-preference) {
  .fade-in {
    animation: fadeIn 250ms ease forwards;
  }
  .icon-crossfade {
    transition: opacity 150ms ease;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Referensi Vue Transition:**
```vue
<Transition name="fade" mode="out-in">
  <IconFilled v-if="isLiked" key="liked" />
  <IconOutline v-else key="unliked" />
</Transition>
```

---

## 3. 📳 Kepercayaan Fisik melalui Haptik (Physical Trust via Haptics)

**Prinsip:**
Getaran halus (haptic feedback) saat transaksi berhasil, saat toggle digeser, atau saat aksi spesifik dilakukan membuat pengguna lebih **percaya secara fisik** pada perangkat lunak.

**Tujuan Implementasi:**
- Gunakan **Vibration API** (`navigator.vibrate()`) untuk web mobile
- Pattern getaran:
  - ✅ Sukses / Konfirmasi: `[10]` (1 ketukan singkat)
  - ⚠️ Peringatan / Error: `[30, 50, 30]` (double tap)
  - 🔄 Toggle ON/OFF: `[8]` (sangat singkat)
  - 🗑️ Hapus / Destruktif: `[50, 30, 50]` (lebih kuat)
- Selalu cek ketersediaan API sebelum memanggil
- **Tidak wajib di desktop** — hanya aktif di mobile/touch device

**Referensi Composable:**
```ts
// composables/useHaptics.ts
export function useHaptics() {
  const canVibrate = () =>
    'vibrate' in navigator && window.matchMedia('(pointer: coarse)').matches

  return {
    success:     () => canVibrate() && navigator.vibrate([10]),
    warning:     () => canVibrate() && navigator.vibrate([30, 50, 30]),
    toggle:      () => canVibrate() && navigator.vibrate([8]),
    destructive: () => canVibrate() && navigator.vibrate([50, 30, 50]),
  }
}
```

---

## 4. ⌨️ Responsivitas terhadap Keyboard (Keyboard Responsiveness)

**Prinsip:**
Aplikasi premium **tidak membiarkan elemen layar statis** saat keyboard virtual muncul. Input harus mudah dijangkau, tidak tertutup keyboard, dan keyboard harus bisa ditutup dengan gestur yang intuitif.

**Tujuan Implementasi:**
- Gunakan `visualViewport` API untuk mendeteksi perubahan ukuran layar akibat keyboard
- Input aktif harus otomatis di-scroll ke area visible saat keyboard muncul (`scrollIntoView`)
- Implementasikan **swipe-down to dismiss keyboard**: deteksi gestur ke bawah pada area non-input
- Form container harus menggunakan `padding-bottom` dinamis sesuai tinggi keyboard
- Gunakan atribut HTML yang tepat: `inputmode`, `enterkeyhint`, `autocomplete`

**Referensi Composable:**
```ts
// composables/useKeyboardAware.ts
export function useKeyboardAware() {
  const keyboardHeight = ref(0)

  onMounted(() => {
    if (!window.visualViewport) return
    const handler = () => {
      const offset = window.innerHeight - (window.visualViewport?.height ?? window.innerHeight)
      keyboardHeight.value = Math.max(0, offset)
    }
    window.visualViewport.addEventListener('resize', handler)
    onUnmounted(() => window.visualViewport?.removeEventListener('resize', handler))
  })

  return { keyboardHeight }
}
```

**Referensi HTML:**
```html
<input
  type="email"
  inputmode="email"
  enterkeyhint="next"
  autocomplete="email"
  @focus="$el.scrollIntoView({ behavior: 'smooth', block: 'center' })"
/>
```

---

## 5. 🚀 Strategi Onboarding & Loading

### 5a. Izin yang Manusiawi (Humane Permissions)

**Prinsip:**
Jangan langsung meminta izin kamera, notifikasi, atau lokasi secara mendadak. **Jelaskan terlebih dahulu** mengapa izin tersebut diperlukan, berikan konteks manfaatnya, dan minta izin hanya saat pengguna sudah siap.

**Flow yang Benar:**
```
Pengguna klik "Aktifkan Notifikasi"
  → Tampil Modal Explainer:
      "Kami akan kirim notifikasi saat ada pesan baru."
    → [Ya, Aktifkan] → panggil Notification.requestPermission()
    → [Nanti Saja]  → simpan di localStorage, jangan tanya lagi 7 hari
```

**Aturan:**
- Selalu tampilkan **Permission Explainer Modal** SEBELUM memanggil browser API
- Modal harus menjelaskan: apa izinnya, mengapa dibutuhkan, manfaatnya untuk pengguna
- Berikan opsi "Sekarang" dan "Nanti" — jangan paksa
- Simpan state penolakan di `localStorage` agar tidak bertanya berulang

---

### 5b. Shimmer / Skeleton Loading

**Prinsip:**
Gunakan **efek shimmer / skeleton** sebagai pengganti spinner tradisional agar waktu tunggu terasa lebih singkat dan elegan. Skeleton harus menyerupai bentuk konten aslinya.

**Aturan:**
- Setiap komponen yang fetch data async **WAJIB** memiliki skeleton state
- Shimmer menggunakan animasi `background-position` dari kiri ke kanan
- Warna: `surface-800` sebagai base, shimmer menggunakan gradient `surface-700`
- Durasi: **1.5s** loop infinite
- Shape skeleton harus menyerupai konten asli (tinggi, lebar, border-radius yang sama)

**Referensi CSS:**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-800) 25%,
    var(--color-surface-700) 50%,
    var(--color-surface-800) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.5rem;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
```

**Referensi Komponen Vue:**
```vue
<!-- components/ui/SkeletonCard.vue -->
<template>
  <div class="card-glass p-6 space-y-3">
    <div class="skeleton h-5 w-3/4" />
    <div class="skeleton h-4 w-full" />
    <div class="skeleton h-4 w-5/6" />
    <div class="skeleton h-10 w-1/3 mt-4" />
  </div>
</template>
```

---

## ✅ Checklist Per Komponen

Gunakan checklist ini setiap kali membuat komponen baru:

| # | Checklist Item | Status |
|---|---------------|--------|
| 1 | Semua tombol/elemen klik punya efek `scale` saat ditekan? | ⬜ |
| 2 | Ada logika cancel-on-drag untuk touch interaction? | ⬜ |
| 3 | Animasi transisi menggunakan durasi ≤ 300ms? | ⬜ |
| 4 | `prefers-reduced-motion` sudah dipertimbangkan? | ⬜ |
| 5 | Ikon/state change menggunakan cross-fade (bukan ganti mendadak)? | ⬜ |
| 6 | Ada haptic feedback untuk aksi penting (mobile only)? | ⬜ |
| 7 | Input form sudah punya `inputmode` dan `enterkeyhint`? | ⬜ |
| 8 | Komponen yang fetch data punya skeleton/shimmer state? | ⬜ |
| 9 | Permission request didahului explainer UI? | ⬜ |
| 10 | Halaman baru fade-in saat pertama dimuat? | ⬜ |

---

*📌 Dokumen ini adalah **living document** — update sesuai kebutuhan project.*
*Terakhir diperbarui: 2026-06-04*
