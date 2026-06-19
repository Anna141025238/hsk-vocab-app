import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Read vocab from JSON file
    const vocabPath = join(process.cwd(), 'public/data/vocab.json');
    const vocabData = readFileSync(vocabPath, 'utf-8');
    const vocab = JSON.parse(vocabData);

    // Set cache headers for long-term caching
    const response = NextResponse.json(vocab);
    response.headers.set('Cache-Control', 'public, max-age=3600, immutable');

    return response;
  } catch (error) {
    console.error('Vocab fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to load vocabulary' },
      { status: 500 }
    );
  }
}
