import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../components/Menu';
import ReadsyPartner from '../components/ReadsyPartner';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [userFiles, setUserFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteIsOpen, setNoteIsOpen] = useState(false);

  const handleNoteIsOpen = () => {
    setNoteIsOpen(true);
  }
  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const q = query(
          collection(db, 'userFiles'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const files = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserFiles(files);
      } catch (error) {
        console.error('Error fetching user PDFs:', error);
        setError('Error fetching user PDFs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserFiles();
    }
    const noteisopen = window.location.pathname.slice(0, 17);

    if (noteisopen === '/dashboard/notes/') {
      setNoteIsOpen(true);
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <Menu />
      <main className={`dashboard-main ${noteIsOpen ? 'cream' : ''}`}>
        <Outlet />
      </main>
        <ReadsyPartner />
    </div>
  );
};

export default Dashboard;
