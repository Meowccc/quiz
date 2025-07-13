import type { Language } from '../types/quiz';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className="language-switcher">
            <button
        className={`language-btn ${currentLanguage === 'cn' ? 'active' : ''}`}
        onClick={() => onLanguageChange('cn')}
      >
        簡
      </button>
      <button
        className={`language-btn ${currentLanguage === 'zh' ? 'active' : ''}`}
        onClick={() => onLanguageChange('zh')}
      >
        繁
      </button>
      <button
        className={`language-btn ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => onLanguageChange('en')}
      >
        英
      </button>
    </div>
  );
} 