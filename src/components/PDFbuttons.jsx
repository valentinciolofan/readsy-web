import React from 'react';

const PDFbuttons = ({
    handleZoomIn,
    handleZoomOut,
    handleReadAloud,
    handlePause,
    ttsStatus,
    isPaused,
    totalPages, 
    pageIndex,
    handlePageIndex
}) => (
    <div className="control-pdf-buttons">
        <div className="increase-decrease-viewer">
            <button type="button" className="pdf-zoomOut" onClick={handleZoomOut}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 13H5v-2h14z" />
                </svg>
            </button>
            <span className="current-pdf-scale">25%</span>
            <button type="button" className="pdf-zoomIn" onClick={handleZoomIn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"></path>
                </svg>
            </button>
        </div>


        <div className="show-page-index">
            <button
                className="btnPdfPreviousPage"

            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m15 4l2 2l-6 6l6 6l-2 2l-8-8z" /></svg>
            </button>
            <label htmlFor="pageJump" 
            className="current-page-index-container">
                <input
                    className="show-current-page-index"
                    type="number"
                    name="pageJump"
                    value={pageIndex}
                    onChange={handlePageIndex} 
                     />
                <span>/ {totalPages}</span>
            </label>

            {/* <button
                type="button"
                // onClick={() => scrollToPage(pageIndex)}
                className="btnJumpToIndex">
                Jump
            </button> */}
            <button
                className="btnPdfNextPage"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m9 6l6 6l-6 6" /></svg>

            </button>
        </div>

        <button
            type="button"
            onClick={handleReadAloud}
            className="btnReadPDF"
        >
            {ttsStatus ? 'Stop' : 'Read Aloud'}
        </button>
        <button
            type="button"
            onClick={handlePause}
            className="btnPausePDF"
        >
            {isPaused ? 'Resume' : 'Pause'}
        </button>
    </div>
);

export default PDFbuttons;
