import React from "react";
import { useParams, useNavigate } from 'react-router-dom';


const Note = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const goBack = () => {
      navigate(-1); 
    };
  
    return (
        <>
            <div className="note-container">
                <div className="note-header">
                    <button type="button" className="btnBack" onClick={goBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"></path></svg>
                    </button>
                    <h1>The intelligent Investor</h1>
                </div>
            </div>
        </>
    );
};

export default Note;