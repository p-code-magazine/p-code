import Tone from 'tone';

export class PCode {
  constructor() {
    this.freq = 440;
    this.sine = new Tone.Oscillator(this.freq, 'sine').toMaster();
    this.saw = new Tone.Oscillator(this.freq, 'sawtooth').toMaster();
    this.tri = new Tone.Oscillator(this.freq, 'triangle').toMaster();
    this.square = new Tone.Oscillator(this.freq, 'square').toMaster();
    this.noise = new Tone.Noise('white').toMaster();
    this.pointer = 0;
    this.tokens = [];
  }

  unpack(code) {
    this.pointer = 0;
    let result = '';
    let start = 0;
    let end = 0;
    let stack = 0;

    let peek = () => {
      return code[this.pointer];
    }

    let consume = () => {
      this.pointer++;
    }

    while(this.pointer < code.length) {
      let t = peek();
      if(t == "<") {
        if(stack == 0) {
          start = this.pointer;
        }
        stack++;
      } else if(t == ">") {
        end = this.pointer;
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

  next() {
    this.pointer++;
  }

  hasNext() {
    return this.pointer < this.tokens.length;
  }

  parse(l) {
    this.pointer = 0;
    this.tokens = [];
    if(l) {
      for(let i=0; i<l.length; i++) {
        if(isNaN(l[i])) {
          let chars = l[i].split('');
          for(let j=0; j<chars.length; j++) {
            this.tokens.push(chars[j]);
          }
        } else {
          this.tokens.push(l[i]);
        }
      }
    }
  }

  run(code) {
    this.unpack(code);

    let repeatCounter = 0;
    for(let i=0; i<code.length; i++) {
      if(code[i] == '<') {
        repeatCounter++;
      }
      if(code[i] == '>') {
        repeatCounter--;
      }
    }

    if(repeatCounter > 0) {
      for(let i=0; i<repeatCounter; i++) {
        code += '>';
      }
    }

    while(code.indexOf('<') > -1) {
      code = this.unpack(code);
    }

    let lex = code.match(/(\D+)|[+-]?(\d*[.])?\d+/gi);
    this.parse(lex);
  }

  execute(t) {
    if(t != this.prevChar) {
      if(isNaN(t)) {
        switch (t) {
          case '~':
            this.sine.start(0);
          case 'N':
            this.saw.start(0);
            break;
          case '^':
            this.tri.start(0);
            break;
          case '[':
            this.square.start(0);
            break;
          case '=':
            this.sine.stop(0);
            this.saw.stop(0);
            this.tri.stop(0);
            this.square.stop(0);
            this.noise.stop(0);
            break;
          case '+':
          case '-':
          case '*':
          case '/':
          case '<':
          case '>':
            break;
          default:
            this.noise.start(0);
        }
      } else {
        if(this.prevChar == '+') {
          this.freq += parseFloat(t);
        } else if(this.prevChar == '-') {
          this.freq -= parseFloat(t);
        } else if(this.prevChar == '*') {
          this.freq *= parseFloat(t);
        } else if(this.prevChar == '/') {
          this.freq /= parseFloat(t);
        } else {
          this.freq = parseFloat(t);
        }

        if(!isNaN(this.freq)) {
          this.sine.frequency.value = this.freq;
          this.saw.frequency.value = this.freq;
          this.tri.frequency.value = this.freq;
          this.square.frequency.value = this.freq;
        }
      }
    }
    this.prevChar = t;
  };

  stop() {
    if(this.sine.state == 'started') {
      this.sine.stop(0);
    }

    if(this.saw.state == 'started') {
      this.saw.stop(0);
    }

    if(this.tri.state == 'started') {
      this.tri.stop(0);
    }

    if(this.square.state == 'started') {
      this.square.stop(0);
    }

    if(this.noise.state == 'started') {
      this.noise.stop(0);
    }

    this.prevChar = '';
  }

  reset() {
    this.pointer = 0;
  }
}
