
var MapWithSvgMarkers = MapWithSvgMarkers || {};
MapWithSvgMarkers.map = {
  mapConf: {
    markers: [
      {latLng: [341.1460064696189, 226.21229238521158], associatedImages: [0], title: "New York"
        , pictures: [{src: 'sample3.jpg'}]},
      {latLng: [361.4523163785248, 502.3781071463317], associatedImages: [0], title: "Milan"
        , pictures: [{src: 'sample1.jpg'},
          {src: 'sample2.jpg'},
          {src: 'sample3.jpg'}]
      },
      {latLng: [350.89303522589375, 510.500631109894], associatedImages: [0], title: "Florence"
        , pictures: [{src: 'sample1.jpg'}]},
      {latLng: [342.7705112623314, 624.215966599767], associatedImages: [0], title: "Tbilisi"
        , pictures: [{src: 'sample1.jpg'}]},
      {latLng: [268.85554319391395, 655.8938100576602], associatedImages: [0], title: "Dubai"
        , pictures: [{src: 'sample3.jpg'}, {src: 'sample1.jpg'}]},
      {latLng: [259.92076683399534, 846.7731232013755], associatedImages: [0], title: "Guangzhou"
        , pictures: [{src: 'sample1.jpg'}]},
      {latLng: [328.9622205242754, 848.397627994088], associatedImages: [0], title: "Baoding"
        , pictures: [{src: 'sample3.jpg'}]},
      {latLng: [288.3496007064636, 824.030056103401], associatedImages: [0], title: "Chongqing"
        , pictures: [{src: 'sample2.jpg'}]},
      {latLng: [375.2606071165808, 512.1251359026065], associatedImages: [0], title: "Munich"
        , pictures: [{src: 'sample2.jpg'}]},
      {latLng: [362.264568774881, 517.8109026771001], associatedImages: [0], title: "Triest"
        , pictures: [{src: 'sample3.jpg'}]},
      {latLng: [394.3485384309523, 518.8262181725454], associatedImages: [0], title: "Berlin"
        , pictures: [{src: 'sample1.jpg'},
          {src: 'sample1.jpg'}]},
      {latLng: [302.15789144451963, 590.7105552500723], associatedImages: [0], title: "Tel Aviv"
        , pictures: [
          {src: 'sample1.jpg'},
          {src: 'sample2.jpg'},
          {src: 'sample3.jpg'}
        ]}
    ],
    svgMarker: L.divIcon({
      className: 'svg_marker',
      html: '<div></div>',
      iconSize: [50, 50],
      iconAnchor: null
    }),
    svgSelMarker: L.divIcon({
      className: 'svg_selMarker',
      html: '<div></div>',
      iconSize: [50, 50],
      iconAnchor: null
    })
  },
  markers: [],
  selIcon: null,
  getTextTooltip: function (txt) {
    return '<p class="tooltip">' + txt + '</p>';
  },
  loadThumbnailsForLocation: function (marker, markerAttr) {
    if (this.selIcon !== null)
      this.selIcon.setIcon(this.mapConf.svgMarker);
    this.selIcon = marker;
    this.selIcon.setIcon(this.mapConf.svgSelMarker);

    var content = '';
    $.each(markerAttr.pictures, function (index, el) {
      content += '<div>' + '<img id="collaboration-image" src="img/thumbnails/' +
          el.src + '" alt="Thumbnail"   /></div>';
    });
    this.popup.setLatLng(markerAttr.latLng)
        .setContent(content)
        .openOn(this.map);
  },
  /**
   * Load the map/cooperation
   */
  loadMap: function () {
    var _this = this;
    var countForMouseMoviment = 0;
    if (this.map)
      return;
    this.isMapLoaded = true;
    var isMouseOver = false;
    this.popup = L.popup({closeButton: false, maxWidth: 1000, className: 'map-popup', offset: [-90, 50]});
    this.map = L.map('map', {
      maxBounds: (new L.LatLngBounds([0, 0], [526, 1000])),
      touchZoom: false,
      crs: L.CRS.Simple,
      dragging: false,
      boxZoom: false,
      zoomControl: false,
      keyboard: false,
      attributionControl: false
    }).setView([400, 560], 0.3);

    this.map.scrollWheelZoom.disable();

    var imageBounds = [[0, 0], [526, 1000]];
    L.imageOverlay('img/WORLD_MAP.jpg', imageBounds).addTo(this.map);

    this.map.on('click', function (e) {
      _this.map.setZoom(0.3);
      if (_this.selIcon !== null)
        _this.selIcon.setIcon(_this.mapConf.svgMarker);
    });
    $.each(MapWithSvgMarkers.map.mapConf.markers, function (indexMarker, el) {
      MapWithSvgMarkers.map.markers[indexMarker] = L.marker(el.latLng,
          {icon: MapWithSvgMarkers.map.mapConf.svgMarker, title: el.title})
          .on('click', function (e) {
            //zoom in for 4 markers which are closed to each other
            if ((el.title === 'Triest' || el.title === 'Milan' || el.title === 'Florence'
                || el.title === 'Munich')) {

              if (_this.map.getZoom() === 0.3) {
                _this.map.setZoomAround(e.latlng, 1.3);
              } else {
                MapWithSvgMarkers.map.loadThumbnailsForLocation(this, el);
              }
            } else {
              MapWithSvgMarkers.map.loadThumbnailsForLocation(this, el);
            }
          })
          .on('mouseover', function (e) {
            isMouseOver = true;
            countForMouseMoviment = 0;
          })
          .on('mouseout', function (e) {
            isMouseOver = false;
          });
    });

    L.layerGroup(MapWithSvgMarkers.map.markers).addTo(this.map);

    this.map.on('mousemove', function (e) {
      if (!isMouseOver) {
        if (countForMouseMoviment === 14) {
          var center = _this.map.getCenter();
          _this.map.panTo([((center.lat * 1.95) + (e.latlng.lat * 0.05)) / 2,
            ((center.lng * 1.85) + (e.latlng.lng * 0.15)) / 2], {animate: true, duration: 1.9});
        } else {
          countForMouseMoviment++;
        }

      } else {
        countForMouseMoviment = 0;
      }
    });
  }
};



