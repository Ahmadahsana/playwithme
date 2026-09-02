<template>
  <div class="relative min-h-screen bg-surface-950 text-white font-inter">
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
    <div class="absolute inset-0 noise-texture opacity-30 pointer-events-none" />

    <!-- Ambient Glow Orbs -->
    <div class="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

    <div class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <!-- Back Link -->
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors duration-200 mb-10 group"
      >
        <svg class="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali ke Beranda</span>
      </NuxtLink>

      <h1 class="font-outfit font-black text-4xl sm:text-5xl text-white mb-4">
        Kebijakan <span class="text-gradient">Privasi</span>
      </h1>
      <p class="text-surface-400 text-sm mb-10">Terakhir diperbarui: 2 September 2026</p>

      <div class="space-y-8 text-surface-300 text-sm sm:text-base leading-relaxed">
        <section class="space-y-2">
          <h2 class="font-outfit font-bold text-lg text-white">1. Ringkasan</h2>
          <p>
            PlayWithMe adalah proyek portofolio berisi demo interaktif. Situs ini
            tidak memiliki backend, tidak memerlukan akun, dan tidak mengumpulkan
            data pribadi Anda di server mana pun.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="font-outfit font-bold text-lg text-white">2. Data yang Disimpan di Perangkat</h2>
          <p>
            Beberapa preferensi (status suara, batas partikel, dan skor tertinggi
            permainan) disimpan secara lokal di browser Anda melalui
            <code class="text-brand-300">localStorage</code>. Data ini tidak pernah
            meninggalkan perangkat Anda dan dapat dihapus kapan saja dengan
            membersihkan data situs.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="font-outfit font-bold text-lg text-white">3. Izin Browser</h2>
          <p>
            Demo tertentu meminta akses mikrofon (Audio Visualizer) atau
            menggunakan Vibration, Gamepad, dan Web Audio API. Akses hanya diminta
            saat Anda memicunya, diproses sepenuhnya di dalam browser, dan tidak
            direkam atau dikirim ke mana pun.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="font-outfit font-bold text-lg text-white">4. Pihak Ketiga</h2>
          <p>
            Situs memuat font web dari Google Fonts. Selain itu tidak ada analitik,
            iklan, atau pelacak pihak ketiga yang digunakan.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="font-outfit font-bold text-lg text-white">5. Kontak</h2>
          <p>
            Pertanyaan seputar kebijakan ini dapat dikirim melalui halaman
            <NuxtLink to="/contact" class="text-brand-300 hover:text-brand-200 underline underline-offset-2">Kontak</NuxtLink>.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Kebijakan Privasi — PlayWithMe',
  description: 'Kebijakan privasi PlayWithMe: tanpa backend, tanpa pelacak, data preferensi hanya disimpan lokal di browser Anda.',
})
</script>

<style scoped>
.text-gradient {
  background-image: linear-gradient(to right, var(--color-brand-400), var(--color-accent-400), var(--color-brand-300));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
</style>
