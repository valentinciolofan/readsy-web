import React from 'react';

const PDFbuttons = ({
    handleZoomIn,
    handleZoomOut,
    handleReadAloud,
    handlePause,
    ttsStatus,
    isPaused,
}) => (
    <>
        <button type="button" className="pdf-zoomOut" onClick={handleZoomOut}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13H5v-2h14z" />
            </svg>
        </button>
        <button type="button" className="pdf-zoomIn" onClick={handleZoomIn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"></path>
            </svg>
        </button>
        <button type="button" onClick={handleReadAloud}>
            {ttsStatus ? 'Stop' : 'Read Aloud'}
        </button>
        <button type="button" onClick={handlePause}>
            {isPaused ? 'Resume' : 'Pause'}
        </button>
    </>
);

export default PDFbuttons;
