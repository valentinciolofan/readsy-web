import React, { useEffect, useState } from "react";


const ImportModal = ({ setFiles, showModal, closeModal }) => {
  const [animationClass, setAnimationClass] = useState("");

  // Handle click outside the modal to trigger closing animation
  const handleOutsideClick = (e) => {
    const targetModal = e.target.closest(".import-file-modal-container");

    // Set animation class based on screen size for closing animation
    if (!targetModal) {
      if (window.innerWidth <= 768) {
        setAnimationClass("moveOutBottom");
      } else {
        setAnimationClass("fadeOut");
      }

      // After the animation, close the modal
      setTimeout(() => {
        closeModal(false);
      }, 300); 
    }
  };

  // Handle 'Escape' key to close the modal
  const handleKey = (e) => {
    if (e.key === "Escape") {
      if (window.innerWidth <= 768) {
        setAnimationClass("moveOutBottom");
      } else {
        setAnimationClass("fadeOut");
      }

      setTimeout(() => {
        closeModal(false);
      }, 300); 
    }
  };

  useEffect(() => {
    // Attach keydown event when modal is open
    if (showModal) {
      window.addEventListener("keydown", handleKey);
    }

    // Cleanup the event listener and animation class on unmount or close
    return () => {
      window.removeEventListener("keydown", handleKey);
      setAnimationClass("");
    };
  }, [showModal]);


  const handleImportFiles = () => {
    setFiles(true);
    if (window.innerWidth <= 768) {
        setAnimationClass("moveOutBottom");
      } else {
        setAnimationClass("fadeOut");
      }
      setTimeout(() => {
        closeModal(false);
      }, 300); 

  }
  return (
    showModal && (
      <div
        className="import-file-modal-overlay"
        onClick={handleOutsideClick}
        style={{ display: showModal ? "flex" : "none" }}
      >
        <div className={`import-file-modal-container ${animationClass}`}>
          <div className="import-file-modal">
            <h5>Upload a file</h5>
            <p className="font-small">Drop a file or click to browse</p>
            <p className="font-small">The extension allowed is .pdf</p>
            <button 
            onClick={handleImportFiles}
            type="button" 
            className="btn-import-file btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#2d2d2d"
                  fillRule="evenodd"
                  d="M7.172 13H6a3 3 0 1 1 0-6c.28 0 .42 0 .517-.02c.298-.06.44-.151.616-.399c.058-.08.14-.262.303-.626a5.001 5.001 0 0 1 9.128 0c.163.364.245.545.303.626c.177.248.318.34.616.4C17.581 7 17.721 7 18 7a3 3 0 1 1 0 6h-1.172l-3.414-3.414L12 8.172l-1.414 1.414z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#2d2d2d"
                  d="m12 12l-.707-.707l.707-.707l.707.707zm1 9a1 1 0 1 1-2 0zm-5.707-5.707l4-4l1.414 1.414l-4 4zm5.414-4l4 4l-1.414 1.414l-4-4zM13 12v9h-2v-9z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ImportModal;
