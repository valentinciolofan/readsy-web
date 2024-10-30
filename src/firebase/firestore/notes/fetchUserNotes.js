export const fetchUserNotes = async (userId) => {
    const notes = [];
    const snapshot = await db.collection('notes').where('userId', '==', userId).get();
    snapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() });
    });
    return notes;
};

