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
    
    useEffect(() => {
        (async () => {
            const fetchedAccounts = await loadAccounts();
            setAccounts(fetchedAccounts || []);

            const memberIds = boardState.selectedBoard.members || [];
            const fetchedMembers = await Promise.all(
            memberIds.map((id) => loadAccount(id)));
            // 3. Filter out any failed/null results and update state
            setMembers(fetchedMembers.filter(Boolean));
        })();
    }, []);

	const handleSearch = (event) => {
	    const value = event.target.value
	    setSearchTerm(value)
	    if (value) {
            const uniqueResults = accounts.filter(account =>
                (account.email.toLowerCase().includes(value.toLowerCase()) || 
                account.name.toLowerCase().includes(value.toLowerCase())) &&
                !boardState.selectedBoard.members.includes(account._id));
            
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
        if (selectedAccountId) {
            const data = {
                newMember: selectedAccountId
            };
            await onUpdateBoard(data);
        }
    };

    async function handleRemoveMember(memberId) {
        const data = {
            removeMember: memberId
        };
        await onUpdateBoard(data);
        setMembers(prev => prev.filter(member => member._id !== memberId));
    }

	return(
        <Popup handleClose={() => setIsAddMember(false)} className="add-member-popup">
            <p className='share-board-title'>Share board</p>
            <div className="add-member-search">
                <input type="text" placeholder='Enter address or name' maxLength={40}
                        value={searchTerm} onChange={handleSearch}
                        disabled={authState.loggedInAccount._id !== boardState.selectedBoard.owner}/>
                <button className="pointer" onClick={() => { handleShare(); }}
                    disabled={authState.loggedInAccount._id !== boardState.selectedBoard.owner}>
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
                                onClick={() => { setSelectedAccountId(account._id)}}>
                                {account.name} - {account.email}</p>
                        </div>
                    ))}
                </div>
            )}
            <p className='board-members-title'>Board members</p>
            
            {members.map((member) => (
                <p key={member._id} className='board-member'>
                    {member.name}
                    {member._id === boardState.selectedBoard.owner ? (
                        ' • Workspace admin'
                    ) : authState.loggedInAccount._id === boardState.selectedBoard.owner ? (
                        <>
                        <span>{' • '}</span>
                        <span className="remove-member pointer"
                            onClick={() => handleRemoveMember(member._id)}>
                            {'Remove member'}
                        </span>
                        </>
                    ) : null }
                </p>
            ))}
        </Popup>
	)
}