import React from "react";

const Header = ({ handleOpenModal }) => {

    return (
        <header className="landing-page-header">
            <div>
                <a href="/">
                    <img src="src/assets/images/logo-white.svg" className="auth-readsy-logo" alt="Logo" />
                </a>
            </div>
            <div className="header-cta-btn">
                <button 
                type="button" 
                className="btn-primary full font-normal"
                onClick={handleOpenModal}>
                    Sign Up
                </button>
            </div>
        </header>
    );
}

export default Header;