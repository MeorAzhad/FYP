// popup.js

let model;
let classes = ["FAKE", "REAL"];

async function loadModel() {
  model = await tf.loadLayersModel('./model.json');
}

function preprocessImage(image) {
  // Add any preprocessing steps here
  return image.toFloat().div(tf.scalar(255));
}

function classifyImage(img) {
  const preprocessed = preprocessImage(tf.browser.fromPixels(img).expandDims());
  const prediction = model.predict(preprocessed);
  const classIdx = prediction.argMax().dataSync()[0];
  const className = classes[classIdx];
  return className;
}

function updateResult(className) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `Predicted Class: ${className}`;
}

function classifyImageManually() {
  const fileInput = document.getElementById('fileInput');
  const resultDiv = document.getElementById('result');

  const file = fileInput.files[0];
  if (file) {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
      img.onload = function () {
        const className = classifyImage(img);
        updateResult(className);
      };
    };
    reader.readAsDataURL(file);
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  await loadModel();
  classifyImageManually();
});