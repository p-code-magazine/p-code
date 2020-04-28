# P-Code

<a href="https://p-code-magazine.github.io/"><img src="/P-QR-Code.png" width="100"></a>

## [Language specification (in Japanese)](/LANGSPEC.md)


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

```
npm i
npm run build
```

### Run example application

Create a Self-Signed SSL Certificate. [How to get https working on your local development environment in 5 minuts](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/).

```
npm run example:serve
```

Access https://[LOCAL-SERVER-IP-ADDRESS]:8080/ on your mobile.

### Build example application

```
npm run example:build
```
