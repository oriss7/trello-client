import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import './assets/style/App.scss';
import HomePage from './pages/HomePage.js';
import BoardPage from './pages/BoardPage.js';
import LoginPage from './pages/LoginPage.js';
import SignupPage from './pages/SignupPage.js';
import EditAccountPage from './pages/EditAccountPage.js';
import LoadingScreen from './components/LoadingScreen';
import {AppProvider} from './context/AppProvider';
import { AuthContext } from './context/authContext.js';
import {useContext,useEffect} from 'react';

function AppContent() {
  const { authState, loadLoggedInAccount } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    (async () => {
      const accountFromAuth = await loadLoggedInAccount()
      const currentPath = location.pathname
      if (!accountFromAuth) {
        if (currentPath === '/signup') return
        navigate('/login')
      }
    })()
  }, [])

  if (authState.isLoading) {
    return <LoadingScreen />
  }
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="board/:boardId" element={<BoardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/edit" element={<EditAccountPage />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}
export default App