import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as BoardsIcon } from '../assets/images/boards.svg';
import { ReactComponent as LogoutIcon } from '../assets/images/logout.svg';
import { ReactComponent as UpdateIcon } from '../assets/images/update.svg';

export default function Navbar() {
  const { onLogout } = useContext(AuthContext)

  const navigate = useNavigate()
  const location = useLocation()
  
  function navigateToHome() {
    if (location.pathname !== '/') {
      navigate('/')
    }
  }
  function navigateToEdit() {
    if (location.pathname !== '/edit') {
      navigate('/edit')
    }
  }

  const isHome = location.pathname === '/'
  const isEdit = location.pathname === '/edit'
  
  return (
    <>
      <div className={`navbar-item pointer ${isHome ? 'active' : ''}`} onClick={navigateToHome}>
        <BoardsIcon className="btn-img"/>
        <span>Boards</span>
      </div>
      <div className={`navbar-item pointer ${isEdit ? 'active' : ''}`} onClick={navigateToEdit}> 
        <UpdateIcon className="btn-img"/>
        <span>Edit Profile</span>
      </div>
      <div className="navbar-item pointer" onClick={onLogout}>
        <LogoutIcon className="btn-img"/>
        <span>Logout</span>
      </div>
    </>
  )
}