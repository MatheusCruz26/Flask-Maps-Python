$(document).ready(function () {
    listar();
});
function listar() {
    $.ajax({
        url: "/listarCache",
        type: "POST",
        dataType: "JSON",
        success: function (data) {
            if (data.length > 0) {
                $(data).each(function (index) {
                    var destino = $(this)[2].split(",")
                    geocodeLatLng(destino[0], destino[1]);
                });
            } else {
                return false
            }
        },
        error: function (jqXHR) {
            return false
        }
    })
}
function setMapOpen(lat, lng, endereco) {
    map = new google.maps.Map(document.getElementById('mapa'), {
        center: { lat: lat, lng: lng },
        zoom: 12
    });
    infoWindow = new google.maps.InfoWindow;
    var pos = {
        lat: lat,
        lng: lng
    };
    infoWindow.setPosition(pos);
    infoWindow.setContent(endereco);
    infoWindow.open(map);
    map.setCenter(pos);
    $("#container_maps").show()
}
$("#container_maps").hide()
var latitude_origem, longitude_origem, latitude_destino, longitude_destino;
var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var latlng = new google.maps.LatLng(-18.8800397, -47.05878999999999);

    var options = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("mapa"), options);
    directionsDisplay.setMap(map);
}
function rota() {
    initialize()
    var enderecoPartida = latitude_origem + "," + longitude_origem;
    var enderecoChegada = latitude_destino + "," + longitude_destino;
    var request = {
        origin: enderecoPartida,
        destination: enderecoChegada,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
        }
    });
    $("#container_maps").show()
}
function autocomplete() {
    setTimeout(function () {
        var autocompleteorigem = new google.maps.places.Autocomplete(document.getElementById("origem"), {});
        google.maps.event.addListener(autocompleteorigem, 'place_changed', function () {
            var origem = autocompleteorigem.getPlace();
            if (origem != undefined) {
                latitude_origem = origem.geometry.location.lat()
                longitude_origem = origem.geometry.location.lng()
            }
        });
        var autocompletedestino = new google.maps.places.Autocomplete(document.getElementById("destino"), {});
        google.maps.event.addListener(autocompletedestino, 'place_changed', function () {
            var destino = autocompletedestino.getPlace();
            if (destino != undefined) {
                latitude_destino = destino.geometry.location.lat()
                longitude_destino = destino.geometry.location.lng()
            }
        });
    }, 3000)
}
autocomplete()
$("#rota").on("click", function () {

    var obj = {
        latitude_origem: latitude_origem,
        longitude_origem: longitude_origem,
        latitude_destino: latitude_destino,
        longitude_destino: longitude_destino
    }

    if (obj.latitude_origem == undefined && obj.longitude_origem == undefined && obj.latitude_destino == undefined && obj.longitude_destino == undefined) {
        var toastHTML = '<span>Inserir endereços válidos.</span>';
        M.toast({ html: toastHTML });
        return false
    }

    $.ajax({
        url: "/api",
        data: JSON.stringify(obj),
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        success: function (data) {
            if (data.status == "Sucesso") {
                rota()
                $("#cards").remove()
                $("#appendCards").append('<div id="cards"></div>')
                listar()
            } else {
                $("#container_maps").hide()
                var toastHTML = '<span>Rota inválida!</span>';
                M.toast({ html: toastHTML });
            }
        },
        error: function (jqXHR) {
            var toastHTML = '<span>Erro na busca!</span>';
            M.toast({ html: toastHTML });
        }
    })

});
var html = ""
function geocodeLatLng(lat, lng) {
    var geocoder = new google.maps.Geocoder;
    var latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
    geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === 'OK') {
            html = `<div class="col s4"><div class="card horizontal" style="height: 175px !important;"><div class="card-stacked"><div class="card-content"><p><b>Destino: </b>${results[0].formatted_address}</p></div><div class="card-action"><a class="visualizar_mapa" data-latitude="${lat}" data-longitude="${lng}">Visualizar</a><span style="display:none;">${results[0].formatted_address}</span></div></div></div></div>`;
            $("#cards").append(html);
            return true
        } else {
            return false
        }
    });
}
$(document).on("click", ".visualizar_mapa", function () {
    var latitude = $(this).data("latitude")
    var longitude = $(this).data("longitude")
    var endereco = $(this).next().text()
    setMapOpen(latitude, longitude, endereco)

})