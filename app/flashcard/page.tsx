'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/TopBar';

interface Word {
  h: string;
  p: string;
  th: string;
}

const LEVELS = [
  { id: 'hsk1', label: 'HSK 1' },
  { id: 'hsk2', label: 'HSK 2' },
  { id: 'hsk3', label: 'HSK 3' },
  { id: 'hsk4', label: 'HSK 4' },
  { id: 'hsk5', label: 'HSK 5' },
  { id: 'hsk6', label: 'HSK 6' },
  { id: 'hsk79ah', label: 'HSK 7-9 (A-H)' },
  { id: 'hsk79js', label: 'HSK 7-9 (J-S)' },
  { id: 'hsk79tz', label: 'HSK 7-9 (T-Z)' },
];

function FlashcardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryLevel = searchParams.get('level') || 'hsk1';
  const [level, setLevel] = useState<string>(queryLevel);
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);
  const [marked, setMarked] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('white');

  useEffect(() => {
    const savedTheme = localStorage.getItem('hskvocab_theme') || 'white';
    setTheme(savedTheme);
    loadVocab();
  }, []);

  const loadVocab = async () => {
    try {
      const response = await fetch('/data/vocab.json');
      const vocab = await response.json();
      const levelWords = vocab[level] || [];
      const sorted = isShuffled ? [...levelWords].sort(() => Math.random() - 0.5) : levelWords;
      setWords(sorted);
      setCurrentIndex(0);
      setIsFlipped(false);
      setMarked({});
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load vocab:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVocab();
  }, [level, isShuffled]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-desk flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-ink">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const progress = `${currentIndex + 1} / ${words.length}`;

  return (
    <main className="min-h-screen bg-desk">
      <TopBar isMember={true} theme={theme} showBack={true} onBack={() => router.push('/')} />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-noto-serif-sc text-2xl font-bold">
            {LEVELS.find((l) => l.id === level)?.label}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className="px-3 py-2 text-sm rounded-md bg-paper hover:bg-paper-light transition"
            >
              {showPinyin ? '隐藏' : '显示'} 拼
            </button>
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className="px-3 py-2 text-sm rounded-md bg-paper hover:bg-paper-light transition"
            >
              {isShuffled ? '按序' : '随机'}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-text-muted">ความคืบหน้า</span>
            <span className="text-sm font-medium">{progress}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-accent-blue h-3 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="paper-surface rounded-lg p-8 mb-6 min-h-[400px] flex flex-col items-center justify-center cursor-pointer transform transition-transform duration-500"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {!isFlipped ? (
            <div className="text-center">
              <p className="text-sm text-text-muted mb-4">汉字</p>
              <h3 className="font-noto-serif-sc text-8xl font-bold text-ink mb-4">
                {currentWord?.h}
              </h3>
              {showPinyin && (
                <p className="font-noto-serif italic text-lg text-accent-brown">
                  {currentWord?.p}
                </p>
              )}
              <p className="text-xs text-text-muted mt-6">คลิกเพื่อพลิกการ์ด</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-text-muted mb-4">ความหมาย</p>
              <h3 className="font-noto-serif-th text-4xl font-bold text-ink">
                {currentWord?.th}
              </h3>
              <p className="text-xs text-text-muted mt-6">คลิกเพื่อพลิกการ์ด</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mb-6">
          <button
            onClick={() => {
              setMarked({ ...marked, [currentIndex]: 'mastered' });
              if (currentIndex < words.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setIsFlipped(false);
              }
            }}
            className="btn-success"
          >
            จำได้ ({marked[currentIndex] === 'mastered' ? '✓' : ''})
          </button>
          <button
            onClick={() => {
              setMarked({ ...marked, [currentIndex]: 'not-yet' });
              if (currentIndex < words.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setIsFlipped(false);
              }
            }}
            className="btn"
            style={{ backgroundColor: '#f3ead4', color: '#7a5e22', border: '1px solid #b6924e' }}
          >
            ยังจำไม่ได้
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setCurrentIndex(Math.max(0, currentIndex - 1));
              setIsFlipped(false);
            }}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-md bg-paper hover:bg-paper-light transition disabled:opacity-50"
          >
            ← ก่อนหน้า
          </button>
          <button
            onClick={() => {
              setCurrentIndex(Math.min(words.length - 1, currentIndex + 1));
              setIsFlipped(false);
            }}
            disabled={currentIndex === words.length - 1}
            className="px-4 py-2 rounded-md bg-paper hover:bg-paper-light transition disabled:opacity-50"
          >
            ถัดไป →
          </button>
        </div>
      </div>
    </main>
  );
}

// Wrap with Suspense for useSearchParams
import { Suspense } from 'react';

export default function FlashcardPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-desk flex items-center justify-center"><p className="text-ink">กำลังโหลด...</p></div>}>
      <FlashcardPage />
    </Suspense>
  );
}
