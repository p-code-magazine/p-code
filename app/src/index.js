import P5 from 'p5';
import Tone from 'tone';
import Tesseract from 'tesseract.js';

const s = (p5) => {
  let sine, saw, tri, square, noise;
  let freq = 440;
  let pointer = 0;
  let runButton;
  let startButton;
  let loopToggle;
  let slider;
  let output;
  let tokens = [];

  let didLoad = false;
  let isPlaying = false;
  let prevChar = '';
  let doLoop = false;

  let capture;
  const VIDEO_HEIGHT = 200;

  let canvas;

  p5.setup = () => {
    canvas = p5.createCanvas(p5.windowWidth, VIDEO_HEIGHT);
    p5.frameRate(30);

    capture = p5.createCapture({
      video: {
        facingMode: {
          exact: "environment"
        }
      },
      audio: false
    });
    capture.size(p5.windowWidth, VIDEO_HEIGHT);
    capture.hide();

    runButton = p5.select('#run');
    output = p5.select('#output');
    startButton = p5.select('#start');
    loopToggle = p5.select('#loop');
    slider = p5.select('#thresh');

    runButton.elt.disabled = true;

    startButton.mousePressed(startButtonClicked);
    loopToggle.mousePressed(loopToggleChanged);

    output = document.getElementById('output');
  }

  p5.draw = () => {
    p5.background(255);
    p5.image(capture, 0, 0, p5.windowWidth, p5.windowHeight);
    p5.filter(p5.THRESHOLD, slider.value());

    if(didLoad) {
      if(isPlaying) {
        if(pointer < tokens.length) {
          let node = tokens[pointer];
          execute(node);
          pointer++;
        } else {
          isPlaying = false;
        }
      } else {
        if(doLoop) {
          pointer = 0;
          isPlaying = true;
        } else {
          if(sine.state == 'started') {
            sine.stop(0);
          }

          if(saw.state == 'started') {
            saw.stop(0);
          }

          if(tri.state == 'started') {
            tri.stop(0);
          }

          if(square.state == 'started') {
            square.stop(0);
          }

          if(noise.state == 'started') {
            noise.stop(0);
          }

          prevChar = '';
        }
      }
    }
  }

  let startButtonClicked = () => {
    sine = new Tone.Oscillator(freq, 'sine').toMaster();
    saw = new Tone.Oscillator(freq, 'sawtooth').toMaster();
    tri = new Tone.Oscillator(freq, 'triangle').toMaster();
    square = new Tone.Oscillator(freq, 'square').toMaster();
    noise = new Tone.Noise('white').toMaster();

    runButton.elt.disabled = false;
    runButton.mousePressed(runButtonClicked);

    didLoad = true;
  };

  let runButtonClicked = () => {

    let url = canvas.elt.toDataURL('image/png');

    Tesseract.recognize(url, 'eng').then(({data: { text }}) => {
      let code = text;
      output.innerHTML = code;

      if(code) {
        code = unpack(code);

        while(code.indexOf('<') > -1) {
          code = unpack(code);
        }

        let lex = code.match(/(\D+)|[+-]?(\d*[.])?\d+/gi);
        parse(lex);
        isPlaying = true;
      }
    });
  };

  let loopToggleChanged = () => {
    doLoop = !loopToggle.elt.checked;
  }

  let unpack = (code, index) => {
    let pointer = 0;
    let result = '';
    let start = 0;
    let end = 0;
    let stack = 0;

    let peek = () => {
      return code[pointer];
    }

    let consume = () => {
      pointer++;
    }

    while(pointer < code.length) {
      let t = peek();
      if(t == "<") {
        if(stack == 0) {
          start = pointer;
        }
        stack++;
      } else if(t == ">") {
        end = pointer;
        stack--;
        if(stack == 0) {
          result += code.slice(start+1, end).repeat(2);
        }
      } else {
        if(stack == 0) {
          result += t;
        }
      }
      consume();
    }

    return result;
  };

  let parse = (l) => {
    pointer = 0;
    tokens = [];
    if(l) {
      for(let i=0; i<l.length; i++) {
        if(isNaN(l[i])) {
          let chars = l[i].split('');
          for(let j=0; j<chars.length; j++) {
            tokens.push(chars[j]);
          }
        } else {
          tokens.push(l[i]);
        }
      }
    }
  };

  let execute = (t) => {
    if(t != prevChar) {
      if(isNaN(t)) {
        switch (t) {
          case '~':
            sine.start(0);
          case 'N':
            saw.start(0);
            break;
          case '^':
            tri.start(0);
            break;
          case '[':
            square.start(0);
            break;
          case '=':
            sine.stop(0);
            saw.stop(0);
            tri.stop(0);
            square.stop(0);
            noise.stop(0);
            break;
          case '+':
          case '-':
          case '*':
          case '/':
          case '<':
          case '>':
            break;
          default:
            noise.start(0);
        }
      } else {
        if(prevChar == '+') {
          freq += parseFloat(t);
        } else if(prevChar == '-') {
          freq -= parseFloat(t);
        } else if(prevChar == '*') {
          freq *= parseFloat(t);
        } else if(prevChar == '/') {
          freq /= parseFloat(t);
        } else {
          freq = parseFloat(t);
        }

        if(!isNaN(freq)) {
          sine.frequency.value = freq;
          saw.frequency.value = freq;
          tri.frequency.value = freq;
          square.frequency.value = freq;
        }
      }
    }
    prevChar = t;
  };
};

new P5(s);
