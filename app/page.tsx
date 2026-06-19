'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { TopBar } from '@/components/TopBar';
import { LevelCard } from '@/components/LevelCard';
import { ThemeSelector } from '@/components/ThemeSelector';
import { getMembershipStatus } from '@/lib/membership';

const LEVELS = [
  { id: 'hsk1', label: 'HSK 1', words: 300, free: true },
  { id: 'hsk2', label: 'HSK 2', words: 200, free: true },
  { id: 'hsk3', label: 'HSK 3', words: 500, free: false },
  { id: 'hsk4', label: 'HSK 4', words: 1000, free: false },
  { id: 'hsk5', label: 'HSK 5', words: 1600, free: false },
  { id: 'hsk6', label: 'HSK 6', words: 1600, free: false },
  { id: 'hsk79ah', label: 'HSK 7-9 (A-H)', words: 1834, free: false },
  { id: 'hsk79js', label: 'HSK 7-9 (J-S)', words: 2091, free: false },
  { id: 'hsk79tz', label: 'HSK 7-9 (T-Z)', words: 1675, free: false },
];

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const [remainingDays, setRemainingDays] = useState(0);
  const [theme, setTheme] = useState('white');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load membership status from localStorage (temporary until DB ready)
    const member = localStorage.getItem('hskvocab_member');
    if (member) {
      const { active, expiry } = JSON.parse(member);
      const isValid = active && new Date(expiry) > new Date();
      setIsMember(isValid);
      if (isValid) {
        const days = Math.ceil(
          (new Date(expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        setRemainingDays(Math.max(0, days));
      }
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('hskvocab_theme') || 'white';
    setTheme(savedTheme);
  }, []);

  if (!mounted || loading) return null;

  const handleLevelSelect = (levelId: string, mode: 'flashcard' | 'quiz') => {
    if (mode === 'flashcard') {
      router.push(`/flashcard?level=${levelId}`);
    } else {
      router.push(`/quiz?level=${levelId}`);
    }
  };

  return (
    <main className="min-h-screen bg-desk">
      <TopBar isMember={isMember} theme={theme} remainingDays={remainingDays} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-noto-serif-sc text-5xl font-bold text-ink mb-2">
            คลังคำศัพท์ HSK
          </h1>
          <p className="font-noto-serif-th text-lg text-text-muted mb-6">
            ฝึกอ่าน พูด และจำศัพท์จำเป็นสำหรับทุกระดับ
          </p>
        </div>

        {/* Theme Selector */}
        <div className="mb-8">
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {LEVELS.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              isMember={isMember}
              canAccess={level.free || isMember}
              onFlashcard={() => handleLevelSelect(level.id, 'flashcard')}
              onQuiz={() => handleLevelSelect(level.id, 'quiz')}
            />
          ))}
        </div>

        {/* Words to Review Section */}
        <div className="paper-surface rounded-lg p-6">
          <h2 className="font-noto-serif-sc text-2xl font-bold text-ink mb-4">
            คำศัพท์ที่ยังจำไม่ได้
          </h2>
          <p className="text-text-muted">ไม่มีคำศัพท์ที่ต้องทำการตรวจสอบ</p>
        </div>
      </div>
    </main>
  );
}
