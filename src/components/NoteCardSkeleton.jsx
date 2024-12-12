import React from 'react';

// This component serves as placeholder for each note card till the notes are fully fetched.
const NoteCardSkeleton = () => {
    const nrOfCards = 10;

    return (
        <>
            {Array.from({ length: nrOfCards }).map((_, index) => (
                <label
                    key={index} // Provide a unique key for each card
                    className={`note-card-skeleton ${index % 2 === 0 ? '' : 'reversedBorder'}`}
                >
                    <div className="note-card-header">
                        <span className="note-card-title-skeleton font-normal bold">This is a title</span>

                        <button
                            type="button"
                            className="note-card-btn favorite"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill='none' stroke="currentColor" strokeWidth={1} d="m4.45 13.908l6.953 6.531c.24.225.36.338.5.366a.5.5 0 0 0 .193 0c.142-.028.261-.14.5-.366l6.953-6.53a5.203 5.203 0 0 0 .549-6.983l-.31-.399c-1.968-2.536-5.918-2.111-7.301.787a.54.54 0 0 1-.974 0C10.13 4.416 6.18 3.99 4.212 6.527l-.31.4a5.203 5.203 0 0 0 .549 6.981Z"></path></svg>
                        </button>
                    </div>
                    <span className="note-card-description-skeleton font-small">Here is the description</span>
                </label>
            ))}
        </>
    );
};

export default NoteCardSkeleton;
