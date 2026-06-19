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

type QuizPhase = 'setup' | 'quiz' | 'result';

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryLevel = searchParams.get('level') || 'hsk1';
  const [level, setLevel] = useState<string>(queryLevel);
  const [phase, setPhase] = useState<QuizPhase>('setup');
  const [words, setWords] = useState<Word[]>([]);
  const [quizList, setQuizList] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'zh-th' | 'th-zh'>('zh-th');
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
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
      setWords(vocab[level] || []);
    } catch (error) {
      console.error('Failed to load vocab:', error);
    }
  };

  useEffect(() => {
    loadVocab();
  }, [level]);

  const startQuiz = (count: number) => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    setQuizList(selected);
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setAnswers(new Array(count).fill(null));
    setPhase('quiz');
  };

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    const currentWord = quizList[currentIndex];
    const isCorrect = direction === 'zh-th'
      ? answer === currentWord.th
      : answer === currentWord.h;

    if (isCorrect) {
      setScore(score + 1);
    }

    const newAnswers = [...answers];
    newAnswers[currentIndex] = answer;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex < quizList.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
      } else {
        setPhase('result');
      }
    }, 500);
  };

  const resetQuiz = () => {
    setPhase('setup');
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setAnswers([]);
  };

  if (phase === 'setup') {
    return (
      <main className="min-h-screen bg-desk">
        <TopBar isMember={true} theme={theme} showBack={true} onBack={() => router.push('/')} />

        <div className="max-w-2xl mx-auto px-4 py-8">
          <h2 className="font-noto-serif-sc text-3xl font-bold mb-6">เลือกระดับและจำนวนคำถาม</h2>

          <div className="paper-surface rounded-lg p-6 mb-6">
            <label className="block mb-4">
              <span className="text-sm font-medium mb-2 block">ระดับ</span>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-2 border border-text-muted rounded-md"
              >
                {LEVELS.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium mb-2 block">ทิศทาง</span>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as 'zh-th' | 'th-zh')}
                className="w-full p-2 border border-text-muted rounded-md"
              >
                <option value="zh-th">汉字 → ไทย</option>
                <option value="th-zh">ไทย → 汉字</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[5, 10, 20, 'all'].map((count) => (
              <button
                key={count}
                onClick={() => startQuiz(count === 'all' ? words.length : count)}
                className="btn btn-primary"
              >
                {count === 'all' ? 'ทั้งหมด' : `${count} ข้อ`}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (phase === 'quiz') {
    const currentWord = quizList[currentIndex];
    const options = [
      direction === 'zh-th' ? currentWord.th : currentWord.h,
      ...quizList
        .filter((_, i) => i !== currentIndex)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => (direction === 'zh-th' ? w.th : w.h)),
    ].sort(() => Math.random() - 0.5);

    const isAnswered = selected !== null;
    const isCorrect = isAnswered && (
      direction === 'zh-th'
        ? selected === currentWord.th
        : selected === currentWord.h
    );

    return (
      <main className="min-h-screen bg-desk">
        <TopBar isMember={true} theme={theme} showBack={true} onBack={() => resetQuiz()} />

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-text-muted">
              {currentIndex + 1} / {quizList.length}
            </span>
            <span className="text-sm font-medium">คะแนน: {score}</span>
          </div>

          {/* Progress */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-accent-blue h-2 rounded-full"
              style={{ width: `${((currentIndex + 1) / quizList.length) * 100}%` }}
            ></div>
          </div>

          {/* Question */}
          <div className="paper-surface rounded-lg p-8 mb-6">
            <p className="text-center text-lg font-noto-serif-sc font-bold text-ink mb-8">
              {direction === 'zh-th' ? currentWord.h : currentWord.th}
            </p>

            {/* Options */}
            <div className="grid gap-3">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => !isAnswered && handleAnswer(option)}
                  disabled={isAnswered}
                  className={`p-4 rounded-md text-left transition-colors ${
                    isAnswered
                      ? option === (direction === 'zh-th' ? currentWord.th : currentWord.h)
                        ? 'bg-success-bg text-success-text border border-success-border'
                        : selected === option
                        ? 'bg-red-100 text-danger-text border border-red-300'
                        : 'bg-gray-100 text-text-muted'
                      : 'bg-paper hover:bg-paper-light border border-text-muted'
                  } ${isAnswered && 'cursor-not-allowed'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (phase === 'result') {
    const percentage = Math.round((score / quizList.length) * 100);

    return (
      <main className="min-h-screen bg-desk">
        <TopBar isMember={true} theme={theme} showBack={true} onBack={() => resetQuiz()} />

        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="paper-surface rounded-lg p-8 text-center">
            <h2 className="font-noto-serif-sc text-3xl font-bold mb-4">
              {percentage >= 80 ? '🎉 ยอดเยี่ยม!' : percentage >= 60 ? '👍 ดีนะ' : '💪 ลองอีกครั้ง'}
            </h2>
            <p className="text-5xl font-bold text-accent-blue mb-4">
              {score} / {quizList.length}
            </p>
            <p className="text-xl text-text-muted mb-8">
              ถูก {percentage}%
            </p>

            <div className="flex gap-3 justify-center">
              <button onClick={resetQuiz} className="btn-primary">
                ทำควิซอีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
