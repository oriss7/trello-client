import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { BoardContext } from '../context/boardContext';
import { ListContext } from '../context/listContext';
import { CardContext } from '../context/cardContext';
import List from '../components/List';
import TitleInputHandler from '../components/TitleInputHandler';

export default function BoardPage() {
    const { boardId } = useParams();
    const { authState } = useContext(AuthContext);
    const { boardState, loadBoard, onUpdateBoard, resetBoardState } = useContext(BoardContext);
    const { resetListState } = useContext(ListContext);
    const { resetCardState } = useContext(CardContext);
    const [updateBoardTitle, setUpdateBoardTitle] = useState(false);
    const [titleInput, setTitleInput] = useState('');
    const inputRef = useRef(null);

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

    async function handleUpdate() {
        const newTitle = inputRef.current?.value?.trim().replace(/\s+/g, ' ')
        if (!newTitle) return
        const valuesToUpdate = {}
        if (newTitle !== boardState.selectedBoard.title) {
          valuesToUpdate.title = newTitle;
        }
        if (Object.keys(valuesToUpdate).length !== 0) {
          await onUpdateBoard(boardState.selectedBoard._id, valuesToUpdate)
        }
    }

    return (
        <div className='BoardPage'>
            {boardState.selectedBoard &&
            <>
                <div className='board-navbar'>
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
                </div>
                <List />
            </>
            }
        </div>
    )
}