'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type PaymentStep = 'plan' | 'signup' | 'login' | 'qr' | 'success' | 'manage';

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const { user, signUp, signIn, signOut } = useAuth();
  const [step, setStep] = useState<PaymentStep>('plan');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [chargeId, setChargeId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(email, password, name);
      setStep('qr');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      setStep('qr');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const handleContinuePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // In production, this would call the actual payment API
      const response = await fetch('/api/membership/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 9900 }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const { chargeId: id } = await response.json();
      setChargeId(id);
      setStep('qr');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate payment confirmation
      // In production, would verify webhook
      localStorage.setItem(
        'hskvocab_member',
        JSON.stringify({
          active: true,
          expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
      );

      setStep('success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="paper-surface rounded-lg p-8 w-full max-w-md animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'plan' && (
          <>
            <h2 className="font-noto-serif-sc text-2xl font-bold text-ink mb-4">
              อัปเกรดเป็นสมาชิก
            </h2>
            <div className="space-y-4 mb-6">
              <div className="text-4xl font-bold text-accent-blue">
                ฿99 <span className="text-lg text-text-muted">/เดือน</span>
              </div>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>✓ เข้าถึง HSK 3-9</li>
                <li>✓ ทุกโหมดการศึกษา</li>
                <li>✓ เนื้อหาอัปเดตตามเวลา</li>
                <li>✓ ยกเลิกได้ทุกเมื่อ</li>
              </ul>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              onClick={() => {
                if (user) {
                  setStep('qr');
                } else {
                  setStep('signup');
                }
              }}
              className="btn-primary w-full mb-2"
            >
              {user ? 'ดำเนินการชำระเงิน' : 'สมัครสมาชิก'}
            </button>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 rounded-md text-ink bg-gray-100 hover:bg-gray-200 transition"
            >
              ยกเลิก
            </button>
          </>
        )}

        {step === 'signup' && (
          <>
            <h2 className="font-noto-serif-sc text-2xl font-bold text-ink mb-6">
              สมัครสมาชิก
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <input
                type="text"
                placeholder="ชื่อของคุณ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-text-muted rounded-md"
              />
              <input
                type="email"
                placeholder="อีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-text-muted rounded-md"
              />
              <input
                type="password"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-text-muted rounded-md"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'กำลังประมวลผล...' : 'สมัครและชำระเงิน'}
              </button>
            </form>

            <p className="mt-4 text-sm text-text-muted text-center">
              มีบัญชีอยู่แล้ว?{' '}
              <button
                onClick={() => setStep('login')}
                className="text-accent-blue hover:underline font-medium"
              >
                เข้าสู่ระบบ
              </button>
            </p>
          </>
        )}

        {step === 'login' && (
          <>
            <h2 className="font-noto-serif-sc text-2xl font-bold text-ink mb-6">
              เข้าสู่ระบบ
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <input
                type="email"
                placeholder="อีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-text-muted rounded-md"
              />
              <input
                type="password"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-text-muted rounded-md"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'กำลังประมวลผล...' : 'เข้าสู่ระบบและชำระเงิน'}
              </button>
            </form>

            <p className="mt-4 text-sm text-text-muted text-center">
              ยังไม่มีบัญชี?{' '}
              <button
                onClick={() => setStep('signup')}
                className="text-accent-blue hover:underline font-medium"
              >
                สมัครที่นี่
              </button>
            </p>
          </>
        )}

        {step === 'qr' && (
          <>
            <h2 className="font-noto-serif-sc text-2xl font-bold text-ink mb-6">
              ชำระเงินด้วย PromptPay
            </h2>

            <div className="bg-gray-200 rounded-lg p-8 mb-6 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="text-6xl mb-2">📱</div>
                <p className="text-sm text-text-muted">QR Code PromptPay</p>
                <p className="font-bold mt-2">฿99.00</p>
              </div>
            </div>

            <button
              onClick={handlePaymentConfirm}
              disabled={loading}
              className="btn-primary w-full mb-2"
            >
              {loading ? 'กำลังยืนยัน...' : 'ฉันชำระเงินแล้ว'}
            </button>

            <button
              onClick={() => setStep('plan')}
              className="w-full px-4 py-2 rounded-md text-text-muted bg-gray-100 hover:bg-gray-200 transition"
            >
              ย้อนกลับ
            </button>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-noto-serif-sc text-2xl font-bold text-ink mb-4">
                ยินดีด้วย!
              </h2>
              <p className="text-text-muted mb-6">
                คุณเป็นสมาชิกแล้ว สามารถเข้าถึง HSK 3-9 ได้ตอนนี้
              </p>
              <div className="text-sm text-text-muted">
                หมดอายุใน: 30 วัน
              </div>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-ink"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
