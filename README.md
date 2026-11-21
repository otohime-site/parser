### The Otohime Parser

The parser will take the `Document` or text (parsing with `DOMParser`) and return an object for each function.

You need polyfill for `DOMParser` if you are not under browser environment.

#### Implemented parser

##### maimai

We do our best to support both the Japanese and International versions of maimai DX NET.
It is currently tested up to maimai DX MAGiCAL.

```js
// Providing text from https://maimaidx-eng.com/maimai-mobile/home/...
import { parsePlayer } from "@otohime-site/parser/dx_intl"
const player = parsePlayer(playerText)

// Providing text from https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=3...
import { parseScores } from "@otohime-site/parser/dx_intl"
// Played charts only, typed as ScoresParseEntryWithScore[]
const scores = parseScores(scoresText)
// Also include unplayed charts, typed as ScoresParseEntry[]
const allScores = parseScores(scoresText, { includeUnplayed: true })
```

All functions and result types are exported from `@otohime-site/parser/dx_intl`:

```ts
import type {
  PlayerParseResult,
  ScoresParseEntry,
  ScoresParseEntryWithScore,
} from "@otohime-site/parser/dx_intl"
```

Played score entries include `dx_score` and `max_dx_score`. `dx_score` can be 0
for charts that were only played before maimai DX.
