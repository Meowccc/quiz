import { useEffect } from 'react';
import type { QuizSettings } from '../types/quiz';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  settings: QuizSettings;
  onSettingsChange: (settings: Partial<QuizSettings>) => void;
  onClose: () => void;
}

export function SettingsModal({ isOpen, settings, onSettingsChange, onClose }: SettingsModalProps) {
  // 點擊背景關閉彈窗
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC 鍵關閉彈窗
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 防止背景滾動
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="settings-modal-backdrop" onClick={handleBackdropClick}>
      <div className="settings-modal">
        <div className="settings-modal-header">
          <h3>答題設定</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="settings-modal-content">

          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.showAnswerImmediately}
                onChange={(e) => onSettingsChange({ showAnswerImmediately: e.target.checked })}
              />
              <span>立即顯示答案</span>
              <span style={{color: 'red' }}>(作答中也可變更)</span>
            </label>
            <p className="setting-description">
              答題後立即顯示正確答案和解釋，否則需完成題目後才會顯示
            </p>
          </div>
        </div>

        <div className="settings-modal-footer">
          <button className="save-btn" onClick={onClose}>
            確定
          </button>
        </div>
      </div>
    </div>
  );
} 