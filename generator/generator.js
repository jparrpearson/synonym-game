const fs = require('fs');

const MIN_SYNONYM_COUNT = 3;
// TODO: Find a better source with fewer obscure words
// See https://www.kaggle.com/datasets/dfydata/wordnet-dictionary-thesaurus-files-in-csv-format
const INPUT_FILE = './WordnetSynonyms.csv';
const OUTPUT_FILE = '../js/synonyms.js';

// Generate 2D array of words to synonyms list
function generateWordSynonymsArray(csvString) {
    const rows = csvString.trim().split('\n');
    const result = [];

    // Expect word, count, pos, synonyms (synonyms are semicolon-delimited and sometimes pipe-delimited)
    for (const row of rows) {
        const [word, count, pos, synonyms] = row.split(',');
        const synonymList = synonyms.split(/;|\|/).map(s => s.trim());
        const uniqueSynonyms = [...new Set(synonymList)];
        if (uniqueSynonyms.length > MIN_SYNONYM_COUNT) {
            result.push([word.trim(), uniqueSynonyms]);
        }
    }

    return result;
}

fs.readFile(INPUT_FILE, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    const wordSynonymsArray = generateWordSynonymsArray(data);
    console.log('Done parsing input file');

    const arrayString = `const wordSynonyms = ${JSON.stringify(wordSynonymsArray, null, 2)};`;

    fs.writeFile(OUTPUT_FILE, arrayString, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('Done saving output file');
    });
});
