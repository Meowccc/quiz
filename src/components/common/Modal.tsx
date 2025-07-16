import React from 'react';

interface ModalProps {
    children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
    return (
        <div className="settings-modal-backdrop" >
            <div className="settings-modal">
                {children}
            </div>
        </div>
    )
}

export default Modal;