'use client';

interface TopBarProps {
  isMember: boolean;
  theme: string;
}

export function TopBar({ isMember, theme }: TopBarProps) {
  return (
    <div className="sticky-topbar px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="font-noto-serif-sc text-xl font-bold text-ink">
          🐱 猫咪汉语
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {isMember ? (
          <div className="px-4 py-2 rounded-full bg-success-bg text-success-text text-sm font-medium border border-success-border">
            สมาชิก · เหลือ 25 วัน
          </div>
        ) : (
          <>
            <button className="px-4 py-2 rounded-md text-ink hover:bg-white/50 transition">
              เข้าสู่ระบบ
            </button>
            <button className="btn-gold">
              อัปเกรด
            </button>
          </>
        )}

        <button className="px-2 py-2 text-ink hover:bg-white/50 rounded-md" title="จัดการคำศัพท์">
          ⚙️
        </button>

        <button className="px-2 py-2 text-ink hover:bg-white/50 rounded-md" title="สลับพินอิน">
          拼
        </button>
      </div>
    </div>
  );
}
