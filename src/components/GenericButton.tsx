import './GenericButton.css';

interface GenericButtonProps {
    color?: 'primary' | 'danger' | 'success' | 'default',
    onClick: () => void,
    text: string,
    disabled?: boolean
}

export const GenericButton = ({ onClick, color, text, disabled }: GenericButtonProps) => {
    return (
        <div className="generic-btn-container">
            <button disabled={disabled} onClick={onClick} className={`generic-btn ${color}`}>{text}</button>
        </div>
    )
}