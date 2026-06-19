import type { Metadata } from 'next';
import { Noto_Serif_SC, Noto_Serif_Thai, Noto_Serif, Chonburi, Caveat } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-noto-serif-sc',
});

const notoSerifTh = Noto_Serif_Thai({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif-th',
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif',
});

const chonburi = Chonburi({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-chonburi',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  title: 'หมาวม่ิ หนัสยู - คลังคำศัพท์ HSK',
  description: 'ฝึกอ่าน พูด และจำศัพท์ HSK ด้วยแฟลชการ์ดและควิซ',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${notoSerifSC.variable} ${notoSerifTh.variable} ${notoSerif.variable} ${chonburi.variable} ${caveat.variable}`}
    >
      <body className="bg-desk font-noto-serif-th text-ink antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
