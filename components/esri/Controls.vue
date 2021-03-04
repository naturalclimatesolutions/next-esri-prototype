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
    <div v-if="vectorPress" class="vector-wrapper">
      <h5 style="margin-top:10px;">
        Hover over map for polygon value
      </h5>
    </div>
    <div v-if="rasterPress">
      <div class="raster-wrapper">
        <b-button @click="onGreenScaleButtonClick" variant="secondary" size="sm"
          >Change to Green Scale</b-button
        >
        <br />
        <br />
        <div>
          Use the colormap
          <a
            href="https://developers.arcgis.com/documentation/common-data-types/raster-function-objects.htm"
            >raster function</a
          >
          to change the color ramp
        </div>
        <b-button @click="onTempScaleButtonClick" variant="secondary" size="sm"
          >Change to Temp Color Scale</b-button
        >
        <br />
        <br />
        <div>
          Use the remap
          <a
            href="https://developers.arcgis.com/documentation/common-data-types/raster-function-objects.htm"
            >raster function</a
          >
          to remap original raster values to 1 (red) or 2 (green)
        </div>
        <b-button @click="remapImageryLayer" variant="secondary" size="sm"
          >Remap raster values to two values</b-button
        >
        <!-- <br />
        <br />
        <div>Sum two rasters</div>
        <b-button @click="sumRasters" variant="secondary" size="sm"
          >Sum two raster</b-button
        > -->
      </div>
      <hr />
      <div class="raster-query-wrapper">
        <h5>Raster Query</h5>
        <div>Click on raster to get value: {{ rasterPixelValue }}</div>
        <div>
          <h5>Raster Polygon Query</h5>
          <div>Click on map to draw polygon, double click to finish</div>
          <b-button @click="drawPolygon" variant="secondary" size="sm"
            >Click to start polygon</b-button
          >
        </div>
      </div>
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
  computed: {
    rasterPixelValue() {
      return this.$store.getters.rasterPixelValue;
    },
  },
  methods: {
    drawPolygon() {
      this.$store.dispatch("enableCreatePolygon");
    },
    onVectorButtonClick() {
      this.vectorPress = true;
      this.rasterPress = false;
      this.$store.dispatch("addVectorLayers");
    },
    onRasterButtonClick() {
      this.vectorPress = false;
      this.rasterPress = true;
      this.$store.dispatch("addImageryLayer");
    },
    onGreenScaleButtonClick() {
      this.$store.dispatch("changeImageryLayertoGreen");
    },
    onTempScaleButtonClick() {
      this.$store.dispatch("changeImageryLayertoTemp");
    },
    remapImageryLayer() {
      this.$store.dispatch("remapImageryLayerValues");
    },
    sumRasters() {
      this.$store.dispatch("sumRasterLayers");
    },
  },
};
</script>

<style>
.main-button-wrapper {
  margin-top: 10px;
  text-align: center;
}
.vector-wrapper {
  text-align: center;
}
.raster-wrapper {
  font-size: 15px;
  margin-left: 15px;
  text-align: left;
  padding-top: 20px;
}
.raster-query-wrapper {
  padding-left: 20px;
  font-size: 15px;
}
</style>
