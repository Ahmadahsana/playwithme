<template>
  <div class="section-padding py-24 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-4">
        🌟 Explore
      </div>
      <h1 class="font-outfit font-black text-5xl text-white mb-4">
        Explore the <span class="text-gradient">Playground</span>
      </h1>
      <p class="text-surface-400 max-w-xl mx-auto text-lg">
        Browse categories, discover content, and find what excites you most.
      </p>
    </div>

    <!-- Search Bar -->
    <div class="max-w-2xl mx-auto mb-12">
      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          id="explore-search"
          v-model="searchQuery"
          type="search"
          placeholder="Search anything..."
          class="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-surface-500 focus:outline-none focus:border-brand-500/50 focus:bg-white/8 transition-all duration-200 backdrop-blur-sm"
        />
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="flex flex-wrap gap-3 justify-center mb-12">
      <button
        v-for="cat in categories"
        :key="cat.id"
        :id="`cat-${cat.id}`"
        class="px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200"
        :class="activeCategory === cat.id
          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
          : 'bg-white/5 text-surface-300 hover:bg-white/10 hover:text-white border border-white/10'"
        @click="activeCategory = cat.id"
      >
        {{ cat.emoji }} {{ cat.label }}
      </button>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="card-glass overflow-hidden group cursor-pointer"
      >
        <!-- Card Image Placeholder -->
        <div class="h-48 relative overflow-hidden flex items-center justify-center text-6xl" :class="item.bgColor">
          <span class="transition-transform duration-300 group-hover:scale-125">{{ item.emoji }}</span>
          <div class="absolute inset-0 bg-gradient-to-t from-surface-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <!-- Card Content -->
        <div class="p-5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {{ item.category }}
            </span>
            <span class="text-surface-500 text-xs">{{ item.date }}</span>
          </div>
          <h3 class="font-outfit font-bold text-lg text-white mb-2 group-hover:text-gradient transition-all duration-300 line-clamp-1">
            {{ item.title }}
          </h3>
          <p class="text-surface-400 text-sm leading-relaxed line-clamp-2">{{ item.description }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredItems.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="font-outfit font-bold text-2xl text-white mb-2">Nothing found</h3>
      <p class="text-surface-400">Try a different search term or category.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Explore — PlayWithMe',
  description: 'Explore the PlayWithMe playground. Browse categories and discover amazing content.',
})

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'games', label: 'Games', emoji: '🎮' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'social', label: 'Social', emoji: '👥' },
  { id: 'learning', label: 'Learning', emoji: '📚' },
]

const items = [
  { id: 1, title: 'Adventure Quest', description: 'Embark on an epic journey through fantastical worlds and challenges.', category: 'Games', emoji: '🏰', bgColor: 'bg-purple-900/40', date: 'Today', tag: 'games' },
  { id: 2, title: 'Digital Art Studio', description: 'Create stunning digital artwork with powerful tools and brushes.', category: 'Creative', emoji: '🖼️', bgColor: 'bg-pink-900/40', date: 'Yesterday', tag: 'creative' },
  { id: 3, title: 'Community Hub', description: 'Connect with friends and meet new people who share your interests.', category: 'Social', emoji: '🌐', bgColor: 'bg-blue-900/40', date: '2 days ago', tag: 'social' },
  { id: 4, title: 'Code Challenge', description: 'Test your programming skills with fun and rewarding coding challenges.', category: 'Learning', emoji: '💻', bgColor: 'bg-green-900/40', date: '3 days ago', tag: 'learning' },
  { id: 5, title: 'Music Mixer', description: 'Compose and mix tracks with an intuitive music creation interface.', category: 'Creative', emoji: '🎵', bgColor: 'bg-yellow-900/40', date: '4 days ago', tag: 'creative' },
  { id: 6, title: 'Trivia Battle', description: 'Compete in real-time trivia battles with players worldwide.', category: 'Games', emoji: '🎯', bgColor: 'bg-red-900/40', date: '5 days ago', tag: 'games' },
]

const filteredItems = computed(() => {
  return items.filter(item => {
    const matchesCategory = activeCategory.value === 'all' || item.tag === activeCategory.value
    const matchesSearch = !searchQuery.value || item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})
</script>
