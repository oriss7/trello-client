import {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../context/authContext';
import { BoardContext } from '../context/boardContext';
import Popup from './Popup';
import { ReactComponent as LineHorizontalIcon } from '../assets/images/lineHorizontal.svg';

export default function BoardMenu({setIsBoardMenu}) {
    const { authState } = useContext(AuthContext);
    const { boardState } = useContext(BoardContext);
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    async function handleDelete() {
        setIsDeleteMode(true)
        console.log('delete board')
        //Delete board, lists that have this boardId, cards in those lists
        setIsDeleteMode(false)
    }

    return(
        <Popup handleClose={() => setIsBoardMenu(false)} className="board-menu-popup">
            <p className="board-menu-title">Menu</p>
            <div className='open-delete-board pointer' onClick={() => setIsDeleteMode(prev => !prev)}>
                <LineHorizontalIcon/>
                <span>Close Board</span>
            </div>
            {isDeleteMode && (
                <>
                <p>Close board?</p>
                <div className="delete-board-wrapper">
                    <button className="delete-board-button pointer" onClick={() => { handleDelete(); }}
                    disabled={authState.loggedInAccount._id !== boardState.selectedBoard.owner || !isDeleteMode}>
                        Close</button>
                    { authState.loggedInAccount._id !== boardState.selectedBoard.owner && (
                        <span className='not-owner-menu'>Only the owner can close the board</span>
                    )}
                </div>
                </>
            )}
        </Popup>
    )
}