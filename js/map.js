var myMap;


ymaps.ready(init);

//Инициализация карты
function init() {

  myMap = new ymaps.Map('map', {
    center: [53.902496, 27.561481], // Минск
    zoom: 7,
    controls: []
    //controls: ['zoomControl','typeSelector']

  }, {
    searchControlProvider: 'yandex#search'
  });

  //addClusterer(myGeoObjects);

}