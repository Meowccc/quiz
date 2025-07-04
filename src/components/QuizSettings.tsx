import type { QuizSettings } from '../types/quiz';
import './QuizSettings.css';

interface QuizSettingsProps {
  settings: QuizSettings;
  onSettingsChange: (settings: Partial<QuizSettings>) => void;
}

export function QuizSettings({ settings, onSettingsChange }: QuizSettingsProps) {
  return (
    <div className="quiz-settings">
      <h3>答題設定</h3>
      
      <div className="setting-item">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={settings.randomOrder}
            onChange={(e) => onSettingsChange({ randomOrder: e.target.checked })}
          />
          <span>隨機順序作答</span>
        </label>
        <p className="setting-description">
          題目和選項會隨機排序，增加答題挑戰性
        </p>
      </div>

      <div className="setting-item">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={settings.showAnswerImmediately}
            onChange={(e) => onSettingsChange({ showAnswerImmediately: e.target.checked })}
          />
          <span>立即顯示答案</span>
        </label>
        <p className="setting-description">
          答題後立即顯示正確答案和解釋
        </p>
      </div>
    </div>
  );
} 