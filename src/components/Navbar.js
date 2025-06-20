import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as BoardsIcon } from '../assets/images/boards.svg';
import { ReactComponent as LogoutIcon } from '../assets/images/logout.svg';
import { ReactComponent as UpdateIcon } from '../assets/images/update.svg';

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  function navigateTo(path) {
    const currentPath = window.location.pathname;
    if (currentPath !== path || currentPath === '/logout') {
      if (path === '/logout') {
        navigate('/logout', { state: { backgroundLocation: location } });
      } else {
        navigate(path);
      }
    }
  }

  const currentPath = window.location.pathname;

  const isHome = currentPath === '/';
  const isEdit = currentPath === '/edit';
  const isLogout = currentPath === '/logout';
  
  return (
    <>
      <div className={`navbar-item pointer ${isHome ? 'active' : ''}`}
        onClick={() => navigateTo('/')}>
        <BoardsIcon/>
        <span>Boards</span>
      </div>
      <div className={`navbar-item pointer ${isEdit ? 'active' : ''}`}
        onClick={() => navigateTo('/edit')}>
        <UpdateIcon/>
        <span>Edit Profile</span>
      </div>
      <div className={`navbar-item pointer ${isLogout ? 'active' : ''}`}
        onClick={() => navigateTo('/logout')}>
        <LogoutIcon/>
        <span>Logout</span>
      </div>
    </>
  )
}