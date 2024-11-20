import React, { useEffect, useState } from "react";


const DeleteNotesModal = () => {
  const [animationClass, setAnimationClass] = useState("");

  // Handle click outside the modal to trigger closing animation
  const handleOutsideClick = (e) => {
    const targetModal = e.target.closest("modal-overlay");

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
    // if (showModal) {
    //   window.addEventListener("keydown", handleKey);
    // }

    // Cleanup the event listener and animation class on unmount or close
    return () => {
      window.removeEventListener("keydown", handleKey);
      setAnimationClass("");
    };
  }, []);


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
    // showModal && (
    <div
      className="modal-overlay"
      onClick={handleOutsideClick}
    // style={{ display: showModal ? "flex" : "none" }}
    >
      <div className={`confirm-delete-modal ${animationClass}`}>
        <div className="modal-message">
          <h5>Confirm delete</h5>
          <p className="font-small">Are you sure you want to delete 34 notes?</p>
        </div>

        <div className="confirm-delete-actions">
          <button
            type="button"
            onClick={() => console.log('check')}
            id="deleteNotesBtn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeDasharray={24} strokeDashoffset={24} strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 11l6 6l10 -10"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"></animate></path></svg>
          </button>
          <button
            type="button"
            onClick={() => console.log('close')}
            id="cancelDeleteNotesBtn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"></path></svg>
          </button>

        </div>
      </div>
    </div>
  )
  //   );
};

export default DeleteNotesModal;
