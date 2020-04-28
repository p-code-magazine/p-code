# P-Code

<a href="https://p-code-magazine.github.io/"><img src="./P-QR-Code.png" width="100"></a>

## Synopsis

P-Code is a language for live coding that evolved from the idea of describing rhythm machine patterns in text form and incorporated elements of programming. The code is interpreted from left to right, divided into numbers and other symbols, and executed. All numbers are processed as frequencies, and all symbols that cannot be interpreted are treated as white noise.

## Language specification

- [English](/langspec.md)
- [日本語](/langspec-ja.md)

## Install & Usage

### Via NPM:

```shellscript
npm i @p-code-magazine/p-code
```

```javascript
import { PCode } from 'p-code';

const pcode = new PCode();
// No options supplied, "loopContext = 'external'" is default.
// You need to handle run-execute process by self.
//
// (e.g. into setInterval or requestAnimationFrame callback)
...

if (pcode.isPlaying) {
    if (pcode.hasNext()) {
        let node = pcode.tokens[pcode.pointer];
        pcode.execute(node);
        pcode.next();
    } else {
        pcode.isPlaying = false;
    }
} else {
    if (pcode.doLoop) {
        pcode.reset();
        pcode.isPlaying = true;
    } else {
        pcode.stop();
    }
}
...
```

or

```javascript
import { PCode } from 'p-code';

const pcode = new PCode({
    // If loopContext = 'internal', p-code run as internal-loop (standalone) mode.
    loopContext: 'internal'
    // Other options, defaults are as follows:
    /*
    enableCommentSyntax: false,
    lineComment: '#',
    blockComment: /""".*?"""/g
    */
});
```
<<<<<<< HEAD
npm install
npm run serve

# And then, access http://0.0.0.0:8080/
```

## Build prototype
=======

### Via CDN (unpkg):

```html
<script src="https://unpkg.com/@p-code-magazine/p-code" defer></script>

<script defer>
    const _pcode = new pcode.PCode();
    ...
</script>>
```

A shrot tutorial is [here](examples/tutorial.html), or run on [CodePen](https://codepen.io/inafact/pen/vYNZgMx)


## Development

### Build bundle

>>>>>>> master
```
npm i
npm run build
```
<<<<<<< HEAD
---

## Run app
=======

### Run example application

>>>>>>> master
Create a Self-Signed SSL Certificate. [How to get https working on your local development environment in 5 minuts](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/).

```
npm run example:serve
```

Access https://[LOCAL-SERVER-IP-ADDRESS]:8080/ on your mobile.

### Build example application

```
<<<<<<< HEAD
npm run build
```
=======
npm run example:build
```
>>>>>>> master
