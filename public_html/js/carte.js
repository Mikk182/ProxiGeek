var markersObject = [];

var yellowIcon = L.icon({
    iconUrl: './img/icons/yellow60.png',
    iconSize:     [25, 41], // size of the icon
    shadowSize:   [25, 41], // size of the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var map;
$( document ).ready(function() {
    map = L.map('map');

    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 30, attribution: osmAttrib});

    map.setView(new L.LatLng(49.492239, 0.131904),9);
    map.addLayer(osm);
    
    map.locate({setView: true, maxZoom: 12});
    
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    
    map.on('click',function(){
        if($("#detail").is(":visible")){
            $("#detail").toggle(200);
        }
    });
});

function onLocationFound(e) {
    var radius = 5000; //TODO : faire choisir a l'utilisateur le rayon de recherche

    L.marker(e.latlng).addTo(map);

    L.circle(e.latlng, radius).addTo(map);
    
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://127.0.0.1:82/ProxiGeekWS/index.php/afficherreparateur",
        success: function (result) {
            $("#nbPers").html(result.length);
            $.each(result, function( index, item ) {
                repMarker = L.Marker.extend({
                    options: { 
                        id: item.id,
                        icon: yellowIcon,
                        data: item
                    }
                 }); 
                markersObject[index] = new repMarker([item.lat, item.long]).addTo(map).on('click', onClick);
            });
        },
        error: function (err) {
          console.log(err)
          alert(err);
        },
    });
}
function onLocationError(e) {
    alert(e.message);
}

function onClick(e) {
    var t = $( "#detailTemplate" ).tmpl( e.target.options.data );
    $("#detail").html(t);
    if(!$("#detail").is(":visible")){
        $("#detail").toggle(200);
    }
}