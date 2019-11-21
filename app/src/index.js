import P5 from 'p5';
import Tesseract from 'tesseract.js';
import { PCode } from './pcode.js';

const s = (p5) => {
  let pcode;

  let editor;
  let runButton;
  let startButton;
  let loopToggle;
  let slider;
  let output;

  let didLoad = false;
  let isPlaying = false;
  let doLoop = false;

  let inputFile;
  let capture;
  let img;

  let canvas;

  p5.setup = () => {
    p5.frameRate(30);

    editor = p5.select('#editor');
    runButton = p5.select('#run');
    output = p5.select('#output');
    startButton = p5.select('#start');
    loopToggle = p5.select('#loop');

    slider = p5.select('#thresh');

    runButton.elt.disabled = true;

    startButton.mousePressed(startButtonClicked);
    loopToggle.mousePressed(loopToggleChanged);

    inputFile = document.getElementById('file');
    inputFile.addEventListener('change', (file) => {
      console.log(file);
    });

    output = document.getElementById('output');
  }

  p5.draw = () => {
    p5.background(255);

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
  }

  let handleFile = (file) => {
    if(file.type === 'image') {
      img = createImg(file.data, '');
      console.log(img);
    }
  }

  let startButtonClicked = () => {
    runButton.elt.disabled = false;
    runButton.mousePressed(runButtonClicked);

    pcode = new PCode();

    didLoad = true;
  };

  let runButtonClicked = () => {
    let code = editor.value();
    output.innerHTML = code;

    if(code) {
      code = pcode.unpack(code);

      while(code.indexOf('<') > -1) {
        code = pcode.unpack(code);
      }

      let lex = code.match(/(\D+)|[+-]?(\d*[.])?\d+/gi);
      pcode.parse(lex);
      isPlaying = true;
    }
  };

  let loopToggleChanged = () => {
    doLoop = !loopToggle.elt.checked;
  }
};

new P5(s);
