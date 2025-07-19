import { useState } from 'react';
import Modal from './Modal';


const CoffeeButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (bool: boolean) => {
        setIsOpen(bool);
    }

    return (
        <div style={{
            margin: '20px',
        }}>
            {isOpen &&
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000,
                    }}
                    onClick={() => handleClick(false)}
                >
                    <Modal >
                        <div style={
                            {
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                padding: '20px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }
                        }>
                            <h3 style={{
                                color: 'black',
                            }}>謝謝你的心意，我心領了 <br /> 祝考試順利 </h3>
                        </div>
                    </Modal>
                </div>
            }

            <button
                onClick={() => handleClick(true)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                }}
            >
                <img
                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                    alt="Buy Me A Coffee"
                    style={{
                        height: '60px',
                        width: '217px',
                    }}
                />
            </button>
        </div>
    )
}

export default CoffeeButton;