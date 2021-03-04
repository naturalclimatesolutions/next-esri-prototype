<template>
  <div class="raster-stats-wrapper">
    <h6>Raster Stats</h6>
    <div>Cell Count: {{ parseFloat(rasterPolyStats.count) }}</div>
    <div>Max: {{ parseFloat(rasterPolyStats.max).toFixed(2) }}</div>
    <div>Mean: {{ parseFloat(rasterPolyStats.mean).toFixed(2) }}</div>
    <div>Median: {{ parseFloat(rasterPolyStats.median).toFixed(2) }}</div>
    <div>Min: {{ parseFloat(rasterPolyStats.min).toFixed(2) }}</div>
    <div>Mode {{ parseFloat(rasterPolyStats.mode).toFixed(2) }}</div>
    <div>
      Stand Dev: {{ parseFloat(rasterPolyStats.standardDeviation).toFixed(2) }}
    </div>
    <div>Total time(ms): {{ rasterPolyStats.time }}</div>
    <!-- {{ context.state.totalTime }} -->
    <b-button @click="onClearStatsClick" variant="success" size="sm"
      >Clear stats</b-button
    >
  </div>
</template>

<script>
export default {
  computed: {
    rasterPolyStats() {
      return this.$store.getters.rasterPolyStats;
    },
  },
  methods: {
    onClearStatsClick() {
      console.log("clearStats");
      let clearStats = {
        max: 0,
        min: 0,
        median: 0,
        mode: 0,
        mean: 0,
        standardDeviation: 0,
        count: 0,
      };
      this.$store.commit("setRasterPolyStats", clearStats);
      this.$store.state.view.graphics.removeAll();
    },
  },
};
</script>

<style>
.raster-stats-wrapper {
  position: absolute;
  right: 20px;
  top: 20px;
  padding: 10px;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
}
</style>
