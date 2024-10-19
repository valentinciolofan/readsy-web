import React from 'react';
import { auth } from '../firebase/firebaseConfig';

const Profile = () => {
    return (
        <div class="main-container">
            <div className="user-info-card">
                <div className="user-info-col-1">
                    <div className="user-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3.75em" height="3.75em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"></path></svg>
                    <p className='font-normal'>John Doe</p>
                    </div>
                    <div className="user-information">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"></path></svg>
                            <p className='font-small'>Email: valentincatalin02@gmail.com</p>
                        </span>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"></path></svg>
                            <p className='font-small'>Phone: +40723572873</p>
                        </span>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g className="calendar-outline"><g fill="currentColor" className="Vector"><path fillRule="evenodd" d="M6 4h12a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" clipRule="evenodd"></path><path fillRule="evenodd" d="M3 10a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m5-8a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1" clipRule="evenodd"></path><path d="M8 13a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m5-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m5-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0"></path></g></g></svg>
                            <p className='font-small'>Joined: 24 July 2023</p>
                        </span>

                    </div>
                </div>
                <button type="button" className='btnLogOut'><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 64 64"><path fill="currentColor" d="M45.2 1.8H33.9c-2.6 0-4.8 2.2-4.8 4.8v6.9c0 1.2 1 2.2 2.2 2.2s2.3-1 2.3-2.2v-7q0-.3.3-.3h11.3c2.4 0 4.3 1.9 4.3 4.3v42.9c0 2.4-1.9 4.3-4.3 4.3H33.9q-.3 0-.3-.3v-6.9c0-1.2-1-2.2-2.3-2.2s-2.2 1-2.2 2.2v6.9c0 2.6 2.2 4.8 4.8 4.8h11.3c4.9 0 8.8-4 8.8-8.8V10.6c0-4.9-4-8.8-8.8-8.8"></path><path fill="currentColor" d="M17.6 34.2h17.9c1.2 0 2.2-1 2.2-2.2s-1-2.2-2.2-2.2H17.7l6.2-6.3c.9-.9.9-2.3 0-3.2s-2.3-.9-3.2 0l-10 10.2c-.9.9-.9 2.3 0 3.2l10 10.2c.4.4 1 .7 1.6.7s1.1-.2 1.6-.6c.9-.9.9-2.3 0-3.2z"></path></svg> Log Out</button>
            </div>
        </div>
    );
}

export default Profile;