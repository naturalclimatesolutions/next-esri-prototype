import Vuex from "vuex";

// load ESRI code
import { loadScript } from "esri-loader";
import { loadCss } from "esri-loader";
import { loadModules } from "esri-loader";
loadCss();
loadScript();

const createStore = () => {
  return new Vuex.Store({
    state: {
      reforestationImageryLayer: undefined
    },
    getters: {},
    mutations: {},
    actions: {
      createMap() {
        loadModules([
          "esri/Map",
          "esri/views/MapView",
          "esri/layers/ImageryLayer",
          "esri/layers/support/RasterFunction"
        ])
          .then(([Map, MapView, ImageryLayer, RasterFunction]) => {
            this.map = new Map({
              basemap: "streets" // Basemap layer service
            });
            this.view = new MapView({
              map: this.map,
              center: [-85.805, 40.027], // Longitude, latitude
              zoom: 4, // Zoom level
              container: "mapDiv" // Div element
            });
          })
          .catch(err => {
            console.log("ERROR: " + err);
          });
      },
      addImageryLayer() {
        loadModules(["esri/layers/ImageryLayer"]).then(([ImageryLayer]) => {
          this.imageryLayer = new ImageryLayer({
            url:
              "https://cumulus.tnc.org/arcgis/rest/services/nascience/reforestation_potential_groa/ImageServer",
            format: "jpgpng" // server exports in either jpg or png format
            // renderingRule: colorRF
          });
          this.map.add(this.imageryLayer);
        });
      },
      changeImageryLayer() {
        loadModules(["esri/layers/support/RasterFunction"]).then(
          ([RasterFunction]) => {
            this.colorRF2 = new RasterFunction({
              functionName: "Colormap",
              functionArguments: {
                colormap: [
                  [0, 220, 245, 233],
                  [1, 178, 214, 190],
                  [2, 136, 184, 149],
                  [3, 100, 156, 113],
                  [4, 65, 128, 79],
                  [5, 34, 102, 51],
                  [(6, 34, 102, 51)],
                  [(6.5, 34, 102, 51)]

                  //   [0.3, 220, 245, 233],
                  //   [0.6, 202, 232, 214],
                  //   [1, 184, 219, 196],
                  //   [1.5, 253, 254, 152],
                  //   [2, 253, 254, 152],
                  //   [2.5, 253, 254, 152],
                  //   [3, 253, 254, 152],
                  //   [3.5, 253, 254, 152],
                  //   [4, 253, 254, 152],
                  //   [4.5, 253, 254, 152],
                  //   [(5, 253, 254, 152)],
                  //   [(5.5, 253, 254, 152)],
                  //   [(6, 253, 254, 152)]
                ]
                // Setting the previous raster function to the Raster
                // property of a new raster function allows you to chain functions
                // raster: remapRF
              },
              outputPixelType: "U8"
            });
            this.imageryLayer.renderingRule = this.colorRF2;
          }
        );
      }
    }
  });
};

export default createStore;
