const fs = require('fs');
const path = require('path');

// Read the DC HTML file
const dcPath = path.join(__dirname, '..', 'HSK คำศัพท์.dc.html');
const htmlContent = fs.readFileSync(dcPath, 'utf-8');

// Extract the VOCAB object using regex
// Looking for: VOCAB = { ... }
const vocabMatch = htmlContent.match(/VOCAB\s*=\s*(\{[\s\S]*?\n\s*}\s*;)/);

if (!vocabMatch) {
  console.error('❌ Could not find VOCAB object in HTML file');
  process.exit(1);
}

const vocabStr = vocabMatch[1];

// Parse the object by evaluating it (unsafe, but controlled environment)
let VOCAB;
try {
  eval(`VOCAB = ${vocabStr}`);
} catch (e) {
  console.error('❌ Failed to parse VOCAB object:', e.message);
  process.exit(1);
}

// Validate and transform
const vocab = {};
for (const [level, words] of Object.entries(VOCAB)) {
  if (Array.isArray(words)) {
    vocab[level] = words.map((w) => ({
      h: w.h || '',
      p: w.p || '',
      th: w.th || '',
    }));
  }
}

// Write to JSON file
const outputPath = path.join(__dirname, '..', 'public', 'data', 'vocab.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(vocab, null, 2));

console.log('✅ Vocab extracted successfully!');
console.log(
  `   Levels: ${Object.keys(vocab).join(', ')}`
);
console.log(
  `   Total words: ${Object.values(vocab).reduce((sum, words) => sum + words.length, 0)}`
);
