import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext.js';
import FormInput from './FormInput';
import { ReactComponent as TrelloIcon } from '../assets/images/trello.svg';

export default function AuthForm({ mode = 'signup', handleSignup, handleLogin }) {
    const { authState } = useContext(AuthContext)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate()
    useEffect(() => {
        if (authState.loggedInAccount) {
            navigate('/')
        }
    }, [])

    const isSignup = mode === 'signup';

    async function handleSubmit(name, email, password) {
        setIsSubmitted(true)
        const isValid = isSignup
            ? name && email && password
            : email && password
        if (!isValid) return

        if (isSignup) { 
            const nameRegex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
            if (!nameRegex.test(name) || name.length < 2 || name.length > 20) return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email) || email.length < 5 || email.length > 40) return

        const passwordRegex = /[\s<>{}=%]/
        if (passwordRegex.test(password) || password.length < 8 || password.length > 17) return
        
        setIsLoading(true)
        try {
            if (isSignup) {
                const message = await handleSignup({ name, email, password })
                setErrorMessage(message)
            } else {
                const message = await handleLogin({ email, password })
                setErrorMessage(message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='signupLogin main-body'>
            <div className='auth-title'>
                <TrelloIcon />
                <h1>Trello</h1>
            </div>
            <h4>{isSignup ? 'Sign up to continue' : 'Log in to continue'}</h4>
            <form
                onSubmit={async (ev) => {ev.preventDefault(); handleSubmit(name, email, password)}}>
                {isSignup && (
                    <FormInput type="text" placeholder="Name" value={name}
                        onChange={(e) => setName(e.target.value)} showError={isSubmitted} min={2} max={20}/>
                )}
                <FormInput type="text" placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)} showError={isSubmitted} min={5} max={40}/>
                <FormInput type="password" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)} showError={isSubmitted} min={8} max={17}/>
                <button className="pointer" disabled={isLoading}>
                    {isSignup ? 'Sign up' : 'Log in'}
                </button>
            </form>
            {errorMessage && (<p className='errorMessage'>{errorMessage}</p>)}
            {!isSignup && (<button className="pointer" disabled={isLoading}
                    onClick={async () => {
                    setIsLoading(true)
                    await handleLogin({ email: 'guest@gmail.com', password: 'g12345678' })
                    setIsLoading(false)}}>
                    Log in as a guest
            </button>)}

            <Link className="pointer" to={isSignup ? '/login' : '/signup'}>
                {isSignup ? 'Already have an account? Log in' : 'Create an account'}
            </Link>
        </div>
    );
}