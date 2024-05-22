let isRecording = false;
let mediaRecorder;
let recordedChunks = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "startRecording") {
    startRecording();
  } else if (request.command === "stopRecording") {
    stopRecording();
  }
});

function startRecording() {
  if (isRecording) return;
  isRecording = true;

  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
    mediaRecorder.onstop = () => {
      let blob = new Blob(recordedChunks, { type: "audio/wav" });
      recordedChunks = [];
      sendAudioToServer(blob);
    };
    mediaRecorder.start();
  });
}

function stopRecording() {
  if (!isRecording) return;
  isRecording = false;
  mediaRecorder.stop();
}

function sendAudioToServer(audioBlob) {
  let reader = new FileReader();
  reader.onload = function() {
    let base64data = reader.result.split(',')[1];
    chrome.runtime.sendMessage({ command: "transcribeAudio", audio: base64data });
  };
  reader.readAsDataURL(audioBlob);
}
