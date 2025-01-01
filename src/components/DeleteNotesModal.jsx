import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserNotes, deleteFiles } from '../firebase/firestore/firestoreAsyncThunk';
import { useAuth } from '../contexts/AuthContext';



const DeleteNotesModal = ({ deleteMode, deleteNotes, handleDeleteMode, handleAddNote }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const locationIsNotes = window.location.pathname === '/dashboard/notes' ? true : false;
  

  // const [animationClass, setAnimationClass] = useState("");

  // // Handle click outside the modal to trigger closing animation
  // const handleOutsideClick = (e) => {
  //   const targetModal = e.target.closest("modal-overlay");

  //   // Set animation class based on screen size for closing animation
  //   if (!targetModal) {
  //     if (window.innerWidth <= 768) {
  //       setAnimationClass("moveOutBottom");
  //     } else {
  //       setAnimationClass("fadeOut");
  //     }

  //     // After the animation, close the modal
  //     setTimeout(() => {
  //       closeModal(false);
  //     }, 300);
  //   }
  // };

  // // Handle 'Escape' key to close the modal
  // const handleKey = (e) => {
  //   if (e.key === "Escape") {
  //     if (window.innerWidth <= 768) {
  //       setAnimationClass("moveOutBottom");
  //     } else {
  //       setAnimationClass("fadeOut");
  //     }

  //     setTimeout(() => {
  //       closeModal(false);
  //     }, 300);
  //   }
  // };

  // useEffect(() => {
  //   // Attach keydown event when modal is open
  //   // if (showModal) {
  //   //   window.addEventListener("keydown", handleKey);
  //   // }

  //   // Cleanup the event listener and animation class on unmount or close
  //   return () => {
  //     window.removeEventListener("keydown", handleKey);
  //     setAnimationClass("");
  //   };
  // }, []);


  // const handleImportFiles = () => {
  //   setFiles(true);
  //   if (window.innerWidth <= 768) {
  //     setAnimationClass("moveOutBottom");
  //   } else {
  //     setAnimationClass("fadeOut");
  //   }
  //   setTimeout(() => {
  //     closeModal(false);
  //   }, 300);

  // }

  // Delete notes
  const handleDeleteNotes = async () => {
    const noteIds = deleteNotes;

    try {
      // Wait for dispatch to complete
      const result = await dispatch(deleteUserNotes(noteIds)).unwrap();
      console.log(noteIds);
      // Turn off the delete mode
      handleDeleteMode();

      // Close the delete modal
      setShowModal(false);

    } catch (error) {
      console.error('Failed to delete notes:', error);
    }
  };

  // Delete files
  const handleDeleteFiles = async () => {
    const fileIds = deleteNotes;

    try {
      // Wait for dispatch to complete
      const result = await dispatch(deleteFiles({ fileIds, userId: user.uid})).unwrap();
      // Turn off the delete mode
      handleDeleteMode();

      // Close the delete modal
      setShowModal(false);

    } catch (error) {
      console.error('Failed to delete notes:', error);
    }
  };
  // Based on pathname execute a different function when user confirms the deletion 
  const getDeleteHandler = () => {
    if (locationIsNotes) {
      console.log('Executing handleDeleteNotes');
      return handleDeleteNotes; // Return the function reference
    } else {
      console.log('Executing handleDeleteFiles');
      return handleDeleteFiles; // Return the function reference
    }
  };
  
  
  


  const handleDeleteBtn = () => {
    if (!showModal) {
      setShowModal(true);
    }
  }

  return (
    <>
      {deleteMode ? (
        <div className="delete-mode-modal">
          {/* <DeleteNotesModal /> */}
          <button
            type="button"
            onClick={handleDeleteBtn}
            className="delete-notes-btn btn-warning rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" d="M1 3.5h12m-10.5 0h9v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1zm2 0V3a2.5 2.5 0 1 1 5 0v.5m-4 3.001v4.002m3-4.002v4.002" /></svg>
          </button>
          <button
            type="button"
            onClick={handleDeleteMode}
            className="closeNotesDeleteMode btn-primary rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path></svg>
          </button>
        </div>
      ) : (
        <div className="create-new-element">
          <button
            type="button"
            className="note btn-primary rounded"
            style={{ visibility: deleteMode ? "hidden" : "visible" }}
            onClick={handleAddNote}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"></path></svg>
          </button>
        </div>
      )}
      {showModal && deleteNotes.length !== 0 && (
        <div
          className="modal-overlay"
        // onClick={handleOutsideClick}
        // style={{ display: showModal ? "flex" : "none" }}
        >
          <div className={`confirm-delete-modal `}>
            <div className="modal-message">
              <h5>Confirm delete</h5>
              <p className="font-small">Are you sure you want to delete {deleteNotes.length} {locationIsNotes ? 'notes' : 'files'}?</p>
            </div>

            <div className="confirm-delete-actions">
              <button
                type="button"
                onClick={() => getDeleteHandler()()} 
                id="deleteNotesBtn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeDasharray={24} strokeDashoffset={24} strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 11l6 6l10 -10"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"></animate></path></svg>
              </button>
              <button
                type="button"
                onClick={() => { handleDeleteMode(); setShowModal(false); }}
                id="cancelDeleteNotesBtn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"></path></svg>
              </button>


            </div>
          </div>
        </div>
      )}

    </>
  )
};

export default DeleteNotesModal;
