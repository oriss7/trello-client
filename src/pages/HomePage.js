import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { BoardContext } from '../context/boardContext';
import Navbar from '../components/Navbar';
import Popup from '../components/Popup';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { authState } = useContext(AuthContext)
  const { boardState, onCreateBoard, loadBoards } = useContext(BoardContext)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [boardTitle, setBoardTitle] = useState('')

  useEffect(() => {
    (async () => {
      if (authState.loggedInAccount) {
        await loadBoards()
      }
    })()
  }, [])

  const navigate = useNavigate()

  function navigateToBoardId(boardId) {
    navigate(`/board/${boardId}`)
  }

  async function handleCreateBoard() {
    await onCreateBoard(boardTitle)
    setBoardTitle('')
    setIsPopupOpen(false)
  }

  const { boards } = boardState;
  
  return (
    <div className='navbar-main-container'>
    <div className='navbar'>
      <Navbar />
    </div>
    <div className='HomePage'>
      <div className="boards-buttons">
        {boards?.map((board) => (
          <div key={board._id} className="board-button-wrapper pointer" onClick={() => navigateToBoardId(board._id)}>
            <div className="board-button" data-title={board.title}>{board.title}</div>
          </div>
        ))}
      </div>
      <div className="create-board pointer" onClick={() => setIsPopupOpen(true)}>Create new board</div>
    {isPopupOpen && (
        <Popup handleClose={() => setIsPopupOpen(false)} className = 'create-board-popup'>
            <h3>Create board</h3>
            <div>
              <h5>Board title <span>*</span></h5>
              <input type="text" value={boardTitle} maxLength={40}
                    onChange={(e) => setBoardTitle(e.target.value)}/>
              <p>👋Board title is required</p>
            </div>
            <button onClick={handleCreateBoard} className="create-board-popup pointer"
                    disabled={!boardTitle.trim()}>Create</button>
        </Popup>
    )}
    </div>
    </div>
  )
}