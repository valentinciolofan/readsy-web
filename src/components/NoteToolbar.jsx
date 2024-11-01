import React from 'react';

const NoteToolbar = ({ toolbarBtnRef, toolbarPosition, activeButton, setActiveButton }) => {
  // Toggle Toolbar Formatting Option
  const toggleMark = (event, action) => {
    setActiveButton(action);
    toolbarBtnRef.current = action;
  };

  return (
    <div className="note-toolbar" style={{ top: toolbarPosition.top, left: toolbarPosition.left }}>
      {/* Bold Button */}
      <button
        onClick={(e) => toggleMark(e, 'bold')}
        className={activeButton === 'bold' ? 'active' : ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"></path>
        </svg>
      </button>

      {/* Text Button */}
      <button
        onClick={(e) => toggleMark(e, 'text')}
        className={activeButton === 'text' ? 'active' : ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <g fill="none">
            <path fill="currentColor" fillRule="evenodd" d="M7.934 2h8.132c.886 0 1.65 0 2.262.082c.655.088 1.284.287 1.793.797c.51.51.709 1.138.797 1.793C21 5.284 21 6.048 21 6.934V7.95a1 1 0 1 1-2 0V7c0-.971-.002-1.599-.064-2.061c-.059-.434-.153-.57-.229-.646s-.212-.17-.646-.229C17.6 4.002 16.971 4 16 4h-3v17a1 1 0 1 1-2 0V4H8c-.971 0-1.599.002-2.061.064c-.434.059-.57.153-.646.229s-.17.212-.229.646C5.002 5.4 5 6.029 5 7v.95a1 1 0 1 1-2 0V6.934c0-.886 0-1.65.082-2.262c.088-.655.287-1.284.797-1.793c.51-.51 1.138-.709 1.793-.797C6.284 2 7.048 2 7.934 2" clipRule="evenodd"></path>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10"></path>
          </g>
        </svg>
      </button>

      {/* Italic Button */}
      <button
        onClick={(e) => toggleMark(e, 'italic')}
        className={activeButton === 'italic' ? 'active' : ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6h2m2 0h-2m0 0l-4 12m0 0H8m2 0h2"></path>
            <path d="M3 20.4V3.6a.6.6 0 0 1 .6-.6h16.8a.6.6 0 0 1 .6.6v16.8a.6.6 0 0 1-.6.6H3.6a.6.6 0 0 1-.6-.6Z"></path>
          </g>
        </svg>
      </button>

      {/* H1 Button */}
      <button
        onClick={(e) => toggleMark(e, 'h1')}
        className={activeButton === 'h1' ? 'active' : ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M11 7h2v10h-2v-4H7v4H5V7h2v4h4zm6.57 0A4.74 4.74 0 0 1 15 9v1h2v7h2V7z"></path>
        </svg>
      </button>

      {/* H2 Button */}
      <button
        onClick={(e) => toggleMark(e, 'h2')}
        className={activeButton === 'h2' ? 'active' : ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9 7h2v10H9v-4H5v4H3V7h2v4h4zm8 8c.51-.41.6-.62 1.06-1.05q.656-.601 1.23-1.28a6.4 6.4 0 0 0 .85-1.28c.199-.39.305-.822.31-1.26a3 3 0 0 0-.27-1.28a2.9 2.9 0 0 0-.76-1a3.5 3.5 0 0 0-1.17-.63a4.8 4.8 0 0 0-1.5-.22q-.54 0-1.07.1a5 5 0 0 0-1 .29a4.4 4.4 0 0 0-.86.49q-.431.315-.82.68l1.24 1.22a6 6 0 0 1 1-.7c.35-.201.747-.304 1.15-.3a1.9 1.9 0 0 1 1.27.38c.311.278.477.684.45 1.1a2.13 2.13 0 0 1-.36 1.11a7 7 0 0 1-1 1.25c-.44.43-.98.92-1.59 1.43S13.75 15.11 13 15.7V17h8v-2z"></path>
        </svg>
      </button>

      {/* Underline Button */}
      <button
        onClick={(e) => toggleMark(e, 'underline')}
        className={activeButton === 'underline' ? 'active' : ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"></path>
        </svg>
      </button>
    </div>
  );
};

export default NoteToolbar;
