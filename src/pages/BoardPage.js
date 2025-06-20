import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { BoardContext } from '../context/boardContext';
import { ListContext } from '../context/listContext';
import { CardContext } from '../context/cardContext';
import List from '../components/List';
import Search from '../components/Search';
import BoardMenu from '../components/BoardMenu';
import TitleInputHandler from '../components/TitleInputHandler';
import { ReactComponent as AddMemberIcon } from '../assets/images/addMember.svg';
import { ReactComponent as BoardsIcon } from '../assets/images/boards.svg';
import { ReactComponent as DotsHorizontalIcon } from '../assets/images/dotsHorizontal.svg';

export default function BoardPage() {
    const { boardId } = useParams();
    const { authState } = useContext(AuthContext);
    const { boardState, loadBoard, onUpdateBoard, resetBoardState } = useContext(BoardContext);
    const { resetListState } = useContext(ListContext);
    const { resetCardState } = useContext(CardContext);
    const [updateBoardTitle, setUpdateBoardTitle] = useState(false);
    const [titleInput, setTitleInput] = useState('');
    const inputRef = useRef(null);

    const [isAddMember, setIsAddMember] = useState(false);
    const [isBoardMenu, setIsBoardMenu] = useState(false);

    useEffect(() => {
        return () => {
            resetBoardState();
            resetListState();
            resetCardState();
        };
    }, []);

    useEffect(() => {
        (async () => {
            if (authState.loggedInAccount) {
                await loadBoard(boardId);
            }
        })();
    }, []);
    
    useEffect(() => {
        if (!inputRef.current || !updateBoardTitle) return;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        const style = getComputedStyle(inputRef.current);
        context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

        const text = titleInput || ' ';
        const textWidth = context.measureText(text).width;

        const paddingLeft = parseFloat(style.paddingLeft || '0');
        const paddingRight = parseFloat(style.paddingRight || '0');

        inputRef.current.style.width = `${textWidth + paddingLeft + paddingRight + 2}px`;
    }, [titleInput, updateBoardTitle])

    const navigate = useNavigate()

    async function handleUpdate() {
        const newTitle = inputRef.current?.value?.trim().replace(/\s+/g, ' ')
        if (!newTitle) return
        const valuesToUpdate = {}
        if (newTitle !== boardState.selectedBoard.title) {
          valuesToUpdate.title = newTitle;
        }
        if (Object.keys(valuesToUpdate).length !== 0) {
          await onUpdateBoard(valuesToUpdate)
        }
    }

    return (
        <div className='BoardPage'>
            {boardState.selectedBoard &&
            <>
                <div className='board-navbar'>
                    <div className='navigate-board-page pointer' onClick={() => navigate('/')}>
                        <BoardsIcon/>
                    </div>
                    {!updateBoardTitle ? (
                        <div className='board-title pointer' onClick={() => {
                            setTitleInput(boardState.selectedBoard.title);setUpdateBoardTitle(true);}}>
                            {boardState.selectedBoard.title}
                        </div>
                    ) : (
                        <>
                        <input ref={inputRef} value={titleInput} className="title-input" maxLength="30"
                            onChange={(e) => setTitleInput(e.target.value)}autoFocus/>
                        <TitleInputHandler inputRef={inputRef}
                            onDone={async () => { await handleUpdate(); setUpdateBoardTitle(false);}}/>
                        </>
                    )}
                    {isAddMember && (
                        <Search setIsAddMember={setIsAddMember} />
                    )}                        
                    <div className="add-members pointer" onClick={() => setIsAddMember(true)}>
                        <AddMemberIcon/>
                        <span>Share</span>
                    </div>
                    {isBoardMenu && (
                        <BoardMenu setIsBoardMenu={setIsBoardMenu} />
                    )}
                    <div className="dots-horizontal pointer" onClick={() => setIsBoardMenu(true)}>
                        <DotsHorizontalIcon/>
                    </div>
                </div>
                <List />
            </>
            }
        </div>
    )
}