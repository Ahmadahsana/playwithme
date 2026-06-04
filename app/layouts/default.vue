<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <AppNavbar />

    <!-- Page Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
