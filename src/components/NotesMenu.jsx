import React, { useState } from 'react';

const NotesMenu = ({ onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="dropdown-container">
            {/* SVG Button */}
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="none"
                        stroke="#909090"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                        d="M12 5.92A.96.96 0 1 0 12 4a.96.96 0 0 0 0 1.92m0 7.04a.96.96 0 1 0 0-1.92a.96.96 0 0 0 0 1.92M12 20a.96.96 0 1 0 0-1.92a.96.96 0 0 0 0 1.92"
                    />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="dropdown-menu">
                    <button className="dropdown-item"
                     onClick={onDelete}
                     >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotesMenu;
