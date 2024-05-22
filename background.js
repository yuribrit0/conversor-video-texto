chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === "transcribeAudio") {
      transcribeAudio(request.audio);
    }
  });
  
  function transcribeAudio(base64Audio) {
    fetch('https://speech.googleapis.com/v1/speech:recognize?key=YOUR_API_KEY', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio: {
          content: base64Audio
        },
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US'
        }
      })
    }).then(response => response.json())
      .then(data => {
        if (data.results && data.results[0] && data.results[0].alternatives[0]) {
          let transcript = data.results[0].alternatives[0].transcript;
          chrome.storage.local.set({ transcript: transcript });
        }
      }).catch(error => {
        console.error('Error transcribing audio:', error);
      });
  }
  