import React, { useRef } from 'react';
import { use } from 'react';

const PDFbuttons = ({
    scalePdf,
    handleZoomIn,
    handleZoomOut,
    handleReadAloud,
    handlePause,
    ttsStatus,
    isPaused,
    totalPages,
    pageIndex,
    setPageIndex,
    scrollToPage,
    handlePageIndex
}) => {
    const handlePreviousPage = () => {
        const newPageIndex = Math.max(pageIndex - 1, 1);
        scrollToPage(newPageIndex);
    }


    const handleNextPage = () => {
        const newPageIndex = Math.min(pageIndex + 1, totalPages); 
        scrollToPage(newPageIndex);
    }

    return (
        <div className="control-pdf-buttons">
            <div className="increase-decrease-viewer">
                <button type="button" className="pdf-zoomOut" onClick={handleZoomOut}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 13H5v-2h14z" />
                    </svg>
                </button>
                <span className="current-pdf-scale">{scalePdf * 100}%</span>
                <button type="button" className="pdf-zoomIn" onClick={handleZoomIn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"></path>
                    </svg>
                </button>
            </div>


            <div className="show-page-index">
                <button
                    className="btnPdfPreviousPage"
                    onClick={handlePreviousPage}
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
                    <span>/</span>
                    <span>{totalPages}</span>
                </label>
                <button
                    className="btnPdfNextPage"
                    onClick={handleNextPage}
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
}

export default PDFbuttons;
