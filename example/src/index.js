import P5 from 'p5';
import Tesseract from 'tesseract.js';
import { PCode } from '../../lib/index.js';

if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

const s = (p5) => {
  let pcode;

  let editor;
  let runButton;
  let readButton;
  let loopToggle;
  let slider;
  let log;

  let didLoad = false;
  let isPlaying = false;
  let doLoop = false;
  let selectCamera;

  let capture;
  let img;
  let msg;

  let canvas;

  p5.setup = () => {
    canvas = p5.createCanvas(p5.windowWidth, 160);
    p5.frameRate(30);

    capture = p5.createCapture({
      video: {
        facingMode: {
          ideal: "environment"
        }
      },
      audio: false
    });
    capture.hide();

    editor = p5.select('#editor');
    runButton = p5.select('#run');
    readButton = p5.select('#read');
    loopToggle = p5.select('#loop');

    selectCamera = p5.selectAll('input', '#camera');
    selectCamera.forEach((el) => {
      el.mousePressed(cameraChanged);
    });

    slider = p5.select('#thresh');

    runButton.mousePressed(runButtonClicked);
    readButton.mousePressed(readButtonClicked);
    loopToggle.mousePressed(loopToggleChanged);

    msg = document.getElementById('msg');
    log = document.getElementById('log');
  }

  p5.draw = () => {
    p5.background(225);

    if(didLoad) {
      if(isPlaying) {
        if(pcode.hasNext()) {
          let node = pcode.tokens[pcode.pointer];
          pcode.execute(node);
          pcode.next();
        } else {
          isPlaying = false;
        }
      } else {
        if(doLoop) {
          pcode.reset();
          isPlaying = true;
        } else {
          pcode.stop();
        }
      }
    }

    p5.image(capture, 0, 0);
    p5.filter(p5.THRESHOLD, slider.value());
  }

  let cameraChanged = () => {
    // ?
    const s = selectCamera.filter((el) => !el.elt.checked);

    capture.remove();
    capture = p5.createCapture({
      video: {
        facingMode: {
          ideal: s[0].elt.value
        }
      },
      audio: false
    });
    capture.hide();
  }

  let readButtonClicked = () => {
    let url = canvas.elt.toDataURL('image/png');
    msg.style.visibility = "visible";

    Tesseract.recognize(url, 'eng')
      .then(({data: { text }}) => {
        msg.style.visibility = "hidden";
        editor.value(text);
      });
  }

  let runButtonClicked = () => {
    if(!didLoad) {
      pcode = new PCode();
      didLoad = true;
    }

    let code = editor.value();

    if(code) {
      let text = document.createTextNode(code);
      let p = document.createElement('p');
      p.appendChild(text);
      p.addEventListener('click', event => {
        editor.value(event.target.textContent);
      });
      log.prepend(p);
      pcode.run(code);
      isPlaying = true;
    }
  };

  let loopToggleChanged = () => {
    doLoop = !loopToggle.elt.checked;
  }
};

new P5(s);
