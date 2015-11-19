//http://10.2.0.31/proxigeek/index.php/afficher
//http://10.2.0.31/proxigeek/index.php/afficherreparateur
/*var data = [
    {id:1,prenom:"Mickaël",nom:"CHEMIN",eval:2,imgUrl:"./img/user_001.jpg",lat:49.511923, long:0.074566},
    {id:2,prenom:"Mohamed",nom:"",eval:3,imgUrl:"./img/user_001.jpg",lat:49.501959, long:0.109232},
    {id:3,prenom:"Florian",nom:"",eval:4,imgUrl:"./img/user_001.jpg",lat:49.493911, long:0.094289},
    {id:4,prenom:"Sith",nom:"",eval:1,imgUrl:"./img/user_001.jpg",lat:49.492650, long:0.124823},
    {id:5,prenom:"Adeline",nom:"",eval:5,imgUrl:"./img/user_001.jpg",lat:49.491981, long:0.131561},
];*/
/*
var data = [];
data.push(reparateur(1,"Mickaël","CHEMIN",2,"./img/user_001.jpg",49.511923, 0.074566));
data.push(reparateur(2,"Mohamed","",3,"./img/user_001.jpg",49.501959, 0.109232));
data.push(reparateur(3,"Florian","",4,"./img/user_001.jpg",49.493911, 0.094289));
data.push(reparateur(4,"Sith","",1,"./img/user_001.jpg",49.492650, 0.124823));
data.push(reparateur(5,"Adeline","",5,"./img/user_001.jpg",49.491981, 0.131561));

function reparateur(id,prenom,nom,eval,imgUrl,lat,long)
{
    this.id=id;
    this.prenom=prenom;
    this.nom=nom;
    this.eval=eval;
    this.imgUrl=imgUrl;
    this.lat=lat;
    this.long=long;
    return this;
}*/

var markersObject = [];
var dataArray = [];

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

    // start the map in South-East England
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
    //var radius = e.accuracy / 2;
    var radius = 5000;

    L.marker(e.latlng).addTo(map);
        //.bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
    
    /*$.get("http://10.2.0.31/proxigeek/index.php/afficherreparateur", function( data ) {
        $.each(data, function( index, item ) {
            markersObject[item.id] = L.marker([item.lat, item.long], {icon: yellowIcon}).addTo(map).on('click', onClick);
            markersObject[item.id]._icon.id = item.id;
        });
    });*/
    
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://127.0.0.1:82/ProxiGeekWS/index.php/afficherreparateur",
        success: function (data) {
            dataArray = data;
            $("#nbPers").html(data.length);
            $.each(data, function( index, item ) {
                markersObject[index] = L.marker([item.lat, item.long], {icon: yellowIcon}).addTo(map).on('click', onClick);
                markersObject[index]._icon.id = index;
            });
        },
        error: function (err) {
          console.log(err)
          alert(err);
        },
    });
    
    /*L.marker([49.511923, 0.074566], {icon: yellowIcon}).addTo(map).on('click', onClick);
    L.marker([49.501959, 0.109232], {icon: yellowIcon}).addTo(map).on('click', onClick);
    L.marker([49.493911, 0.094289], {icon: yellowIcon}).addTo(map).on('click', onClick);
    L.marker([49.492650, 0.124823], {icon: yellowIcon}).addTo(map).on('click', onClick);
    L.marker([49.491981, 0.131561], {icon: yellowIcon}).addTo(map).on('click', onClick);*/
}
function onLocationError(e) {
    alert(e.message);
}

function onClick(e) {
    //var el = $(e.srcElement || e.target);
    var idString = e.target._icon.attributes["id"].nodeValue;
    var id = parseInt(idString);
    var item = dataArray[id];
    var t = $( "#detailTemplate" ).tmpl( item );
    $("#detail").html(t);
    if(!$("#detail").is(":visible")){
        $("#detail").toggle(200);
    }
}