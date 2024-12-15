import React, { useState, useEffect, useRef } from 'react';

const NotesMenu = ({ onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null); // Reference to the dropdown container

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false); // Close the dropdown if clicked outside
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="dropdown-container" ref={menuRef}>
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
                    <button className="dropdown-item nav-link" onClick={onDelete}>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotesMenu;
