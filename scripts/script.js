                                  //---POPUP---//
var container2 = document.getElementById('popup2');
var content2 = document.getElementById('popup-content2');
var closer2 = document.getElementById('popup-closer2');
var overlay2 = new ol.Overlay({
    element: container2,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
closer2.onclick = function() {
    overlay2.setPosition(undefined);
    closer2.blur();
    return false;
};

                                        //---PERMALINK---//
// default zoom, center and rotation
var zoom = 8;
var center = ol.proj.transform([22.166667, 49.935], 'EPSG:4326', 'EPSG:3857');
var rotation = 0;

if (window.location.hash !== '') {
    // try to restore center, zoom-level and rotation from the URL
    var hash = window.location.hash.replace('#map=', '');
    var parts = hash.split('/');
    if (parts.length === 4) {
        zoom = parseInt(parts[0], 10);
        center = [
            parseFloat(parts[1]),
            parseFloat(parts[2])
        ];
        rotation = parseFloat(parts[3]);
    }
}



var defaultStyle = {									// DRAG AND DROP //
        'Point': new ol.style.Style({
          image: new ol.style.Circle({
            fill: new ol.style.Fill({
              color: 'rgba(255,255,0,0.5)'
            }),
            radius: 5,
            stroke: new ol.style.Stroke({
              color: '#ff0',
              width: 1
            })
          })
        }),
        'LineString': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#f00',
            width: 3
          })
        }),
        'Polygon': new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(0,255,255,0.5)'
          }),
          stroke: new ol.style.Stroke({
            color: '#0ff',
            width: 1
          })
        }),
        'MultiPoint': new ol.style.Style({
          image: new ol.style.Circle({
            fill: new ol.style.Fill({
              color: 'rgba(255,0,255,0.5)'
            }),
            radius: 5,
            stroke: new ol.style.Stroke({
              color: '#f0f',
              width: 1
            })
          })
        }),
        'MultiLineString': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#0f0',
            width: 3
          })
        }),
        'MultiPolygon': new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(0,0,255,0.5)'
          }),
          stroke: new ol.style.Stroke({
            color: '#00f',
            width: 1
          })
        })
      };

      var styleFunction = function(feature, resolution) {
        var featureStyleFunction = feature.getStyleFunction();
        if (featureStyleFunction) {
          return featureStyleFunction.call(feature, resolution);
        } else {
          return defaultStyle[feature.getGeometry().getType()];
        }
      };

      var dragAndDropInteraction = new ol.interaction.DragAndDrop({
        formatConstructors: [
          ol.format.GPX,
          ol.format.GeoJSON,
          ol.format.IGC,
          ol.format.KML,
          ol.format.TopoJSON
        ]
      });


var scaleLineControl = new ol.control.ScaleLine();         // SCALA //

var zoomslider = new ol.control.ZoomSlider();




var template = 'N: {y}°,  E: {x}°';                        // MOUSEPOSITION //


var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: function(coord) {return ol.coordinate.format(coord, template, 4);},
    projection: 'EPSG:4326',
    undefinedHTML: '&nbsp;'
});



var FullScreen = new ol.control.FullScreen();           // FULL SCREEN //

var OverviewMap = new ol.control.OverviewMap();         // OVERVIEW //


var muzea = new ol.source.Vector({                // DATA //
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/muzea.geojson'
});

var muzeaCluster = new ol.source.Cluster({
    distance: 50,
    source: muzea
});

var muzeaLayer = new ol.layer.Vector({
    source: muzeaCluster,
    title: 'Muzea',
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var muzeaStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/muzeum.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return muzeaStyle;
    },
});


var zamki = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/zamki.geojson'
});

var zamkiCluster = new ol.source.Cluster({
    distance: 50,
    source: zamki
});

var zamkiLayer = new ol.layer.Vector({
    source: zamkiCluster,
    title: 'Zamki',
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var zamkiStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/zamek.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return zamkiStyle;
    },
});


var kultura = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/kultura.geojson'
});

var kulturaCluster = new ol.source.Cluster({
    distance: 50,
    source: kultura
});

var kulturaLayer = new ol.layer.Vector({
    source: kulturaCluster,
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var kulturaStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/kultura.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return kulturaStyle;
    },
    title: 'Kultura'
});


var parki = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/parki.geojson'
});

var parkiCluster = new ol.source.Cluster({
    distance: 50,
    source: parki
});

var parkiLayer = new ol.layer.Vector({
    source: parkiCluster,
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var parkiStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/park.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return parkiStyle;
    },
    title: 'Parki'
});

var twierdza = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/twierdza.geojson'
});

var twierdzaCluster = new ol.source.Cluster({
    distance: 50,
    source: twierdza
});

var twierdzaLayer = new ol.layer.Vector({
    source: twierdzaCluster,
    title: 'Twierdza Przemyśl',
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var twierdzaStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/twierdza.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return twierdzaStyle;
    }
});

var schrony = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/schrony.geojson'
});

var schronyCluster = new ol.source.Cluster({
    distance: 50,
    source: schrony
});

var schronyLayer = new ol.layer.Vector({
    source: schronyCluster,
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var schronyStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/bunkier.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return schronyStyle;
    },
    title: 'Schrony'
});

var koscioly = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/koscioly.geojson'
});

var kosciolyCluster = new ol.source.Cluster({
    distance: 50,
    source: koscioly
});

var kosciolyLayer = new ol.layer.Vector({
    source: kosciolyCluster,
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var kosciolyStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/kosciol.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return kosciolyStyle;
    },
    title: 'Obiekty sakralne'
});

var cmentarze = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/cmentarze.geojson'
});

var cmentarzeCluster = new ol.source.Cluster({
    distance: 50,
    source: cmentarze
});

var cmentarzeLayer = new ol.layer.Vector({
    source: cmentarzeCluster,
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var cmentarzeStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/cmentarz.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return cmentarzeStyle;
    },
    title: 'Cmentarze'
});

var natura = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/natura.geojson'
});

var naturaCluster = new ol.source.Cluster({
    distance: 50,
    source: natura
});

var naturaLayer = new ol.layer.Vector({
    source: naturaCluster,
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var naturaStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/natura.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return naturaStyle;
    },
    title: 'Natura'
});

var uzdrowiska = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/uzdrowiska.geojson'
});

var uzdrowiskaCluster = new ol.source.Cluster({
    distance: 50,
    source: uzdrowiska
});

var uzdrowiskaLayer = new ol.layer.Vector({
    source: uzdrowiskaCluster,
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var uzdrowiskaStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/uzdrowiska.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return uzdrowiskaStyle;
    },
    title: 'Uzdrowiska'
});

var parki_linowe = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/parki_linowe.geojson'
});

var parki_linoweCluster = new ol.source.Cluster({
    distance: 50,
    source: parki_linowe
});

var parki_linoweLayer = new ol.layer.Vector({
    source: parki_linoweCluster,
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var linaStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/lina.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return linaStyle;
    },
    title: 'Parki linowe'
});

var pokoje_ucieczki = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/pokoje_ucieczki.geojson'
});

var pokoje_ucieczkiCluster = new ol.source.Cluster({
    distance: 50,
    source: pokoje_ucieczki
});

var pokoje_ucieczkiLayer = new ol.layer.Vector({
    source: pokoje_ucieczkiCluster,
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var escapeStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/escape.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return escapeStyle;
    },
    title: 'Escape Roomy'
});

var inne = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/inne.geojson'
});

var inneCluster = new ol.source.Cluster({
    distance: 50,
    source: inne
});

var inneLayer = new ol.layer.Vector({
    source: inneCluster,
    style: function(feature, resolution) {
          var size = feature.get('features').length;
          var inneStyle = [
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data/icon/inne.png',
                    scale: 0.08
                }),
                text: new ol.style.Text({
                    text: ((size > 1) ? size.toString() : ''),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                    offsetY: 12,
                    font: 'bold 11px sans-serif'
                })
            })
        ];
        return inneStyle;
    },
    title: 'Inne'
});

var narodowe = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/parki_narodowe.geojson'
})

var narodoweLayer = new ol.layer.Vector({
    source: narodowe,
    style: function(feature, resolution){
      var narodoweStyle = [
        new ol.style.Style({
              stroke: new ol.style.Stroke({
              color: '#D63E00',
              width: 1
          }),
              fill: new ol.style.Fill({
              color: 'rgba(214,62,0,0.3)'
          })
        })
      ];
      return narodoweStyle;    
    },
    title: 'Parki Narodowe'
});

var krajobrazowe = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/parki_krajobrazowe.geojson'
})

var krajobrazoweLayer = new ol.layer.Vector({
    source: krajobrazowe,
    style: function(feature, resolution){
      var krajobrazoweStyle = [
        new ol.style.Style({
              stroke: new ol.style.Stroke({
              color: '#FFAC00',
              width: 1
          }),
              fill: new ol.style.Fill({
              color: 'rgba(255,172,0,0.3)'
          })
        })
      ];
      return krajobrazoweStyle;    
    },
    title: 'Parki Krajobrazowe'
});

var rezerwaty = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:4326',
    url: 'data/geo/rezerwaty.geojson'
})

var rezerwatyLayer = new ol.layer.Vector({
    source: rezerwaty,
    style: function(feature, resolution){
      var rezerwatyStyle = [
        new ol.style.Style({
              stroke: new ol.style.Stroke({
              color: '#5A3189',
              width: 1
          }),
              fill: new ol.style.Fill({
              color: 'rgba(90,49,137,0.3)'
          })
        })
      ];
      return rezerwatyStyle;    
    },
    title: 'Rezerwaty'
});


var osm = new ol.layer.Tile({
    source: new ol.source.OSM(),
    title: 'OpenStreetMap',
    type: 'base'
});


var stamenWater = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer: 'watercolor'
    }),
    title: 'Watercolor',
    type: 'base'
});

var stamenTerrain = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer: 'terrain'
    }),
    title: 'Terrain',
    type: 'base'
});

var stamenToner = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer: 'toner'
    }),
    title: 'Toner',
    type: 'base'
});


var layerPodkarpacie = new ol.layer.Group({
    layers: [
        narodoweLayer,
        krajobrazoweLayer,
        rezerwatyLayer,
        inneLayer,
        pokoje_ucieczkiLayer,
        parki_linoweLayer,
        uzdrowiskaLayer,
        naturaLayer,
        cmentarzeLayer,
        kosciolyLayer,
        schronyLayer,
        twierdzaLayer,
        parkiLayer,
        kulturaLayer,
        zamkiLayer,
        muzeaLayer
        ],
    title: 'Widoczność warstw:'
});

var layerBase = new ol.layer.Group({
    layers: [stamenTerrain, stamenWater, stamenToner, osm],
    title: 'Mapy bazowe:'
});


var map = new ol.Map({                                //----MAP----//
    controls: ol.control.defaults().extend([
        scaleLineControl,
        FullScreen,
        mousePositionControl,
        OverviewMap,
        zoomslider
    ]),
    target: 'map',
    overlays: [overlay2],
    layers: [
        layerBase,
        layerPodkarpacie

    ],
    view: new ol.View({
        center: center,
        zoom: zoom,
        rotation: rotation
    }),
    interactions: ol.interaction.defaults().extend([dragAndDropInteraction]),
});




                                                //---PERMALINK---//
var shouldUpdate = true;
var view = map.getView();
var updatePermalink = function() {
    if (!shouldUpdate) {
        shouldUpdate = true;
        return;
    }

    var center = view.getCenter();
    var hash = '#map=' +
        view.getZoom() + '/' +
        Math.round(center[0] * 100) / 100 + '/' +
        Math.round(center[1] * 100) / 100 + '/' +
        view.getRotation();
    var state = {
        zoom: view.getZoom(),
        center: view.getCenter(),
        rotation: view.getRotation()
    };
    window.history.pushState(state, 'map', hash);
};

map.on('moveend', updatePermalink);

window.addEventListener('popstate', function(event) {
    if (event.state === null) {
        return;
    }
    map.getView().setCenter(event.state.center);
    map.getView().setZoom(event.state.zoom);
    map.getView().setRotation(event.state.rotation);
    shouldUpdate = false;
});





var layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: 'Legenda' 
});
map.addControl(layerSwitcher);



(function(win, doc){                                   //----GEOCODING-----//
  'use strict';

    var geocoder = new Geocoder('nominatim', {
        provider: 'osm',
        key: '__some_key__',
        lang: 'pl',
        placeholder: 'Wyszukaj adres...',
        limit: 5,
        keepOpen: true,
    });
    map.addControl(geocoder);

    geocoder.on('addresschosen', function(evt){
        var feature = evt.feature,
            coord = evt.coordinate,
            address = evt.address;

        content.innerHTML = '<p>'+ evt.address.formatted +'</p>';
        overlay.setPosition(coord);
    });


    var container = doc.getElementById('popup'),
      content = doc.getElementById('popup-content'),
      closer = doc.getElementById('popup-closer'),
      overlay = new ol.Overlay({
        element: container,
        offset: [0, -40]
      });
    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
   map.addOverlay(overlay);
})(window, document);



                                                //----------EXPORT-----------//
var exportPNGElement = document.getElementById('export-png');

if ('download' in exportPNGElement) {
    exportPNGElement.addEventListener('click', function(e) {
        map.once('postcompose', function(event) {
            var canvas = event.context.canvas;
            exportPNGElement.href = canvas.toDataURL('image/png');
        });
        map.renderSync();
    }, false);
} else {
    var info = document.getElementById('no-download');

    info.style.display = '';
}

                                                //------GEOLOCATION-----//
var geolocation = new ol.Geolocation({
    projection: view.getProjection()
});

function el(id) {
    return document.getElementById(id);
}

el('track').addEventListener('click', function() {
    geolocation.setTracking(this.click);
});



var accuracyFeature = new ol.Feature();
geolocation.on('change:accuracyGeometry', function() {
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

var positionFeature = new ol.Feature();
positionFeature.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: '#3399CC'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2
        })
    })
}));

geolocation.on('change:position', function() {
    var pozycja = geolocation.getPosition();
    positionFeature.setGeometry(pozycja ?
        new ol.geom.Point(pozycja) : null);
    map.getView().setZoom(17);
    map.getView().setCenter(pozycja);
});

new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
        features: [accuracyFeature, positionFeature]
    })
});



                                                    //---DRAG AND DROP--//
dragAndDropInteraction.on('addfeatures', function(event) {
        var vectorSource = new ol.source.Vector({
          features: event.features
        });
        map.addLayer(new ol.layer.Vector({
          source: vectorSource,
          style: styleFunction
        }));
        map.getView().fit(
            vectorSource.getExtent(), (map.getSize()));
      });



                                                    //---POPUP---//


map.on('singleclick', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
            return feature;
        });

    if (feature) {
        var coord = map.getCoordinateFromPixel(evt.pixel);
        if (typeof feature.get('features') === 'undefined') {
            content2.innerHTML = '<span>' + feature.get('name') + '</span>'
        } else {
            var cfeatures = feature.get('features');
            if (cfeatures.length > 1) {
                content2.innerHTML = '<p>Wszystkie obiekty:</p>';
                for (var i = 0; i < cfeatures.length; i++) {
                    $(content2).append('<ul><li style="white-space: nowrap;">' + cfeatures[i].get('name') + '</li></ul>');
                }
            }
            else if (cfeatures.length == 1) {
                content2.innerHTML = '<span style="white-space: nowrap;">' + cfeatures[0].get('name') + '<br>-------<br>ul.'
                + cfeatures[0].get('address') + '<br>Telefon: '+ cfeatures[0].get('phoneNumbe')+'</span>';
            }
        }
        overlay2.setPosition(coord);

    } else {
        overlay2.setPosition(undefined);
    }
});
    /*    if (isCluster(feature)){
            var features = feature.get('features');
            for(var i = 0; i < features.length; i++) {
                // here you'll have access to your normal attributes:
                content2.innerHTML = '<span>'+ features[i].get('Name') +'</span>'
            }
        } else {
            content2.innerHTML = '<span>'+ feature.get('Name') +'</span>'
        }
    } else {
        content2.innerHTML = '<p>Kliknąłeś tutaj:</p><code>' + hdms2 + '</code>';
    }
     overlay2.setPosition(coordinate2);
});  */


// change mouse cursor when over marker
map.on('pointermove', function(e) {

    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

var modal = document.getElementById('myModal');
var modal2= document.getElementById('myModal2')
var btn = document.getElementById("myBtn");
var btn2 = document.getElementById("kontakt")
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close2")[0];

btn.onclick = function() {
    modal.style.display = "block";
}
btn2.onclick = function() {
    modal2.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}
span2.onclick = function() {
    modal2.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
window.onclick = function(event) {
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}