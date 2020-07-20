import { Oscillator, Noise, Loop, Transport } from 'tone';

export class PCode {
  constructor(options) {
    this.freq = 440;
    this.sine = new Oscillator(this.freq, 'sine').toMaster();
    this.saw = new Oscillator(this.freq, 'sawtooth').toMaster();
    this.tri = new Oscillator(this.freq, 'triangle').toMaster();
    this.square = new Oscillator(this.freq, 'square').toMaster();
    this.noise = new Noise('white').toMaster();

    this.pointer = 0;
    this.tokens = [];

    this.isPlaying = false;
    this.doLoop = false;
    this.looper = false;

    const {
      loopContext = 'external',
      interval = -1,
      defaultVolume = -1,
      comment = {},
      meta = {}
    } = (options ? options : {});

    const {
      enable: enableCommentSyntax = false,
      line: lineComment = '#',
      block: blockComment = /""".*?"""/g,
    } = (comment ? comment : {});

    const {
      enable: enableMetaSyntax = false,
      code: metaCode = '$',
    } = (meta ? meta : {});

    Object.assign(
      this, {
        loopContext, interval,
        enableCommentSyntax, lineComment, blockComment,
        enableMetaSyntax, metaCode
      }
    );

    this.sine.volume.value = defaultVolume;
    this.saw.volume.value = defaultVolume;
    this.tri.volume.value = defaultVolume;
    this.square.volume.value = defaultVolume;
    this.noise.volume.value = defaultVolume;

    if (this.loopContext == 'internal' && !this.looper) {
      const iInterval = (this.interval <= 0) ? 1/30 : this.interval;
      this.looper = new Loop(_ => {
        this.internalLoop();
      }, iInterval).start(0);
      Transport.start();
      console.info('p-code is running with internal loop (via Tone.js Transport)');
    }

    if (this.enableCommentSyntax) {
      console.info(`enabled comment syntax, < ${this.lineComment} > and < ${this.blockComment} >`);
    }

    if (this.enableMetaSyntax) {
      console.info(`enabled meta command syntax, < ${this.metaCode} >`);
    }
  }

  unpack(code) {
    this.pointer = 0;
    let result = '';
    let start = 0;
    let end = 0;
    let stack = 0;

    let peek = () => {
      return code[this.pointer];
    };

    let consume = () => {
      this.pointer++;
    };

    while(this.pointer < code.length) {
      let t = peek();
      if (t == "<") {
        if (stack == 0) {
          start = this.pointer;
        }
        stack++;
      } else if (t == ">") {
        end = this.pointer;
        stack--;
        if (stack == 0) {
          result += code.slice(start+1, end).repeat(2);
        }
      } else {
        if (stack == 0) {
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
    if (l) {
      for(let i=0; i<l.length; i++) {
        if (isNaN(l[i])) {
          let chars = l[i].split('');
          for(let j=0; j<chars.length; j++) {
            this.tokens.push(chars[j]);
          }
        } else {
          this.tokens.push(l[i]);
        }
      }
    }

    console.info(
      `parsed length: ${this.tokens.length}\r\n`,
      `- duration[sec/@30fps]: ${this.tokens.length / 30}\r\n`,
      `- duration[min/@30fps]: ${this.tokens.length / 30 / 60}`,
    );
  }

  run(code) {
    if (this.enableCommentSyntax) {
      if (code.indexOf(this.lineComment) == 0) {
        return;
      }

      code = code.replace(this.blockComment, '');
    }

    //! TODO:
    if (this.enableMetaSyntax) {
      if (code.indexOf(this.metaCode) == 0) {
        return;
      }
    }
    // --

    this.isPlaying = true;

    this.unpack(code);

    let repeatCounter = 0;
    for(let i=0; i<code.length; i++) {
      if (code[i] == '<') {
        repeatCounter++;
      }
      if (code[i] == '>') {
        repeatCounter--;
      }
    }

    if (repeatCounter > 0) {
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
    if (t != this.prevChar) {
      if (isNaN(t)) {
        switch (t) {
          case '~':
            this.sine.start(0);
            break;
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
        if (this.prevChar == '+') {
          this.freq += parseFloat(t);
        } else if (this.prevChar == '-') {
          this.freq -= parseFloat(t);
        } else if (this.prevChar == '*') {
          this.freq *= parseFloat(t);
        } else if (this.prevChar == '/') {
          this.freq /= parseFloat(t);
        } else {
          this.freq = parseFloat(t);
        }

        if (!isNaN(this.freq)) {
          this.sine.frequency.value = this.freq;
          this.saw.frequency.value = this.freq;
          this.tri.frequency.value = this.freq;
          this.square.frequency.value = this.freq;
        }
      }
    }
    this.prevChar = t;
  }

  stop() {
    if (this.sine.state == 'started') {
      this.sine.stop(0);
    }

    if (this.saw.state == 'started') {
      this.saw.stop(0);
    }

    if (this.tri.state == 'started') {
      this.tri.stop(0);
    }

    if (this.square.state == 'started') {
      this.square.stop(0);
    }

    if (this.noise.state == 'started') {
      this.noise.stop(0);
    }

    this.prevChar = '';
    this.isPlaying = false;
  }

  reset() {
    this.pointer = 0;
  }

  internalLoop() {
    if (this.isPlaying) {
      if (this.hasNext()) {
        let node = this.tokens[this.pointer];
        this.execute(node);
        this.next();
      } else {
        this.isPlaying = false;
      }
    } else {
      if (this.doLoop) {
        this.reset();
        this.isPlaying = true;
      } else {
        this.stop();
      }
    }
  }

  setVolume(v) {
    this.sine.volume.value = v;
    this.saw.volume.value = v;
    this.tri.volume.value = v;
    this.square.volume.value = v;
    this.noise.volume.value = v;
  }
}
