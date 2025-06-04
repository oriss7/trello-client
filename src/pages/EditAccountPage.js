import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';

export default function EditAccountPage() {
  const { authState, onUpdateAccount, onDeleteAccount } = useContext(AuthContext)
  const [name, setName] = useState(authState.loggedInAccount?.name);
  const [email, setEmail] = useState(authState.loggedInAccount?.email);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  function handleUpdate(name, email){
    setIsSubmitted(true)
    if (!name || !email) return
    
    const nameRegex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (!nameRegex.test(name) || name.length < 2 || name.length > 20) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length < 5 || email.length > 40) return

    const valuesToUpdate = {}
    if (name !== authState.loggedInAccount.name) {
      valuesToUpdate.name = name;
    }
    if (email.toLowerCase() !== authState.loggedInAccount.email.toLowerCase()) {
      valuesToUpdate.email = email.toLowerCase()
    }
    if (Object.keys(valuesToUpdate).length === 0) return

    setIsLoading(true)
    try {
      const message = onUpdateAccount(valuesToUpdate)
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }
  function handleDelete() {
    setIsLoading(true)
    try {
      onDeleteAccount()
    } finally {
      turnOffDeleteMode()
      setIsLoading(false)
    }
  }
  function toggleDeleteMode() {
    if (isDeleteMode) {
      turnOffDeleteMode()
    } else {
        setIsDeleteMode(true)
    }
  }
  function turnOffDeleteMode() {
    setIsDeleteMode(false)
  }

  return (
    <div className='navbar-main-container'>
    <div className='navbar'>
      <Navbar />
    </div>
    <div className='updateAccount main-body'>
      <h1>Edit Profile</h1>
      <form
        onSubmit={async (ev) => {ev.preventDefault(); handleUpdate(name, email)}}>
        <div className='updateInput'>
          <h2>Name</h2>
          <FormInput type="text" placeholder="Name" value={name}
            onChange={(e) => setName(e.target.value)} showError={isSubmitted} min={2} max={20}/>
        </div>
        <div className='updateInput'>
          <h2>Email</h2>
          <FormInput type="text" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} showError={isSubmitted} min={5} max={40}
            disabled={authState.loggedInAccount?.email?.trim().toLowerCase() === 'guest@gmail.com'}
            isGuestUser={authState.loggedInAccount?.email?.trim().toLowerCase() === 'guest@gmail.com'}/>
        </div>
        <button className="pointer" disabled={isLoading}>Save</button>
      </form>
      {errorMessage && (<p className='errorMessage'>{errorMessage}</p>)}
      <div className="delete-account">
        <button className="pointer" onClick={toggleDeleteMode}
          disabled={isLoading || authState.loggedInAccount?.email?.trim().toLowerCase() === 'guest@gmail.com'}>Delete Account</button>
        {isDeleteMode && (
          <>
          <span className='delete-account-question'>Are you sure you want to delete your account?</span>
          <div className='delete-account-confirm'>
            <button onClick={handleDelete} className='delete-account-button pointer'
              disabled={isLoading}>Yes</button>
            <button onClick={turnOffDeleteMode} className='delete-account-button pointer'>No</button>
          </div>
          </>
        )}
        {authState.loggedInAccount?.email?.trim().toLowerCase() === 'guest@gmail.com' && (
        <p className='delete-input-error'>Guest account cannot be deleted</p>)}
      </div>
    </div>
    </div>
  )
}