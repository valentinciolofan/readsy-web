import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase/firebaseConfig'; // Adjust path as needed
import saveFileMetadataToFirestore from '../components/saveFileMetadataToFirestore'

const UploadPDF = () => {
    if (!auth.currentUser) {
        console.error("No authenticated user.");
        return;
    }

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [downloadURL, setDownloadURL] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        try {
            const userId = auth.currentUser.uid;
            const storageRef = ref(storage, `pdfs/${userId}/${file.name}`);
            const metadata = {
                contentType: 'pdf',
            };
            // Upload the file
            await uploadBytes(storageRef, file, metadata);

            // Get the download URL
            const url = await getDownloadURL(storageRef);
            setDownloadURL(url);
            saveFileMetadataToFirestore(userId, file.name, downloadURL);
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload PDF'}
            </button>
            {downloadURL && (
                <div>
                    <p>File available at:</p>
                    <a href={downloadURL} target="_blank" rel="noopener noreferrer">
                        {downloadURL}
                    </a>
                </div>
            )}
        </div>
    );
};

export default UploadPDF;
