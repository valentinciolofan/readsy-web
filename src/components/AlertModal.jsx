import React, { useState } from "react";

const AlertModal = ({ message }) => {
    const [openAlert, setOpenAlert] = useState(true)

    // Close alert modal
    const closeAlert = () => {
        setOpenAlert(!openAlert);
    }

    return (
        // style={{display: openAlert ? 'block' : 'none'}}
        <div id="customAlert" class="alert-overlay" >
            <div className="alert-box">
                <div className="alert-box-content">
                    <svg className="alert-box-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m0 2c-1.9 0-3.6.6-4.9 1.7l11.2 11.2c1-1.4 1.7-3.1 1.7-4.9c0-4.4-3.6-8-8-8m4.9 14.3L5.7 7.1C4.6 8.4 4 10.1 4 12c0 4.4 3.6 8 8 8c1.9 0 3.6-.6 4.9-1.7"></path></svg>
                    <p id="alertMessage" className="font-medium">{message}</p>
                </div>
                <button onClick={closeAlert} className="btn-close-alert"><svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"></path></svg></button>
            </div>
        </div>

    );
}

export default AlertModal;