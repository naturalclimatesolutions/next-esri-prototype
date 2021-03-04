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
      map: undefined,
      view: undefined,
      rasterPixelValue: "NoData",
      rasterPolyStats: {
        max: 0,
        min: 0,
        median: 0,
        mode: 0,
        mean: 0,
        standardDeviation: 0,
        count: 0,
        time: 0,
      },
    },
    getters: {
      rasterPixelValue(state) {
        return state.rasterPixelValue;
      },
      rasterPolyStats(state) {
        return state.rasterPolyStats;
      },
    },
    mutations: {
      setRasterPolyStats(state, stats) {
        console.log(stats);
        state.rasterPolyStats = stats;
        console.log(state.rasterPolyStats);
      },
    },
    actions: {
      initMap(context) {
        // init raster functions on load of site
        context.dispatch("initRasterFunctions");

        // load map and mapView objects
        loadModules([
          "esri/Map",
          "esri/layers/GraphicsLayer",
          "esri/views/MapView",
          "esri/views/draw/Draw",
        ])
          .then(([Map, GraphicsLayer, MapView, Draw]) => {
            context.state.drawLayer = new GraphicsLayer();
            this.map = new Map({
              basemap: "gray-vector", // Basemap layer service
            });
            context.state.view = new MapView({
              map: this.map,
              center: [-50.805, 10.027], // Longitude, latitude
              zoom: 3, // Zoom level
              container: "mapDiv", // Div element
            });
            // draw object
            context.state.draw = new Draw({
              view: context.state.view,
            });

            context.state.view.ui.add(context.state.sketch, "top-right");

            // when view object is done loading, add imageryLayer
            context.state.view.when((evt) => {
              context.state.view.on("click", function(event) {
                let mapPoint = {
                  x: event.mapPoint.longitude,
                  y: event.mapPoint.latitude,
                };
                context.dispatch("queryImageService", mapPoint);
              });
              // context.state.view.on("pointer-move", function(event) {
              //   var screenPoint = {
              //     x: event.x,
              //     y: event.y,
              //   };

              //   context.state.view
              //     // the hit test works for vector layers and rasters with attribute table
              //     .hitTest(screenPoint)
              //     .then(function(response) {
              //       if (response.results.length > 0) {
              //         // console.log(response, "**************");
              //         // console.log(response.results[0].mapPoint.latitude);
              //         // console.log(response.results[0].mapPoint.longitude);
              //         let mapPoint = {
              //           x: response.results[0].mapPoint.latitude,
              //           y: response.results[0].mapPoint.latitude,
              //         };
              //         // context.dispatch("queryImageService", mapPoint);
              //       }
              //     });
              // });

              context.dispatch("addVectorLayers");
            });
          })
          .catch((err) => {
            console.log("ERROR: " + err);
          });
      },
      addImageryLayer() {
        this.map.removeAll();
        loadModules(["esri/layers/ImageryLayer"]).then(([ImageryLayer]) => {
          this.imageryLayer = new ImageryLayer({
            url:
              "https://cumulus.tnc.org/arcgis/rest/services/nascience/reforestation_potential_groa/ImageServer",
            format: "jpgpng", // server exports in either jpg or png format
            renderingRule: this.greenColorFunction,
          });
          this.map.add(this.imageryLayer);
        });
      },
      addVectorLayers() {
        loadModules(["esri/layers/FeatureLayer"]).then(([FeatureLayer]) => {
          this.map.removeAll();
          var vectorLayer1 = new FeatureLayer({
            opacity: 0.7,
            url:
              "https://cumulus.tnc.org/arcgis/rest/services/nascience/NCS_Reforestation_potential_by_admin_unit/MapServer/0",
          });
          var vectorLayer2 = new FeatureLayer({
            opacity: 0.7,
            url:
              "https://cumulus.tnc.org/arcgis/rest/services/nascience/NCS_Reforestation_potential_by_admin_unit/MapServer/1",
          });
          var vectorLayer3 = new FeatureLayer({
            opacity: 0.7,
            url:
              "https://cumulus.tnc.org/arcgis/rest/services/nascience/NCS_Reforestation_potential_by_admin_unit/MapServer/2",
          });
          this.map.addMany([vectorLayer1, vectorLayer2, vectorLayer3]);
        });
      },

      changeImageryLayertoGreen() {
        this.imageryLayer.renderingRule = this.greenColorFunction;
      },
      changeImageryLayertoTemp() {
        this.imageryLayer.renderingRule = this.tempColorFunction;
      },
      remapImageryLayerValues(context) {
        this.imageryLayer.renderingRule = this.mapColorToRemappedRaster;
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

            this.greenColorFunction = new RasterFunction({
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

            this.tempColorFunction = new RasterFunction({
              functionName: "Colormap",
              functionArguments: {
                ColorrampName: "Temperature",

                // Setting the previous raster function to the Raster
                // property of a new raster function allows you to chain functions
                raster: this.stretchFunction,
              },
              outputPixelType: "U8",
            });

            this.remapRasterValues = new RasterFunction({
              functionName: "Remap",
              functionArguments: {
                InputRanges: [0, 3, 3.1, 10], // remap pixels with values -3 to 10 to now have value of 1
                OutputValues: [1, 2], // remap pixel values from 11 to 37 to have a value of 2
                Raster: "$$", // Apply remap to the image service
              },
              outputPixelType: "U8",
            });

            this.mapColorToRemappedRaster = new RasterFunction({
              functionName: "Colormap",
              functionArguments: {
                Colormap: [
                  [1, 255, 0, 0], // Symbolize pixels with value of 1 using red color
                  [2, 0, 255, 0], // Symbolize pixels with value of 2 using green color
                ],
                Raster: this.remapRasterValues,
              },
            });
          }
        );
      },
      queryImageService(context, point) {
        console.log(point);
        let geom = {
          x: -122.895114,
          y: 45.558214,
          spatialReference: { wkid: 4269 },
        };
        let x = point.x;
        let y = point.y;
        let url = `https://cumulus.tnc.org/arcgis/rest/services/nascience/reforestation_potential_groa/ImageServer/identify?geometry={x: ${x},y: ${y},spatialReference: { wkid: 4269 },}&geometryType=esriGeometryPoint&mosaicRule=&renderingRule=&renderingRules=&pixelSize=&time=&returnGeometry=false&returnCatalogItems=false&f=pjson`;
        // let url2 =
        //   "https://cumulus.tnc.org/arcgis/rest/services/nascience/reforestation_potential_groa/ImageServer/identify?geometry=%7B%22x%22%3A-122.895114%2C%22y%22%3A45.558214%2C%22spatialReference%22%3A%7B%22wkid%22%3A4269%7D%7D&geometryType=esriGeometryPoint&mosaicRule=&renderingRule=&renderingRules=&pixelSize=&time=&returnGeometry=false&returnCatalogItems=false&f=pjson";
        this.$axios
          .get(url, {})
          // if successfull
          .then((response) => {
            console.log(response.data.value);
            context.state.rasterPixelValue = response.data.value;
          })
          // if error
          .catch((err) => {
            console.log(err);
            console.log(err.response);
          });
      },
      queryImageServiceByPolygon(context, evt, geometry) {
        loadModules(["esri/geometry/support/webMercatorUtils"]).then(
          ([webMercatorUtils]) => {
            const newGeomArray = [];
            context.state.graphic.geometry.rings[0].forEach((ring) => {
              newGeomArray.push(webMercatorUtils.xyToLngLat(ring[0], ring[1]));
            });
            let geomPoly = `{"rings": [${JSON.stringify(
              newGeomArray
            )}],"spatialReference": { "wkid": 4326 }}`;
            let url =
              "https://cumulus.tnc.org/arcgis/rest/services/nascience/reforestation_potential_groa/ImageServer/computeStatisticsHistograms?geometry=" +
              encodeURI(geomPoly) +
              "&geometryType=esriGeometryPolygon&mosaicRule=&renderingRule=&renderingRules=&pixelSize=&time=&returnGeometry=false&returnCatalogItems=false&f=pjson";
            var d = new Date();
            var n = d.getTime();
            this.$axios
              .get(url, {})
              // if successfull
              .then((response) => {
                var d2 = new Date();
                var n2 = d2.getTime();
                // console.log("after", n, n2, Math.abs(n - n2));

                // context.state.totalTime = Math.abs(n - n2);
                response.data.statistics[0].time = Math.abs(n - n2);
                context.commit(
                  "setRasterPolyStats",
                  response.data.statistics[0]
                );
              })
              // if error
              .catch((err) => {
                console.log(err);
                console.log(err.response);
              });

            ("computeStatisticsHistograms");
          }
        );
      },
      enableCreatePolygon(context) {
        loadModules(["esri/views/draw/PolygonDrawAction"]).then(
          ([PolygonDrawAction]) => {
            var action = context.state.draw.create("polygon");

            // PolygonDrawAction.vertex-add
            // Fires when user clicks, or presses the "F" key.
            // Can also be triggered when the "R" key is pressed to redo.
            action.on("vertex-add", function(evt) {
              context.dispatch("createPolygonGraphic", evt.vertices);
            });

            // PolygonDrawAction.vertex-remove
            // Fires when the "Z" key is pressed to undo the last added vertex
            action.on("vertex-remove", function(evt) {
              context.dispatch("createPolygonGraphic", evt.vertices);
            });

            // Fires when the pointer moves over the view
            action.on("cursor-update", function(evt) {
              context.dispatch("createPolygonGraphic", evt.vertices);
            });

            // Add a graphic representing the completed polygon
            // when user double-clicks on the view or presses the "C" key
            action.on("draw-complete", function(evt) {
              context.dispatch("createPolygonGraphic", evt.vertices);
              context.dispatch("queryImageServiceByPolygon");
            });
          }
        );
      },
      createPolygonGraphic(context, vertices) {
        loadModules(["esri/Graphic"]).then(([Graphic]) => {
          context.state.view.graphics.removeAll();
          var polygon = {
            type: "polygon", // autocasts as Polygon
            rings: vertices,
            spatialReference: context.state.view.spatialReference,
          };

          context.state.graphic = new Graphic({
            geometry: polygon,
            symbol: {
              type: "simple-fill", // autocasts as SimpleFillSymbol
              color: "rgba(100,100,100,.5)",
              style: "solid",
              outline: {
                // autocasts as SimpleLineSymbol
                color: "white",
                width: 1,
              },
            },
          });
          context.state.view.graphics.add(context.state.graphic);
        });
      },
    },
  });
};

export default createStore;
