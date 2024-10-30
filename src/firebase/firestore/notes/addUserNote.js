export const addUserNote = async (userId, note) => {
    const noteRef = await db.collection('notes').add({ userId, ...note });
    return { id: noteRef.id, ...note };
};
