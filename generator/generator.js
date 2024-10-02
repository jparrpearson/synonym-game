const fs = require('fs');

// TODO: Find a better source with fewer obscure words (create different generator for each input)
// See https://www.kaggle.com/datasets/dfydata/wordnet-dictionary-thesaurus-files-in-csv-format
const INPUT_FILE = (process.env.INPUT_FILE || './WordnetSynonyms.csv');
const OUTPUT_FILE = (process.env.OUTPUT_FILE || '../js/synonyms.js');
const MIN_SYNONYM_COUNT = 4;

// Capitalized each word
function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate 2D array of words to synonyms list (e.g. [[word,[synonym1, synonym2, synonym3]]])
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
        if (uniqueSynonyms.length > MIN_SYNONYM_COUNT) {
            result.push([capitalizedWord, capitalizedSynonyms]);
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
