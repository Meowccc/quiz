import './SettingsButton.css';

interface ResetButtonProps {
  onClick: () => void;
}

export const ResetButton = ({ onClick }: ResetButtonProps) => {
    return (
        <button className="settings-btn" onClick={onClick} title="重設">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-5.4L1 10" />
            </svg>
        </button>
    )
}
