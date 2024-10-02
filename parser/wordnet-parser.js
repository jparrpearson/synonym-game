const fs = require('fs');

const INPUT_FILE = './WordnetSynonyms.csv';
const OUTPUT_FILE = '../js/synonyms.js';
const MIN_SYNONYM_COUNT = 4;

// Capitalize each word
function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Output a word to synonyms 2D array from the source CSV
// See https://www.kaggle.com/datasets/dfydata/wordnet-dictionary-thesaurus-files-in-csv-format
function generateWordSynonymsArray(csvString) {
    const rows = csvString.trim().split('\n');
    const result = [];

    // Expect word, count, pos, synonyms (synonyms are semicolon-delimited and sometimes pipe-delimited)
    for (const row of rows) {
        const [word, count, pos, synonyms] = row.split(',');
        const capitalizedWord = capitalize(word.trim());
        const synonymList = synonyms.split(/;|\|/).map(s => s.trim());
        const uniqueSynonyms = [...new Set(synonymList)];
        const capitalizedSynonyms = uniqueSynonyms.map(synonym => capitalize(synonym));
        if (capitalizedSynonyms.length > MIN_SYNONYM_COUNT) {
            result.push([capitalizedWord, capitalizedSynonyms]);
        }
    }

    return result;
}

fs.readFile(INPUT_FILE, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file: ', err);
        return;
    }
    const wordSynonymsArray = generateWordSynonymsArray(data);

    const arrayString = `const wordSynonyms = ${JSON.stringify(wordSynonymsArray, null, 2)};`;

    fs.writeFile(OUTPUT_FILE, arrayString, (err) => {
        if (err) {
            console.error('Error writing file: ', err);
            return;
        }
    });
});
