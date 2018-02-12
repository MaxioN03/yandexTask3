var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;



if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function () {
    $('.fa-microphone').css('color', 'red');
    recognizing = true;
  };

  recognition.onerror = function (event) {
    if (event.error == 'no-speech') {
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function () {
    recognizing = false;
    if (ignore_onend) {
      return;
    }

    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
    $('.fa-microphone').css('color', 'black');
    $('#enterCityButton').trigger('click');
  };

  recognition.onresult = function (event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      final_transcript = event.results[i][0].transcript;
    }

    final_transcript = capitalize(final_transcript);

    $("#cityInput").val(linebreak(final_transcript));

  };
}

function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;

function capitalize(s) {
  return s.replace(first_char, function (m) {
    return m.toUpperCase();
  });
}


function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = 'ru-RU';
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
}
