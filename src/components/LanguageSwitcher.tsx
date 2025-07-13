import type { Language } from '../types/quiz';
import './LanguageSwitcher.css';

export const supportedLanguages: Language[] = ['cn', 'zh', 'en'];

interface LanguageSwitcherProps {
  currentLanguage: Language;
  availableLanguages: Language[];
  onLanguageChange: (language: Language) => void;
}

const languageLabels: Record<Language, string> = {
  cn: '簡',
  zh: '繁',
  en: '英',
};

export function LanguageSwitcher({ currentLanguage, availableLanguages, onLanguageChange }: LanguageSwitcherProps) {
  // 過濾並排序 availableLanguages，確保順序跟 supportedLanguages 一致
  const orderedLanguages = supportedLanguages.filter(lang => availableLanguages.includes(lang));

  return (
    <div className="language-switcher">
      {orderedLanguages.map(lang => (
        <button
          key={lang}
          className={`language-btn ${currentLanguage === lang ? 'active' : ''}`}
          onClick={() => onLanguageChange(lang)}
          type="button"
        >
          {languageLabels[lang]}
        </button>
      ))}
    </div>
  );
}