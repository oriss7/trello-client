import { createContext, useState } from 'react'
import { login, signup, logout, getLoggedInAccount, get, query, update, remove } from '../services/auth.service'
import { useNavigate} from 'react-router-dom';

export const AuthContext = createContext({}) 

export function AuthContextProvider({ children }) {

  const [authState, setAuthState] = useState({
    loggedInAccount: null,
    isLoading: false,
  })

  const navigate = useNavigate()

  function setLoggedInAccount(account) {
    setAuthState(prev => ({
      ...prev,
      loggedInAccount: account,
    }))
  }

  function setIsLoading(value) {
    setAuthState(prevState => ({
      ...prevState,
      isLoading: value
    }));
  }

  async function loadLoggedInAccount() {
    setIsLoading(true)
    try {
      const response = await getLoggedInAccount()
      const { account } = response
      if(account) {
        setLoggedInAccount(account)
      }
      return account || null
    } catch (error) {
        console.error('Error loading account:', error)
        setLoggedInAccount(null)
        return null
    } finally {
        setIsLoading(false)
    }
  }

  async function loadAccount(accountId) {
    try {
      const response = await get(accountId)
      const { account } = response
      return account || null
    } catch (error) {
        console.error('Error loading account:', error)
        return null
    }
  }

  async function loadAccounts() {
    try {
      const response = await query()
      const { accounts } = response
      return accounts || null
    } catch (error) {
        console.error('Error loading accounts:', error)
        return null
    }
  }

  async function onLogin(email, password) {
    try {
      const response = await login(email, password)
      const account = response.account
      if(account) {
        setLoggedInAccount(account)
        navigate('/')
      } else {
          return response.message
      }
    } catch (err) {
      console.error("Login failed:", err.message || err)
    }
	}

	async function onSignup(name, email, password) {
    try {
      const response = await signup(name, email, password)
      const account = response.account
      if(account) {
        setLoggedInAccount(account)
        navigate('/')
      } else {
          return response.message
      }
    } catch (err) {
      console.error("Signup failed:", err.message || err)
    }
	}

  async function onLogout() {
    try {
      await logout()
      setLoggedInAccount(null)
      navigate('/login')
    } catch (err) {
      console.error("Logout failed:", err.message || err)
    }
  }

  async function onUpdateAccount(data) {
		const response = await update(authState.loggedInAccount._id, data)
    const updatedAccount = response.updatedAccount
    if(updatedAccount) {
      await loadLoggedInAccount()
    } else {
        return response.message
    }
	}

  async function onDeleteAccount() {
    await remove(authState.loggedInAccount._id)
    setLoggedInAccount(null)
    navigate('/login')
	}

  return (
    <AuthContext.Provider value={{ authState, setAuthState, setLoggedInAccount, setIsLoading,
                                    loadLoggedInAccount, loadAccount, loadAccounts, onLogin,
                                    onSignup, onLogout, onUpdateAccount, onDeleteAccount}}>
      {children}
    </AuthContext.Provider>
  )
}