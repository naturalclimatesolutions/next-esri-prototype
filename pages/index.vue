<template>
  <div class="sidebar-map-wrapper">
    <Sidebar />
    <EsriMap />
    <EsriRasterStats v-if="rasterPolyStats.max > 0" />
  </div>
</template>

<script>
export default {
  computed: {
    rasterPolyStats() {
      return this.$store.getters.rasterPolyStats;
    },
  },
};
</script>

<style>
.sidebar-map-wrapper {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
}
</style>
