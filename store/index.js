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
      reforestationImageryLayer: undefined,
    },
    getters: {},
    mutations: {},
    actions: {
      initMap(context) {
        // init raster functions on load of site
        context.dispatch("initRasterFunctions");

        // load map and mapView objects
        loadModules([
          "esri/Map",
          "esri/views/MapView",
          "esri/layers/FeatureLayer",
        ])
          .then(([Map, MapView, FeatureLayer]) => {
            this.map = new Map({
              basemap: "streets", // Basemap layer service
            });
            this.view = new MapView({
              map: this.map,
              center: [-50.805, 10.027], // Longitude, latitude
              zoom: 3, // Zoom level
              container: "mapDiv", // Div element
            });

            // when view object is done loading, add imageryLayer
            this.view.when((evt) => {
              var vectorLayer1 = new FeatureLayer({
                opacity: 50,
                url:
                  "https://cumulus.tnc.org/arcgis/rest/services/nascience/NCS_Reforestation_potential_by_admin_unit/MapServer/0",
              });
              var vectorLayer2 = new FeatureLayer({
                opacity: 50,
                url:
                  "https://cumulus.tnc.org/arcgis/rest/services/nascience/NCS_Reforestation_potential_by_admin_unit/MapServer/1",
              });
              var vectorLayer3 = new FeatureLayer({
                opacity: 50,
                url:
                  "https://cumulus.tnc.org/arcgis/rest/services/nascience/NCS_Reforestation_potential_by_admin_unit/MapServer/2",
              });
              this.map.addMany([vectorLayer1, vectorLayer2, vectorLayer3]);
            });
          })
          .catch((err) => {
            console.log("ERROR: " + err);
          });
      },
      addImageryLayer() {
        loadModules(["esri/layers/ImageryLayer"]).then(([ImageryLayer]) => {
          this.imageryLayer = new ImageryLayer({
            url:
              "https://cumulus.tnc.org/arcgis/rest/services/nascience/reforestation_potential_groa/ImageServer",
            format: "jpgpng", // server exports in either jpg or png format
            renderingRule: this.colorFunction,
          });
          this.map.add(this.imageryLayer);
        });
      },
      changeImageryLayer() {
        this.imageryLayer.renderingRule = this.colorRF2;
      },
      initRasterFunctions() {
        loadModules(["esri/layers/support/RasterFunction"]).then(
          ([RasterFunction]) => {
            this.stretchFunction = new RasterFunction({
              functionName: "Stretch",
              functionArguments: {
                StretchType: 4, // (0 = None, 3 = StandardDeviation, 4 = Histogram Equalization, 5 = MinMax, 6 = PercentClip, 9 = Sigmoid)
                Min: 0,
                Max: 255,
                Raster: "$$", // $$(default) refers to the entire image service, $2 refers to the second image of the image service
              },
              outputPixelType: "u8",
            });

            this.colorFunction = new RasterFunction({
              functionName: "Colormap",
              functionArguments: {
                // ColorrampName: "Green Light to Dark", // other examples: "Slope", "Surface", "Blue Bright"....
                Raster: this.stretchFunction, // chaining multiple rasterfunctions
                colorramp: {
                  type: "multipart",
                  colorRamps: [
                    {
                      type: "algorithmic",
                      fromColor: [220, 245, 233, 255],
                      toColor: [34, 102, 51, 255],
                      algorithm: "esriHSVAlgorithm",
                    },
                    // {
                    //   type: "algorithmic",
                    //   fromColor: [155, 34, 78, 255],
                    //   toColor: [255, 0, 0, 255],
                    //   algorithm: "esriCIELabAlgorithm",
                    // },
                  ],
                },
              },
            });

            this.colorRF2 = new RasterFunction({
              functionName: "Colormap",
              functionArguments: {
                ColorrampName: "Blue Bright",

                // Setting the previous raster function to the Raster
                // property of a new raster function allows you to chain functions
                raster: this.stretchFunction,
              },
              outputPixelType: "U8",
            });
          }
        );
      },
    },
  });
};

export default createStore;
