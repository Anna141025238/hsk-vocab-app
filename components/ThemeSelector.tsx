'use client';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const THEMES = [
  { id: 'white', name: 'ขาว', c1: '#FBFAF5', c2: '#FBFAF5' },
  { id: 'greige', name: 'เบจ', c1: '#8E8B85', c2: '#8C6A45' },
  { id: 'blue', name: 'น้ำเงิน', c1: '#6E93B5', c2: '#2E2E2E' },
  { id: 'kraft', name: 'คราฟท์', c1: '#8C6A45', c2: '#6E93B5' },
  { id: 'ink', name: 'ดำ', c1: '#2E2E2E', c2: '#8C6A45' },
];

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const handleThemeChange = (themeId: string) => {
    onThemeChange(themeId);
    localStorage.setItem('hskvocab_theme', themeId);
  };

  return (
    <div className="flex items-center gap-3 paper-surface rounded-lg p-4 w-fit mx-auto">
      <span className="text-sm font-medium text-text-muted">พื้นหลัง:</span>
      <div className="flex gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              currentTheme === theme.id
                ? 'border-ink scale-110'
                : 'border-text-muted hover:border-ink'
            }`}
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.c1} 50%, ${theme.c2} 50%)`,
            }}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
}
