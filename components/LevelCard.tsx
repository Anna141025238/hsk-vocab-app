'use client';

interface Level {
  id: string;
  label: string;
  words: number;
  free: boolean;
}

interface LevelCardProps {
  level: Level;
  isMember: boolean;
  canAccess: boolean;
  onFlashcard?: () => void;
  onQuiz?: () => void;
}

export function LevelCard({ level, isMember, canAccess, onFlashcard, onQuiz }: LevelCardProps) {
  return (
    <div className="paper-surface rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-noto-serif-sc text-3xl font-bold text-ink">
            {level.label}
          </h3>
          <p className="text-sm text-text-muted mt-1">
            {level.words.toLocaleString()} คำศัพท์
          </p>
        </div>
        {!canAccess && (
          <div className="px-3 py-1 rounded-full bg-gold-bg text-gold-text text-xs font-medium border border-gold-border">
            เฉพาะสมาชิก
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-success-text h-2 rounded-full"
          style={{ width: '35%' }}
        ></div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {canAccess ? (
          <>
            <button onClick={onFlashcard} className="btn-primary flex-1">แฟลชการ์ด</button>
            <button onClick={onQuiz} className="btn-primary flex-1">ควิซ</button>
          </>
        ) : (
          <button className="btn-gold w-full">ปลดล็อก</button>
        )}
      </div>
    </div>
  );
}
