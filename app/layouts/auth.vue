<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-forest)] to-[var(--color-forest-light)]">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white">
          <span class="text-[var(--color-leaf-light)]">The Ark</span> Registry
        </h1>
        <p class="text-white/60 text-sm mt-1">Documenting Earth's Biodiversity</p>
      </div>
      <div class="bg-white rounded-lg shadow-xl p-6">
        <slot />
      </div>
    </div>
  </div>
</template>
