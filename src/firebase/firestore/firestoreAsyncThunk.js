import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, addDoc, getDoc, getDocs, query, where, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from '../firebaseConfig';

// Fetch notes
export const fetchUserNotes = createAsyncThunk(
  'notes/fetchUserNotes',
  async (userId, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "notes"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const notes = [];
      querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() });
      });

      return notes;
    } catch (error) {
      console.error("Error fetching notes:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Add a note
export const addUserNote = createAsyncThunk(
  'notes/addUserNote',
  async ({ userId, note }, { rejectWithValue }) => {
    try {
      console.log('idk::', userId);
      console.log(note);
      if (!userId) {
        console.error('User ID is missing');
        return rejectWithValue('User ID is missing');
      }
      console.log('Adding note with user ID:', userId);

      const noteRef = await addDoc(collection(db, 'notes'), { userId, ...note });
      console.log('Note added with ID:', noteRef.id);

      return { id: noteRef.id, ...note };
    } catch (error) {
      console.error('Error adding note:', error.message);
      return rejectWithValue(error.message);
    }
  }
);


// Edit a note
export const editUserNote = createAsyncThunk(
  'notes/editUserNote',
  async ({ noteId, note }, { rejectWithValue }) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, note);
      console.log('Updated note in Firestore:', { id: noteId, ...note });
      return { id: noteId, ...note }; // Ensure this structure includes id
    } catch (error) {
      console.error('Error updating note:', error.message);
      return rejectWithValue(error.message);
    }
  }
);


// Delete one or multiple notes
export const deleteUserNotes = createAsyncThunk(
  'notes/deleteUserNotes',
  async (noteIds, { rejectWithValue }) => {
    try {
      const batch = writeBatch(db); // Correct usage of batch
      noteIds.forEach((noteId) => {
        const noteRef = doc(db, 'notes', noteId); // Correct doc reference
        batch.delete(noteRef);
      });
      await batch.commit(); // Commit the batch
      return noteIds; // Return the deleted note IDs for the reducer
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  }
);


/* ###########
*** Logic for file/files uploading/storing inside Firestore DB.
   ########### */
/* ===== Upload Files Thunk ===== */
export const uploadFiles = createAsyncThunk(
  "files/uploadFiles",
  async ({ files, userId }, { rejectWithValue }) => {
    try {
      console.log("Starting uploadFiles thunk...");
      console.log("Files to upload:", files);
      console.log("User ID:", userId);

      const uploadedFiles = [];

      // Loop through the files and upload them
      for (const file of files) {
        console.log("Processing file:", file.name);

        try {
          // Create a unique file name to avoid overwrites (optional)
          const uniqueFileName = `${Date.now()}_${file.name}`;
          console.log("Generated unique file name:", uniqueFileName);

          // File path in Cloud Storage
          const filePath = `pdfs/${userId}/${uniqueFileName}`;
          console.log("File path:", filePath);

          const storageRef = ref(storage, filePath);

          // Upload the file to Cloud Storage
          console.log(`Uploading file "${file.name}" to Storage...`);
          await uploadBytes(storageRef, file);
          console.log(`File "${file.name}" successfully uploaded.`);

          // Get the download URL for the file
          const downloadURL = await getDownloadURL(storageRef);
          console.log(`Download URL for "${file.name}":`, downloadURL);

          // Save metadata in Firestore
          console.log("Saving file metadata to Firestore...");
          const docRef = await addDoc(collection(db, "pdfFiles"), {
            userId: userId, // Link the file to the user
            name: uniqueFileName, // Store the unique file name
            originalName: file.name, // Optionally store the original name
            url: downloadURL, // Save the download URL
            uploadedAt: new Date().toISOString(), // Timestamp for upload
          });
          console.log("Metadata saved in Firestore with ID:", docRef.id);

          // Push the uploaded file's metadata into the array
          uploadedFiles.push({
            id: docRef.id,
            name: uniqueFileName, // Unique name in Firestore
            originalName: file.name, // Original name
            url: downloadURL,
          });
        } catch (fileError) {
          console.error(`Error processing file "${file.name}":`, fileError);
        }
      }

      console.log("All files processed. Uploaded files:", uploadedFiles);
      return uploadedFiles; // Return all uploaded file references
    } catch (error) {
      console.error("Error in uploadFiles thunk:", error.message);
      return rejectWithValue(error.message);
    }
  }
);



/* ===== Fetch Files Thunk ===== */
export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (userId, { rejectWithValue }) => {
    console.log("Fetching files for userId:", userId);
    try {
      const q = query(collection(db, "pdfFiles"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const files = [];
      querySnapshot.forEach((doc) => {
        files.push({ id: doc.id, ...doc.data() });
      });

      console.log("Fetched files:", files); // Check what was fetched
      return files;
    } catch (error) {
      console.error("Error fetching files:", error.message);
      return rejectWithValue(error.message);
    }
  }
);


/* ===== Delete Files Thunk ===== */
export const deleteFiles = createAsyncThunk(
  "files/deleteFiles",
  async ({ fileIds, userId }, { rejectWithValue }) => {
    try {
      console.log("Starting deleteFiles thunk...");
      console.log("File IDs to delete:", fileIds);
      console.log("User ID:", userId);

      const deletedFiles = [];

      // Loop through the file IDs and delete them
      for (const fileId of fileIds) {
        console.log("Processing file ID:", fileId);

        try {
          // Get the document reference from Firestore
          const fileDocRef = doc(db, "pdfFiles", fileId);

          // Fetch the document to get file metadata
          console.log("Fetching file metadata from Firestore...");
          const fileDocSnapshot = await getDoc(doc(db, "pdfFiles", fileId));
          console.log("Document data:", fileDocSnapshot.data());
          console.log("Document userId:", fileDocSnapshot.data().userId);

          if (!fileDocSnapshot.exists()) {
            console.warn(`File with ID "${fileId}" does not exist in Firestore.`);
            continue; // Skip to the next file ID
          }

          const fileData = fileDocSnapshot.data();
          console.log("Fetched file metadata:", fileData);

          // File path in Cloud Storage
          const filePath = `pdfs/${userId}/${fileData.name}`; // Use the unique name from Firestore
          console.log("File path for deletion:", filePath);

          const storageRef = ref(storage, filePath);

          // Delete the file from Cloud Storage
          console.log(`Deleting file "${fileData.name}" from Storage...`);
          await deleteObject(storageRef);
          console.log(`File "${fileData.name}" successfully deleted from Storage.`);

          // Delete the document from Firestore
          console.log(`Deleting file metadata for ID "${fileId}" from Firestore...`);
          await deleteDoc(fileDocRef);
          console.log(`File metadata for ID "${fileId}" successfully deleted.`);

          // Push the deleted file's metadata into the array
          deletedFiles.push(fileId);
        } catch (fileError) {
          console.error(`Error processing file with ID "${fileId}":`, fileError);
        }
      }

      console.log("All files processed. Deleted files:", deletedFiles);
      return deletedFiles; // Return all deleted file references
    } catch (error) {
      console.error("Error in deleteFiles thunk:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

