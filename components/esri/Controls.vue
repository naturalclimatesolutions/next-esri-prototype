<template>
  <div>
    <div class="main-button-wrapper">
      <b-button
        @click="onVectorButtonClick"
        :pressed="vectorPress"
        variant="success"
        size="sm"
        >View Vector Data</b-button
      >
      <b-button
        @click="onRasterButtonClick"
        :pressed="rasterPress"
        variant="success"
        size="sm"
        >View Raster Data</b-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vectorPress: true,
      rasterPress: false,
    };
  },
  methods: {
    onVectorButtonClick() {
      this.vectorPress = true;
      this.rasterPress = false;
    },
    onRasterButtonClick() {
      this.vectorPress = false;
      this.rasterPress = true;
    },
  },
};
</script>

<style>
.main-button-wrapper {
  margin-top: 10px;
  text-align: center;
}
</style>
