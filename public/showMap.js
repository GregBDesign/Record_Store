mapboxgl.accessToken = mapBoxToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: recordStore.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

let marker = new mapboxgl.Marker()
    .setLngLat(recordStore.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(
                `<p>${recordStore.title}</p>`
            )
    )
    .addTo(map)