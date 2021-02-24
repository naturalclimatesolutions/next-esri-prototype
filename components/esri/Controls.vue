<template>
  <div><button @click="onButtonClick">Click to change Raster</button></div>
</template>

<script>
import { loadModules } from "esri-loader";
export default {
  methods: {
    onButtonClick() {
      this.$store.dispatch("changeImageryLayer");
      console.log("btn click");
      // loadModules([
      //   "esri/Map",
      //   "esri/views/MapView",
      //   "esri/layers/ImageryLayer",
      //   "esri/layers/support/RasterFunction"
      // ]).then(([Map, MapView, ImageryLayer, RasterFunction]) => {
      //   console.log("look in here");
      //   console.log(this.imageryLayer);
      //   this.imageryLayer.renderingRule = this.colorRF2; // Set rendering rule to the raster function
      // });
    }
  }
};
</script>
