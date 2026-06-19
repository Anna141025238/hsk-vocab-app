const fs = require('fs');
const path = require('path');

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedVocab() {
  try {
    console.log('📂 Reading vocab.json...');
    const vocabPath = path.join(__dirname, '..', 'public', 'data', 'vocab.json');
    const vocabJson = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

    let totalInserted = 0;

    for (const [level, words] of Object.entries(vocabJson)) {
      console.log(`\n🔤 Processing ${level}... (${words.length} words)`);

      const rows = words.map((word) => ({
        level,
        hanzi: word.h || '',
        pinyin: word.p || '',
        thai_meaning: word.th || '',
      }));

      // Insert in batches of 1000
      for (let i = 0; i < rows.length; i += 1000) {
        const batch = rows.slice(i, i + 1000);
        const { error, data } = await supabase
          .from('vocab_entries')
          .insert(batch);

        if (error) {
          console.error(`❌ Batch error for ${level}:`, error.message);
        } else {
          totalInserted += batch.length;
          console.log(`  ✅ Inserted batch (${i}-${Math.min(i + 1000, rows.length)})`);
        }
      }
    }

    console.log(`\n🎉 Seeding complete! Total words inserted: ${totalInserted}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedVocab();
