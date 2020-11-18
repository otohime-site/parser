### The Otohime Parser

The parser will take the HTML text, parsing using `DOMParser` and return an object for each function.

You need polyfill for `DOMParser` if you are not under browser environment.

#### Implemented parser
##### maimai DX Int'l Version

It is believed that it can be also used to parse from Japanese version of maimai DX Splash,
but it is currently untested so use it carefully.

```js
// Providing text from https://maimaidx-eng.com/maimai-mobile/home/...
import { parsePlayer } from '@otohime-site/parser/dx_intl'
const player = parsePlayer(playerText)

// Providing text from https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=3...
import { parseScores } from '@otohime-site/parser/dx_intl'
const scores = parseScores(scoresText)
```