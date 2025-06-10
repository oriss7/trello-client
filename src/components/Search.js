import {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../context/authContext';
import { BoardContext } from '../context/boardContext';
import Popup from './Popup';

export default function Search({setIsAddMember}) {
    const { authState, loadAccount, loadAccounts } = useContext(AuthContext);
    const { boardState, onUpdateBoard } = useContext(BoardContext);
	const [searchTerm, setSearchTerm] = useState('')
  	const [searchResults, setSearchResults] = useState([])
  	const [accounts, setAccounts] = useState([])
  	const [members, setMembers] = useState([])
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [isSharing, setIsSharing] = useState(false);
    const [removingMemberId, setRemovingMemberId] = useState(null);
    
    useEffect(() => {
        (async () => {
            const fetchedAccounts = await loadAccounts()            
            const memberIds = boardState.selectedBoard.members || [];
            const fetchedMembers = await Promise.all(
                memberIds.map((id) => loadAccount(id)))            
            const validMembers = fetchedMembers.filter(Boolean);
            setMembers(validMembers)
            const filteredAccounts = (fetchedAccounts || []).filter(
                (account) => !validMembers.some(member => member._id === account._id)
            );
            setAccounts(filteredAccounts)
        })();
    }, []);

	const handleSearch = (event) => {
	    const value = event.target.value
	    setSearchTerm(value)
	    if (value) {
            const uniqueResults = accounts.filter(account =>
                (account.email.toLowerCase().includes(value.toLowerCase()) || 
                account.name.toLowerCase().includes(value.toLowerCase())) &&
                !boardState.selectedBoard.members.includes(account._id))            
            setSearchResults(uniqueResults)
            if (selectedAccountId && !uniqueResults.some(account => account._id === selectedAccountId)) {
                setSelectedAccountId(null)
            }
	    } else {
	      setSearchResults([])
          setSelectedAccountId(null)
	    }
	}

    async function handleShare() {
        if (!selectedAccountId || isSharing) return; // prevent duplicates
        setIsSharing(true)
        const data = { newMember: selectedAccountId }
        await onUpdateBoard(data)
        const selectedAccount = accounts.find(account => account._id === selectedAccountId);
        if (selectedAccount) {
            setMembers(prev => [...prev, selectedAccount]);
            setAccounts(prev => prev.filter(account => account._id !== selectedAccountId));
            setSelectedAccountId(null);
            setSearchTerm('')
        }
        setIsSharing(false)
    };

    async function handleRemoveMember(memberId) {
        if (removingMemberId === memberId) return; // Prevent duplicate calls
        setRemovingMemberId(memberId)
        const data = { removeMember: memberId }
        await onUpdateBoard(data)
        const removedMember = members.find(member => member._id === memberId);
        if (removedMember) {
            setMembers(prev => prev.filter(member => member._id !== memberId));
            setAccounts(prev => [...prev, removedMember]);
        }
        setRemovingMemberId(null)
    }

	return(
        <Popup handleClose={() => setIsAddMember(false)} className="add-member-popup">
            <p className='share-board-title'>Share board</p>
            <div className="add-member-search">
                <input type="text" placeholder='Enter address or name' maxLength={40}
                        value={searchTerm} onChange={handleSearch}
                        disabled={authState.loggedInAccount._id !== boardState.selectedBoard.owner}/>
                <button className="pointer" onClick={() => { handleShare(); }}
                    disabled={authState.loggedInAccount._id !== boardState.selectedBoard.owner || isSharing}>
                        Share</button>
            </div>
            {authState.loggedInAccount._id !== boardState.selectedBoard.owner && (
                <p className='not-owner'>Only the owner can share the board</p>
            )}
            {searchTerm && (
                <div className="searchResults">
                    {searchResults.slice(0,20).map(account => (
                        <div key={account._id}>                            
                            <p className={`pointer ${selectedAccountId === account._id ? 'selected' : ''}`}
                                onClick={() => {if (selectedAccountId === account._id)
                                {setSelectedAccountId(null);}
                                else {setSelectedAccountId(account._id);}}}>
                                {account.name} - {account.email}</p>
                        </div>
                    ))}
                </div>
            )}
            <p className='board-members-title'>Board members</p>
            <div className='board-members'>
                {members.map((member) => (
                    <p key={member._id} className='board-member'>
                        {member.name}
                        {member._id === boardState.selectedBoard.owner ? (
                            ' • Workspace admin'
                        ) : authState.loggedInAccount._id === boardState.selectedBoard.owner ? (
                            <>
                            <span>{' • '}</span>
                            <span className="remove-member pointer"
                                onClick={() => {if (removingMemberId !== member._id)
                                {handleRemoveMember(member._id);}}}>
                                {'Remove member'}
                            </span>
                            </>
                        ) : null }
                    </p>
                ))}
            </div>
        </Popup>
	)
}