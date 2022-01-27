require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/LayerList",
    "esri/widgets/Legend",
], (Map, SceneView, FeatureLayer, Graphic, GraphicsLayer, BasemapGallery, Expand, LayerList, Legend) => {


    const map1 = new Map({
        basemap: "topo-vector"
    });

    const view = new SceneView({
        map: map1,
        container: "mapDiv",
        center:[-100.4593, 36.9014],
        zoom:5
    });

    const template = {
        title: "{PLACE}",
        content: [
            {
                type: "fields",
                fieldInfos: [
                    { 
                        fieldName: "MAGNITUDE",
                        label: "Magnituda",
                    },
                    {
                        fieldName: "DEPTH",
                        label: "Głębokość",
                    },
                    {
                        fieldName: "LATITUDE",
                        label: "Szerokość geograficzna"
                    },
                    {
                        fieldName: "LONGITUDE",
                        label: "Długość geograficzna"
                    }
                ]
            }
        ]
    };


    const gl = new GraphicsLayer();

    const fl = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0",
        popupTemplate: template,
    });

    map1.add(fl);
    map1.add(gl);


    const legend = new Legend({
        view: view,
        layerInfos: [
          {
            layer: fl,
            title: "Earthquakes"
          }
        ]
    });

    view.ui.add(legend, "bottom-right");

    const layerList = new LayerList({
        view: view
    });

    view.ui.add(layerList, "bottom-left");


    const bmWg = new BasemapGallery({
        view: view
    });

    const expandWg = new Expand({
        view: view,
        content: bmWg
    });

    view.ui.add(expandWg, {
        position: "top-right"
    });


    let query = fl.createQuery();
    query.where = "MAGNITUDE >= 4";
    query.outField = ["*"];
    query.returnGeometry = true;

    fl.queryFeatures(query)
    .then(response => {
         console.log(response);
         getResults(response.features);
     })
     .catch(err => {
         console.log(err);
     });

     const getResults = (features) => {
         const symbol = {
            type: "point-3d",
            symbolLayers: [{
              type: "object",
              width: 50000,
              height: 50000,
              size: 500,
              resource: { primitive: "cylinder" },
              material: { color: "#cb42f5" }
            }]
         };
     features.map(elem => {
         elem.symbol = symbol;
     });
     gl.addMany(features);
     };


    const simple = {
        type: "simple",
        symbol: {
            type: "point-3d",
            symbolLayers: [
                {
                    type: "object",
                    resource: {
                        primitive: "cylinder"
                    },
                    width: 5000000
                }
            ],
            size: 6,
            color: "red",
            style: "square"
        },
        label: "Hurricane",
        visualVariables: [
            {
                type: "color",
                field: "MAGNITUDE",
                stops: [
                    {
                        value: 0.5,
                        color: "green"
                    },
                    {
                        value: 1.13,
                        color: "yellow"
                    },
                    {
                        value: 4.48,
                        color: "red"
                    }
                ]
            },
            {
                type: "size",
                field: "DEPTH",
                stops: [
                    {
                        value: -3.39,
                        size: 2000
                    },
                    {
                        value: 30.97,
                        size: 100000
                    }
                ]
            }
        ]
    };

    fl.renderer = simple;
});
