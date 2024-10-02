# Synonym Parser

## Overview

Each CSV or other source must be parsed as follows:
```
const wordSynonyms = [[word1, [synonym1, synonym2, ...]], ...];
```

This output should be saved to `../js/synonyms.js`.

## Prerequisites

Assumes `node` and `npm` are installed.

## Usage

See the various parser `js` files for configurable options.  Must ensure the source file is also available.

Run a parser:
```sh
$ node fernald-parser.js
```
