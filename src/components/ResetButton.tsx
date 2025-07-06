import './ResetButton.css';

interface ResetButtonProps {
  onClick: () => void;
}

export function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button className="reset-btn" onClick={onClick} title="重新開始">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
      </svg>
    </button>
  );
}
