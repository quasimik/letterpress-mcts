# dictionatrie
Build and search a minimalist dictionary trie

## Usage

```javascript
// Initialization
const createDictionary = require("dictionatrie");
const dictionary = createDictionary(); // defaults to a huge list of English words
const customDictionary = createDictionary([ "cat", "dog", "llama" ]); // custom dictionary

// Search for complete match
var match1 = dictionary.has("uncontroversially"); // true
var match2 = customDictionary.has("llama"); // true
var match3 = dictionary.has("uncontroversiall"); // false: no complete match
var match4 = customDictionary.has("uncontroversially"); // false: no such word in custom dictionary

// Search for partial match (add a "true" flag)
var match5 = dictionary.has("uncontroversially", true); // true
var match6 = dictionary.has("uncontroversiall", true); // true
```

## Dependencies

`word-list` by sindresorhus: Used for the default word list.
