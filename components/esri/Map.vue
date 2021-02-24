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
    this.$store.dispatch("createMap");
    this.$store.dispatch("addImageryLayer");
  },
  methods: {
    onButtonClick() {
      console.log("btn click");
      loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/ImageryLayer",
        "esri/layers/support/RasterFunction"
      ]).then(([Map, MapView, ImageryLayer, RasterFunction]) => {
        console.log("look in here");
        console.log(this.imageryLayer);
        this.imageryLayer.renderingRule = this.colorRF2; // Set rendering rule to the raster function
      });
    }
    // loadMap() {
    //   // const options = { css: true };
    //   loadModules(
    //     [
    //       "esri/Map",
    //       "esri/views/MapView",
    //       "esri/layers/ImageryLayer",
    //       "esri/layers/support/RasterFunction"
    //     ]
    //     // options
    //   )
    //     .then(([Map, MapView, ImageryLayer, RasterFunction]) => {
    //       var remapRF = new RasterFunction({
    //         functionName: "Remap",
    //         functionArguments: {
    //           // pixel values of forest categories are 41, 42, and 43
    //           // according to the  raster attribute table.
    //           // The InputRanges property defines the ranges of initial pixel values to remap
    //           // Three ranges: [0, 41], [41, 44], and [44, 255] are defined to extract forest pixels.
    //           inputRanges: [0, 2, 2, 4, 4, 7],
    //           // non-forest pixels (0-41 and 44-255) are remapped to a value of 1,
    //           // forest pixels (41-44) are remapped to a value of 2.
    //           outputValues: [1, 2, 3],
    //           // $$(default) refers to the entire image service,
    //           // $2 refers to the second image of the image service
    //           raster: "$$"
    //         }
    //       });

    //       // The Colormap raster function adds color to each pixel
    //       // based on its pixel value
    //       var colorRF = new RasterFunction({
    //         functionName: "Colormap",
    //         functionArguments: {
    //           colormap: [
    //             // non-forest pixels (value of 1) are assigned
    //             // a yellowish color RGB = [253, 254, 152]
    //             [1, 253, 254, 152],
    //             // forest pixels (value of 2) are assigned
    //             // a greenish color RGB = [2, 102, 6]
    //             [2, 2, 255, 6],
    //             [3, 255, 255, 6]
    //           ],
    //           // Setting the previous raster function to the Raster
    //           // property of a new raster function allows you to chain functions
    //           raster: remapRF
    //         },
    //         outputPixelType: "U8"
    //       });
    //       this.colorRF2 = new RasterFunction({
    //         functionName: "Colormap",
    //         functionArguments: {
    //           colormap: [
    //             // non-forest pixels (value of 1) are assigned
    //             // a yellowish color RGB = [253, 254, 152]
    //             [1, 253, 254, 152],
    //             // forest pixels (value of 2) are assigned
    //             // a greenish color RGB = [2, 102, 6]
    //             [2, 2, 0, 6],
    //             [3, 255, 255, 6]
    //           ],
    //           // Setting the previous raster function to the Raster
    //           // property of a new raster function allows you to chain functions
    //           raster: remapRF
    //         },
    //         outputPixelType: "U8"
    //       });
    //       this.imageryLayer = new ImageryLayer({
    //         url:
    //           "https://cumulus.tnc.org/arcgis/rest/services/nascience/reforestation_potential_groa/ImageServer",
    //         format: "jpgpng" // server exports in either jpg or png format
    //         // renderingRule: colorRF
    //       });

    //       const map = new Map({
    //         basemap: "streets", // Basemap layer service
    //         layers: [this.imageryLayer]
    //       });
    //       const view = new MapView({
    //         map: map,
    //         center: [-85.805, 40.027], // Longitude, latitude
    //         zoom: 4, // Zoom level
    //         container: "mapDiv" // Div element
    //       });
    //     })
    //     .catch(err => {
    //       console.log("ERROR: " + err);
    //     });
    // }
  }
};
</script>

<style>
.map-wrapper {
  width: calc(100% - 350px);
  position: absolute;
  height: 100%;
}
</style>
