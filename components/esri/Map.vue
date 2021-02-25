<template>
  <div>
    <div class="map-wrapper" id="mapDiv"></div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";

// use code below if you wnat to use a specific version of the ESRI API
// loadScript({ url: "https://js.arcgis.com/4.2/" });

export default {
  mounted() {
    // load map once component is mounted
    this.$store.dispatch("initMap");
  },
  methods: {
    onButtonClick() {
      this.imageryLayer.renderingRule = this.colorRF2;
    },
  },
};
</script>

<style>
.map-wrapper {
  width: calc(100% - 350px);
  position: absolute;
  height: 100%;
}
</style>
