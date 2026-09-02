<template>
  <div class="relative min-h-screen bg-surface-950 text-white font-inter">
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
    <div class="absolute inset-0 noise-texture opacity-30 pointer-events-none" />

    <!-- Ambient Glow Orbs -->
    <div class="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

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
        Ketentuan <span class="text-gradient">Layanan</span>
      </h1>
      <p class="text-surface-400 text-sm mb-10">Terakhir diperbarui: 2 September 2026</p>

      <div class="space-y-8 text-surface-300 text-sm sm:text-base leading-relaxed">
        <section class="space-y-2">
          <h2 class="font-outfit font-bold text-lg text-white">1. Penggunaan</h2>
          <p>
            PlayWithMe disediakan sebagai proyek portofolio dan demonstrasi teknis
            untuk keperluan hiburan dan edukasi. Anda bebas menjelajahi seluruh
            demo interaktif tanpa biaya.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="font-outfit font-bold text-lg text-white">2. Tanpa Jaminan</h2>
          <p>
            Situs ini disediakan "sebagaimana adanya" tanpa jaminan apa pun.
            Beberapa demo menggunakan grafis intensif yang mungkin berjalan berbeda
            tergantung perangkat dan browser Anda.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="font-outfit font-bold text-lg text-white">3. Kekayaan Intelektual</h2>
          <p>
            Kode sumber, desain, dan aset visual merupakan karya pembuat situs.
            Anda boleh mempelajarinya untuk referensi pribadi, namun tidak untuk
            didistribusikan ulang sebagai milik sendiri.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="font-outfit font-bold text-lg text-white">4. Perubahan</h2>
          <p>
            Ketentuan ini dapat diperbarui sewaktu-waktu. Versi terbaru selalu
            tersedia di halaman ini.
          </p>
        </section>

        <section class="space-y-2">
          <h2 class="font-outfit font-bold text-lg text-white">5. Kontak</h2>
          <p>
            Untuk pertanyaan, gunakan halaman
            <NuxtLink to="/contact" class="text-brand-300 hover:text-brand-200 underline underline-offset-2">Kontak</NuxtLink>.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Ketentuan Layanan — PlayWithMe',
  description: 'Ketentuan layanan PlayWithMe, proyek portofolio berisi demo web interaktif gratis untuk hiburan dan edukasi.',
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
