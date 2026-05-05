<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    // Scale card/strip pixel sizes down on non-retina screens (devicePixelRatio < 2).
    // A retina Mac (dpr=2) is the design reference → scale=1; a non-retina tablet
    // (dpr=1) gets scale=0.5 so cards are physically the same size.
    const scale = Math.min(1, (window.devicePixelRatio || 1) / 2)
    document.documentElement.style.setProperty('--px-scale', scale)
  }
}
</script>

<style>
</style>
