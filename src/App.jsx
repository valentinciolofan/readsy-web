import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import Home from './components/Home';
import Profile from './components/Profile'
import Notes from './components/Notes';
import Note from './components/Note';
import './App.css';
import PdfViewer from './components/PdfViewer';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Dashboard route with nested routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
             <Route index element={<Home />} />
            
            {/* Nested routes for different sections */}
            <Route path="notes" element={<Notes />} />
            <Route path="notes/note/:id" element={<Note />} />

            <Route path="profile" element={<Profile />} />
            {/* <Route path="settings" element={<Settings />} /> */}
            {/* <Route path="chat" element={<Chat />} /> */}
            <Route path="readpdf/:pdfName" element={<PdfViewer />} />
            

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
