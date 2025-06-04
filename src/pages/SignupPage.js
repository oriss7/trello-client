import React, { useContext } from 'react';
import AuthForm from '../components/AuthForm';
import { AuthContext } from '../context/authContext';

export default function SignupPage() {
  const { onSignup } = useContext(AuthContext)
  
  async function handleSignup({ name, email, password }) {
    return await onSignup(name, email.toLowerCase(), password)
  }

  return <AuthForm mode="signup" handleSignup={handleSignup}/>
}