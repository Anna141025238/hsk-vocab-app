'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from './AuthModal';

interface TopBarProps {
  isMember: boolean;
  theme: string;
  showBack?: boolean;
  onBack?: () => void;
  remainingDays?: number;
}

export function TopBar({ isMember, theme, showBack = false, onBack, remainingDays = 25 }: TopBarProps) {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <>
      <div className="sticky-topbar px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={onBack} className="px-2 py-2 text-ink hover:bg-white/50 rounded-md">
              ←
            </button>
          )}
          <h1 className="font-noto-serif-sc text-xl font-bold text-ink">
            🐱 猫咪汉语
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {isMember && user ? (
            <div className="px-4 py-2 rounded-full bg-success-bg text-success-text text-sm font-medium border border-success-border">
              สมาชิก · เหลือ {remainingDays} วัน
            </div>
          ) : !user ? (
            <>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 rounded-md text-ink hover:bg-white/50 transition"
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-gold"
              >
                อัปเกรด
              </button>
            </>
          ) : (
            <>
              <button className="btn-gold">
                อัปเกรด
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="px-4 py-2 rounded-md text-ink hover:bg-white/50 transition"
                >
                  👤 {user.email?.split('@')[0]}
                </button>
                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-48 paper-surface rounded-lg shadow-lg p-2 z-40">
                    <button
                      onClick={async () => {
                        await signOut();
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-danger-text"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
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

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={isMember ? 'login' : 'signup'}
      />
    </>
  );
}
