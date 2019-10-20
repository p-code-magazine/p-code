import P5 from 'p5';
import 'p5/lib/addons/p5.dom';
import 'p5/lib/addons/p5.sound';
import { parse } from 'querystring';

const s = (p5) => {
  let sine;
  let saw;
  let tri;
  let square;
  let noise;

  let freq = 440;
  let pointer = 0;
  let codeInput;
  let runButton;
  let output;
  let tokens = [];

  let isPlaying = false;
  let prevChar = '';

  p5.setup = () => {
    p5.frameRate(30);
    sine = new P5.Oscillator(freq, 'sine');
    saw = new P5.Oscillator(freq, 'sawtooth');
    tri = new P5.Oscillator(freq, 'triangle');
    square = new P5.Oscillator(freq, 'square');
    noise = new P5.Noise('white');

    codeInput = p5.select('#code');
    runButton = p5.select('#run');
    output = p5.select('#output');

    runButton.mousePressed(runButtonClicked);
  }

  p5.draw = () => {
    if(isPlaying) {
      if(pointer < tokens.length) {
        let node = tokens[pointer];
        execute(node);
        pointer++;
      } else {
        isPlaying = false;
      }
    } else {
      sine.stop();
      saw.stop();
      tri.stop();
      square.stop();
      noise.stop();
      prevChar = '';
    }
  }

  let runButtonClicked = () => {
    isPlaying = true;

    let code = codeInput.value();
    code = unpack(code);

    while(code.indexOf('<') > -1) {
      code = unpack(code);
    }

    let lex = code.match(/(\D+)|[+-]?(\d*[.])?\d+/gi);
    parse(lex);
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
      if(t === "<") {
        if(stack == 0) {
          start = pointer;
        }
        stack++;
      } else if(t === ">") {
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
  }


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
  }

  let execute = (t) => {
    if(t != prevChar) {
      if(isNaN(t)) {
        switch (t) {
          case '~':
            sine.start();
          case '/':
            saw.start();
            break;
          case '^':
            tri.start();
            break;
          case '[':
            square.start();
            break;
          case '=':
            sine.stop();
            saw.stop();
            tri.stop();
            square.stop();
            noise.stop();
            break;
          case '+':
          case '-':
          case '*':
          case '/':
          case '<':
          case '>':
            break;
          default:
            noise.start();
        }
      } else {
        if(prevChar == "+") {
          freq += parseFloat(t);
        } else if(prevChar == "-") {
          freq -= parseFloat(t);
        } else if(prevChar == "*") {
          freq *= parseFloat(t);
        } else if(prevChar == "/") {
          freq /= parseFloat(t);
        } else {
          freq = parseFloat(t);
        }

        sine.freq(freq);
        saw.freq(freq);
        tri.freq(freq);
        square.freq(freq);
      }
    }
    prevChar = t;
  }
}

new P5(s);
