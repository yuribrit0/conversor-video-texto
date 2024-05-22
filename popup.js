document.getElementById('start').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { command: "startRecording" });
    });
  });
  
  document.getElementById('stop').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { command: "stopRecording" });
    });
  });
  
  chrome.storage.local.get('transcript', data => {
    if (data.transcript) {
      document.getElementById('transcript').innerText = data.transcript;
    }
  });
  
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.transcript) {
      document.getElementById('transcript').innerText = changes.transcript.newValue;
    }
  });
  