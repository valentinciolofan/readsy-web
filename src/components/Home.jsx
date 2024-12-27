import React, { useState, useEffect, useMemo } from "react";
import ImportModal from '../components/ImportModal';
import PdfViewer from "./PdfViewer";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { uploadFiles, fetchFiles, deleteFiles } from '../firebase/firestore/firestoreAsyncThunk'
import { useAuth } from '../contexts/AuthContext';
import SearchBar from "./SearchBar";
import NotesMenu from "./NotesMenu";
import DeleteNotesModal from "./DeleteNotesModal";


const Home = () => {
    const [file, setFile] = useState(false);
    const [importModal, setImportModal] = useState(true);
    const [deleteMode, setDeleteMode] = useState(false);
    const [deleteFiles, setDeleteFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { user, uid } = useAuth();
    const dispatch = useDispatch();
    const { files, loading, error, fetched } = useSelector((state) => state.files);
    const navigate = useNavigate();

    // Search feature
    const filteredFiles = useMemo(() => {
        return files.filter((file) =>
            file.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, files]);

    console.log(filteredFiles);
    const userId = uid;
    useEffect(() => {
        if (userId && !fetched) {
            const x = dispatch(fetchFiles(userId));
            console.log(x);
        }
    }, [dispatch, userId, fetched, files]);

    const handlePDFClick = (file) => {
        navigate(`/dashboard/readpdf/${file.name}`, { state: { pdfUrl: file.url } });
    }

    const handleImport = () => {
        setImportModal(true);
    }

    const handleSelectedFiles = (fileId) => {
        setDeleteFiles(prev =>
            prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
        );
    };

    // Select all / deselect all notes when in delete mode
    const handleSelectAll = (inputCheckbox) => {
        if (inputCheckbox.target.checked) {
            const allNotesId = files.map(note => note.id);
            setDeleteFiles(allNotesId);
            console.log(deleteFiles)
        } else {
            setDeleteFiles([]);
        }
    };



    // Turn on/off delete notes mode
    const handleDeleteMode = () => {
        // When user turns off the delete mode, clear the deleteNotes state
        if (deleteMode) {
            setTimeout(setDeleteFiles([]), 500);
        }
        setDeleteMode(!deleteMode);
    }


    return (
        <>
            {/* if there are files imported, show them, if not, the user will see the import state */}
            {files ? (
                <div className="main-container">
                    <h3>All documents</h3>
                    <div className="search-and-import">
                        {deleteMode ? (
                            <label
                                for="select-all-notes">
                                <input
                                    id="select-all-notes"
                                    type="checkbox"
                                    className="custom-checkbox"
                                    onChange={handleSelectAll}
                                />
                                <span className="checkbox-custom-checkmark"></span>
                                Select all
                            </label>

                        ) : (
                            <>
                                <SearchBar
                                    searchValue={searchTerm}
                                    onSearchChange={setSearchTerm}
                                />

                                <div>
                                    <NotesMenu onDelete={handleDeleteMode} />
                                </div>
                            </>
                        )}
                    </div>
                    {/* grid for files */}
                    <div className="dashboard-all-uploaded-files">
                        {filteredFiles.map(file =>
                            <label
                                data-id={file.id}
                                className={`book ${deleteMode ? 'unselected' : ''}`}
                                style={{ opacity: deleteFiles.includes(file.id) ? '1' : '' }}
                                onClick={(e) => handlePDFClick(file)}
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="3.75em" height="3.75em" viewBox="0 0 32 32"><path fill="#909090" d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z"></path><path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z"></path><path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z"></path><path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z"></path><path fill="#464648" d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892"></path><path fill="#dd2025" d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035"></path><path fill="#909090" d="M23.954 2.077V7.95h5.633z"></path><path fill="#f4f4f4" d="M24.031 2v5.873h5.633z"></path><path fill="#fff" d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892"></path></svg>
                                <div className="file-title-and-info">
                                    <p className="font-small bold">{file.name}</p>
                                </div>
                                {deleteMode && (
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        className="custom-checkbox"
                                                        value={file.id}
                                                        checked={deleteFiles.includes(file.id)}
                                                        onChange={() => handleSelectedFiles(file.id)}
                                                    />
                                                    <span className="checkbox-custom-checkmark"></span>
                                                </>
                                )}
                            </label>)}
                    </div>
                    <DeleteNotesModal
                        deleteMode={deleteMode}
                        deleteNotes={deleteFiles}
                        handleDeleteMode={handleDeleteMode}
                        handleAddNote={handleImport}
                    />
                </div>

            ) : (

                <div className="dashboard-zero-files">
                    <h3>It seems that you don’t have any imported files.</h3>
                    <button
                        type='button'
                        className="btn-primary"
                        onClick={handleImport}
                    >Import</button>
                </div>
            )}
            {importModal && (
                <ImportModal
                    setFile={setFile}
                    showModal={importModal}
                    closeModal={setImportModal} />
            )}
        </>
    );
};

export default Home;