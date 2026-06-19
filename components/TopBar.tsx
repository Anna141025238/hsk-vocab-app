'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <div className="sticky-topbar px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
        {/* Left: back + brand */}
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={onBack} className="p-1.5 md:p-2 text-ink hover:bg-white/50 rounded-md">
              ←
            </button>
          )}
          <h1 className="font-noto-serif-sc text-base md:text-xl font-bold text-ink">
            🐱 <span className="hidden sm:inline">猫咪汉语</span><span className="sm:hidden">猫咪</span>
          </h1>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
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
              <button onClick={() => setShowAuthModal(true)} className="btn-gold">
                อัปเกรด
              </button>
            </>
          ) : (
            <>
              <button className="btn-gold">อัปเกรด</button>
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
                      onClick={async () => { await signOut(); setShowAccountMenu(false); }}
                      className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-danger-text"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          <button onClick={() => router.push('/admin')} className="p-2 text-ink hover:bg-white/50 rounded-md" title="จัดการ">⚙️</button>
          <button className="p-2 text-ink hover:bg-white/50 rounded-md" title="สลับพินอิน">拼</button>
        </div>

        {/* Mobile: compact status + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {isMember && user && (
            <span className="text-xs px-2 py-1 rounded-full bg-success-bg text-success-text border border-success-border">
              สมาชิก {remainingDays}ว
            </span>
          )}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-1.5 text-ink hover:bg-white/50 rounded-md text-lg leading-none"
            aria-label="เมนู"
          >
            {showMobileMenu ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-topbar border-b border-black/10 px-4 py-3 flex flex-col gap-2 z-30">
          {!user ? (
            <>
              <button
                onClick={() => { setShowAuthModal(true); setShowMobileMenu(false); }}
                className="text-left px-3 py-2 rounded-md hover:bg-white/50"
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => { setShowAuthModal(true); setShowMobileMenu(false); }}
                className="btn-gold w-full"
              >
                อัปเกรดเป็นสมาชิก
              </button>
            </>
          ) : (
            <>
              {!isMember && (
                <button className="btn-gold w-full">อัปเกรด</button>
              )}
              <button
                onClick={async () => { await signOut(); setShowMobileMenu(false); }}
                className="text-left px-3 py-2 rounded-md text-danger-text hover:bg-white/50"
              >
                ออกจากระบบ ({user.email?.split('@')[0]})
              </button>
            </>
          )}
          <div className="flex gap-2 pt-1 border-t border-black/10">
            <button onClick={() => { router.push('/admin'); setShowMobileMenu(false); }} className="flex-1 px-3 py-2 rounded-md hover:bg-white/50 text-sm text-center">⚙️ จัดการ</button>
            <button className="flex-1 px-3 py-2 rounded-md hover:bg-white/50 text-sm text-center">拼 พินอิน</button>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={isMember ? 'login' : 'signup'}
      />
    </>
  );
}
