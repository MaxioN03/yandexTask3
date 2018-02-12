var cityList = [];

$(document).ready(function () {
  $.getJSON("../res/citys.json", function (data) {
    cityList = (data);
  });
});


var addedCitys = [];
var lastCity = "";
var lastMove = "";


function changeInfo(info, color) {
  var element = $('#infoPanel');
  $(element).html(info);
  $(element).css({"color": color, "transition": "color 0.5s ease"});

  setTimeout(function () {
    $(element).css("color", "#000");
  }, 1500);
}

function capitalize(word) {
  word.toLowerCase();
  word[0].toUpperCase();
  return word
}


//var makeMoveNow = "user";


$('#cityInput').bind('keypress', function (e) {
  if (e.keyCode == 13) {
    $('#enterCityButton').trigger('click');
    return false;    //<---- Add this line
  }
});

$('#enterCityButton').click(function () {

  var isManMakeMove = false;

  if (isCanContinue(cityList, lastCity)) {
    isManMakeMove = manMakeMove($('#cityInput').val());
  }
  if (isCanContinue(cityList, lastCity) && isManMakeMove) {
    progMakeMove();
  }
  if (!isCanContinue(cityList, lastCity)) {
    endOfGame();
  }


});

function manMakeMove(cityInput) {

  if (checkCityInList(cityInput)) {

    let lastLetter = getLastLetter(lastCity);

    if (lastLetter == "") {
      addCity(cityInput, true);
      return true;
    }
    else if (lastLetter.toLowerCase() == cityInput.slice(0, 1).toLowerCase()) {
      addCity(cityInput, true);
      return true;
    }
    else {
      changeInfo("Первая и последняя буквы в названиях не совпадают!", "#e40808");
      return false;
    }

  }
  else if (checkCityInEnteredList(cityInput)) {
    changeInfo("Город уже введён!", "#e40808");
    return false;
  }
  else {
    changeInfo("Город не найден!", "#e40808");
    return false;
  }
}

function addCity(cityName, isMan) {

  if (isMan) {
    changeInfo("Игрок ввёл город " + capitalize(cityName), "#21394E");
    lastMove = "player";
  }
  else {
    lastMove = "computer";
  }

  var date = new Date();
  date = ((+date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (+date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ":" + (+date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()));
  var player = isMan == true ? 'Игрок' : 'Компьютер'

  $('#enteredCitysList .enteredCitysTable tr:first').after('<tr><td>' + cityName + '</td><td>' + date + '</td><td>' + player + '</td></tr>');
  lastCity = cityName;

  var myGeocoder = ymaps.geocode(cityName);
  myGeocoder.then(
      function (res) {
        //console.log('Координаты объекта: ' + res.geoObjects.get(0).geometry.getCoordinates());
        addMarkerToMap(res.geoObjects.get(0).geometry.getCoordinates(), cityName);
        myMap.panTo(res.geoObjects.get(0).geometry.getCoordinates(), 4, {
          checkZoomRange: true
        });
      },
      function (err) {
        alert('Ошибка');
      }
  );


  var index = cityList.indexOf(cityName);
  if (index > -1) {
    cityList.splice(index, 1);
  }

  addedCitys.push(cityName);
  $('#cityInput').val("");
  $('#cityInput').attr("placeholder", getLastLetter(cityName).toUpperCase() + '...');

}

function checkCityInList(cityName) {
  var isInclude = false;


  cityList.forEach(function (city, i, cityList) {
    if (city.toLowerCase() == cityName.toLowerCase()) {
      isInclude = true;
    }
  })

  return isInclude;

}

function checkCityInEnteredList(cityName) {
  var isInclude = false;

  addedCitys.forEach(function (city, i, cityList) {
    if (city.toLowerCase() == cityName.toLowerCase()) {
      isInclude = true;
    }
  })
  return isInclude;
}

function getLastLetter(word) {
  if (word == "") {
    return "";
  }
  else {
    for (var i = word.length - 1; i >= 0; i--) {
      if (word[i].toLowerCase() != "ь" && word[i].toLowerCase() != "ъ" && word[i].toLowerCase() != "ы" && word[i].toLowerCase() != "й") {
        return word[i];
      }
    }
  }

}

//Добавить маркер на карту
function addMarkerToMap(coord, cityName) {

  iconColor = "#21394E";

  ymaps.ready(function () {

    //Создаём маркер
    myPlacemark = new ymaps.Placemark(coord, {
      hintContent: cityName,

    }, {
      preset: 'islands#circleDotIcon',
      iconColor: iconColor
    });

    //myGeoObjects.push(myPlacemark);
    myMap.geoObjects.add(myPlacemark);

  });
}

function progMakeMove() {

  let lastLetter = getLastLetter(lastCity);

  let rightCities = [];

  cityList.some(function (city) {
    if (lastLetter.toLowerCase() == city.slice(0, 1).toLowerCase()) {
      rightCities.push(city);
    }
  });

  addCity(chooseRandomCity(rightCities));

}

function isCanContinue(cityList, lastCity) {
  if (lastCity == "") {
    return true;
  }
  else {
    isContinue = false;

    let lastLetter = getLastLetter(lastCity);

    cityList.some(function (city) {
      if (lastLetter.toLowerCase() == city.slice(0, 1).toLowerCase()) {
        isContinue = true;
      }
    });

    return isContinue;
  }
}


function endOfGame() {
  changeInfo("Конец игры. Победитель: " + (lastMove == "player" ? "Игрок" : "Компьютер") + ". Результаты в таблице", "#21394E");
  $('#enterField').hide();
  $('#enteredCitysList').css('height', '90%');
}

//Для выбора компьютером рандомного города из ПРАВИЛЬНЫХ
function chooseRandomCity(citysArr) {
  var rand = 0 + Math.random() * (citysArr.length + 1);
  rand = Math.floor(rand);

  return citysArr[rand];
}

$('#loseGame').click(function () {
  endOfGame();
});

