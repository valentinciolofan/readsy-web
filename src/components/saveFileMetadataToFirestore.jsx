import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Adjust the import path

const saveFileMetadataToFirestore = async (userId, fileName, downloadURL) => {
  try {
    const userFilesCollection = collection(db, 'userFiles');
    await addDoc(userFilesCollection, {
      userId,
      fileName,
      downloadURL,
      uploadedAt: new Date()
    });
    console.log('File metadata saved successfully');
  } catch (error) {
    console.error('Error saving file metadata:', error);
  }
};
