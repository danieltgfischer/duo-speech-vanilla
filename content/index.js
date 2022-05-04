var SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

var isListening = false;
var recognition;

function startRecognition() {
  const textarea = document.querySelector('textarea[lang]');
  const textareaLanguage = textarea.getAttribute('lang');
  if (isListening) {
    recognition?.stop();
  }
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = languages[textareaLanguage];
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.start();

  recognition.onsoundend = () => {
    isListening = false;
    const img = document.getElementById('img-speech-animated');
    if (img !== null) {
      img?.setAttribute('id', 'img-speech');
      recognition?.stop();
    }
  };

  recognition.onresult = event => {
    const result = event.results[0][0]?.transcript;
    textarea.value = result;
    var evt = new Event("change", { "bubbles": true, "cancelable": false });
    textarea.dispatchEvent(evt);
  }
}

function onClickMic() {
  const query = `img-speech${isListening ? '-animated' : ''}`;
  const textarea = document.querySelector('textarea[lang]');
  const img = document.getElementById(query);

  textarea.value = '';
  isListening = !isListening;
  startRecognition();

  if (img) {
    if (isListening)
      img.setAttribute('id', 'img-speech-animated');
    else
      img.setAttribute('id', 'img-speech');
  }
}

const observer = new MutationObserver(() => {
  isListening = false;
  const textarea = document.querySelector('textarea[lang]');
  if (textarea) {
    const parent = textarea.parentElement;
    parent.style.position = "relative";
    const btnContainerFounded = parent.querySelector('div#speech');
    if (!btnContainerFounded) {
      const btnContainer = document.createElement('div');
      const btn = document.createElement('button');
      const img = document.createElement('img');

      img.setAttribute('id', 'img-speech');
      img.setAttribute('src', 'https://d35aaqx5ub95lt.cloudfront.net/images/mic-blue.svg')
      btn.addEventListener('click', onClickMic);
      btn.setAttribute("id", "btn-speech");
      btn.appendChild(img);
      btnContainer.appendChild(btn);
      btnContainer.setAttribute("id", "speech");
      parent.appendChild(btnContainer);
    }
  }
});

const target = document.getElementById('root');
const config = { subtree: true, childList: true, characterData: true, };
observer.observe(target, config);
