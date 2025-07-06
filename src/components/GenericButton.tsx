import './GenericButton.css';

interface GenericButtonProps {
    color?: 'primary' | 'danger' | 'success' | 'default',
    onClick: () => void,
    text: string
}

export const GenericButton = ({ onClick, color, text }: GenericButtonProps) => {
    return (
        <div className="generic-btn-container">
            <button onClick={onClick} className={`generic-btn ${color}`}>{text}</button>
        </div>
    )
}