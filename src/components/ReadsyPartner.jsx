import React, { useState } from 'react';

const ReadsyPartner = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseOut = () => setIsHovered(false);
    const handleToggleNavbar = (e) => {
        const targetElement = e.target.closest('.readsy-gpt');
        targetElement.classList.add('toggleReadsy');
    }


    return (
        <aside className="readsy-gpt"
            onMouseOver={handleMouseEnter}
            onMouseLeave={handleMouseOut}>
            <button onClick={handleToggleNavbar} type="button" className="toggleBtn readsy"
                style={{ visibility: isHovered ? 'visible' : 'hidden' }}><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M24 36L12 24l12-12m12 24L24 24l12-12"></path></svg></button>

            <div className='readsy-avatar-and-name'>
                <img src='/src/assets/images/readsy.svg' alt="readsy" />
                <p className='font-normal'>Readsy</p>
            </div>

            <div className="readsy-conversation">
                <div className="readsy-message">
                    <p className='font-medium'>Hello, what can i do for you?Hello, what can i do for you?Hello, what can i do for you?Hello, what can i do for you?Hello, what can i do for you?Hello, what can i do for you?Hello, what can i do for you?Hello, what can i do for you?</p>
                </div>

                <div className='user-message-to-readsy'>
                    <p className='font-medium'>Hello, what can i do for you?Hello, what can i do for you?Hello, what can i do for you?Hello, what can i do for you?Hello, what can i do for you?Hello, what can i do for you?Hello, what can i do for you?Hello, what can i do for you?</p>
                </div>

            </div>

            <div className="readsy-input-box-container">
                <input
                    type="search"
                    placeholder="Ask me something"
                    className="readsy-input-box" />
                <svg className="readsy-input-box-icon" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m7 9c0 3.53-2.61 6.44-6 6.93V21h-2v-3.07c-3.39-.49-6-3.4-6-6.93h2a5 5 0 0 0 5 5a5 5 0 0 0 5-5z"></path></svg>
            </div>

        </aside>
    );
}

export default ReadsyPartner;