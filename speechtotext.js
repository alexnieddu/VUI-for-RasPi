// Speech to Text using Web Speech API
// Best results using Chrome browser
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


var diagnosticPara = document.querySelector('.output');
var testBtn = document.querySelector('.testBtn');

function testSpeech() {
  testBtn.disabled = true;
  $("button").addClass("testBtn_active");
  testBtn.textContent = "...";
  diagnosticPara.textContent = 'detecting...';

  var recognition = new SpeechRecognition();
  recognition.lang = 'de-DE';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {

  	speechResult = event.results[0][0].transcript;
	var str = {befehl: speechResult};
	$.ajax({
		type: 'GET',
		data: str,
		dataType: "text",
		url: 'https://192.168.1.71:8000/',
		success: function(dat) {
				console.log('success');
				console.log(dat);
        diagnosticPara.textContent = speechResult;
			},
		error: function(err) {
			console.log("Some error in fetching the notifications:" + err);
		}
	});
   }

    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    // var speechResult = event.results[0][0].transcript;
//     diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
//     if(speechResult === phrases[0]) {
//       console.log('I heard the correct phrase!');
//     } else {
//       console.log('That didn\'t sound right.');
//     }
//
//     console.log('Confidence: ' + event.results[0][0].confidence);
//   }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    $("button").removeClass("testBtn_active");
    testBtn.textContent = "START";
    // diagnosticPara.textContent = 'Tap to speak';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    diagnosticPara.textContent = 'Tap to speak';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }

  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }

  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }

  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }

  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }

  recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }

  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}

testBtn.addEventListener('click', testSpeech);
