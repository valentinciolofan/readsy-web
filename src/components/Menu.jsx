import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig'

const Menu = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
        <div className='dashboard-menu'
            onMouseOver={handleMouseEnter}
            onMouseLeave={handleMouseOut}>
            <div className="dashboard-menu-container">
                <button onClick={handleToggleNavbar} type="button" className="toggleBtn"
                    style={{ visibility: isHovered ? 'visible' : 'hidden' }}><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M24 36L12 24l12-12m12 24L24 24l12-12"></path></svg></button>
                <img src="src/assets/images/logo-white.svg" alt="Readsy Logo" />
                <nav className='navigation-menu'>
                    <div className="nav-container">
                        <button className={`nav-link ${isActive('/dashboard')}`} onClick={() => handleNavigation('/dashboard')} ><svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 21V9l8-6l8 6v12h-6v-7h-4v7z" /></svg>Home</button>
                        <button className={`nav-link ${isActive('/dashboard/profile')}`} onClick={() => handleNavigation('/dashboard/profile')} ><svg xmlns="http://www.w3.org/2000/svg" width='2.5em' height='2.5em' viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinejoin="round" d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"></path><circle cx={12} cy={7} r={3}></circle></g></svg>Profile</button>
                        <button className={`nav-link ${isActive('/dashboard/notes')}`} onClick={() => handleNavigation('/dashboard/notes')} ><svg className="svgba" xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24"><path fill="currentColor" d="m18.13 12l1.26-1.26c.44-.44 1-.68 1.61-.74V9l-6-6H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h6v-1.87l.13-.13H5V5h7v7zM14 4.5l5.5 5.5H14zm5.13 9.33l2.04 2.04L15.04 22H13v-2.04zm3.72.36l-.98.98l-2.04-2.04l.98-.98c.19-.2.52-.2.72 0l1.32 1.32c.2.2.2.53 0 .72"></path></svg>Notes</button>
                        <button className={`nav-link ${isActive('/dashboard/chat')}`} onClick={() => handleNavigation('/dashboard/chat')} ><svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} color="currentColor"><path d="M14.17 20.89c4.184-.277 7.516-3.657 7.79-7.9c.053-.83.053-1.69 0-2.52c-.274-4.242-3.606-7.62-7.79-7.899a33 33 0 0 0-4.34 0c-4.184.278-7.516 3.657-7.79 7.9a20 20 0 0 0 0 2.52c.1 1.545.783 2.976 1.588 4.184c.467.845.159 1.9-.328 2.823c-.35.665-.526.997-.385 1.237c.14.24.455.248 1.084.263c1.245.03 2.084-.322 2.75-.813c.377-.279.566-.418.696-.434s.387.09.899.3c.46.19.995.307 1.485.34c1.425.094 2.914.094 4.342 0"></path><path d="m7.5 15l1.842-5.526a.694.694 0 0 1 1.316 0L12.5 15m3-6v6m-7-2h3"></path></g></svg>Chat</button>
                        <button className={`nav-link ${isActive('/dashboard/settings')}`} onClick={() => handleNavigation('/dashboard/settings')} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24"><path fill="currentColor" d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"></path></svg>Settings</button>
                    </div>
                </nav>
                <div className='user-avatar-and-name'>
                    <svg xmlns="http://www.w3.org/2000/svg" width='4em' height='4em' viewBox="0 0 24 24"><g fill="none" stroke="purple" strokeWidth={2}><path strokeLinejoin="round" d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"></path><circle cx={12} cy={7} r={3}></circle></g></svg>
                    <p className='font-normal'>John Doe</p>
                </div>
            </div>
        </div>
    );
}


export default Menu;