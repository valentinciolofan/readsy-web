import React, { useState } from 'react';

const ReadsyPartner = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseOut = () => setIsHovered(false);
    const handleToggleNavbar = (e) => {
        const targetElement = e.target.closest('.dashboard-menu');
        targetElement.classList.add('toggleMenu');
    }

    const handleNavigation = (path) => {
        navigate(path);
    }

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    }
    return (
        <div className='dashboard-'
            onMouseOver={handleMouseEnter}
            onMouseLeave={handleMouseOut}>
            <div className="dashboard-menu-container">
                <button onClick={handleToggleNavbar} type="button" className="toggleBtn"
                    style={{ visibility: isHovered ? 'visible' : 'hidden' }}><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M24 36L12 24l12-12m12 24L24 24l12-12"></path></svg></button>
            </div>
        </div>


    );
}

export default ReadsyPartner;