import React, { useContext } from 'react';
import AuthForm from '../components/AuthForm';
import { AuthContext } from '../context/authContext';

export default function LoginPage() {
  const { onLogin } = useContext(AuthContext)
  
  async function handleLogin({ email, password }) {
    return await onLogin(email.toLowerCase(), password)
  }
  
  return <AuthForm mode="login" handleLogin={handleLogin}/>
}