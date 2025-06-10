import { createContext, useState, useContext } from 'react'
import { get, query, create, update } from '../services/board.service'
import { AuthContext } from './authContext';
import { useNavigate } from 'react-router-dom';

export const BoardContext = createContext({}) 

export function BoardContextProvider({ children }) {
    const [boardState, setBoardState] = useState({
        boards: [],
        selectedBoard: null,
        isLoading: false
    });

    const navigate = useNavigate()

    const {authState} = useContext(AuthContext)

    function setIsLoading(value) {
        setBoardState(prevState => ({
            ...prevState,
            isLoading: value
        }))
    }

	function setBoards(boards) {
	    setBoardState(prevState => ({
	        ...prevState,
	        boards: boards
	    }));
	}

    function setSelectedBoard(board) {
        setBoardState(prev => ({
            ...prev,
            selectedBoard: board,
        }))
    }

    function resetBoardState() {
        setBoardState({
            boards: [],
            selectedBoard: null,
            isLoading: false
        });
    }

    async function loadBoard(boardId) {
        setIsLoading(true)
        const board = await get(boardId)
        setSelectedBoard(board)
        setIsLoading(false)
	}
    
    async function loadBoards(){
        setIsLoading(true)
        const boards = await query(authState.loggedInAccount._id)
		setBoards(boards)
		setIsLoading(false)
    }
    async function onCreateBoard(title) {
        setIsLoading(true)
        const newBoard = await create(authState.loggedInAccount._id, title)
        if (newBoard && newBoard._id) {
            navigate(`/board/${newBoard._id}`)
        }
        setIsLoading(false)
    }
    
    async function onUpdateBoard(data) {
        setIsLoading(true)
        const updatedBoard = await update(boardState.selectedBoard._id, data)
        setSelectedBoard(updatedBoard)
        setIsLoading(false)
    }

    return (
        <BoardContext.Provider value={{ boardState, setBoardState, setIsLoading, setBoards, resetBoardState,
                                        setSelectedBoard, loadBoard, loadBoards,
                                        onCreateBoard, onUpdateBoard }}>
                                {children}
        </BoardContext.Provider>
    )
}