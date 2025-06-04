import { createContext, useState, useContext } from 'react'
import { query, create, remove, get, update } from '../services/transaction.service'
import { AuthContext } from './authContext';
export const TransactionContext = createContext({}) 

export function TransactionContextProvider({ children }) {
    const [transactionState, setTransactionState] = useState({
		transactions: [],
		isLoading: false
	});
    const {authState} = useContext(AuthContext)

	function setIsLoading(value) {
	    setTransactionState(prevState => ({
	        ...prevState,
	        isLoading: value
	    }))
	}

	function setTransactions(transactionsUpdater) {
		setTransactionState(prevState => {
			const newTransactions = 
			typeof transactionsUpdater === 'function'
				? transactionsUpdater(prevState.transactions)
				: transactionsUpdater;
			return {
			...prevState,
			transactions: newTransactions,
			};
		});
	}

	async function loadTransaction(transactionId) {
        const transaction = await get(transactionId)
		return transaction
	}
    async function loadTransactions() {
		setIsLoading(true)
        const transactions = await query(authState.loggedInAccount._id)
		setTransactions(transactions)
		setIsLoading(false)
	}

	async function onDeleteTransaction(transactionId) {
		setIsLoading(true)
        const deletedTransaction = await remove(transactionId)
		setTransactions(prev => prev.filter(t => t._id !== deletedTransaction._id))
		setIsLoading(false)
	}

    async function onCreateTransaction(price, datetime, description) {
        const newTransaction = await create(authState.loggedInAccount._id,
			price, datetime, description)
		if (transactionState.transactions) {
			setTransactions(prev =>[...prev, newTransaction]
				.sort((a, b) => new Date(b.datetime) - new Date(a.datetime)))
		} else {
			setTransactions([newTransaction])
		}
    }

	async function onUpdateTransaction(transactionId, data) {
		setIsLoading(true)
		const updatedTransaction = await update(transactionId, data)
		setTransactions(prev => prev.map(t => t._id === updatedTransaction._id ? updatedTransaction : t)
			.sort((a, b) => new Date(b.datetime) - new Date(a.datetime)))
		setIsLoading(false)
	}

    return (
        <TransactionContext.Provider value={{ transactionState, setTransactionState, setIsLoading,
                                                setTransactions, loadTransactions, loadTransaction,
												onCreateTransaction, onDeleteTransaction, onUpdateTransaction}}>
                                {children}
        </TransactionContext.Provider>
    )    
}