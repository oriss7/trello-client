import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { BoardContext } from '../context/boardContext';
import { ListContext } from '../context/listContext';
import { CardContext } from '../context/cardContext';
import List from '../components/List';

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

    useEffect(() => {
        if (updateBoardTitle && inputRef.current) {
            inputRef.current.select();
        }
    }, [updateBoardTitle])

    useEffect(() => {
        if (!updateBoardTitle) return;
        async function handleInteraction(event) {
            const isOutsideClick = event.type === 'mousedown' &&
                inputRef.current && !inputRef.current.contains(event.target);

            const isEnterKeyInsideInput =
                event.type === 'keydown' && event.key === 'Enter' &&
                inputRef.current && inputRef.current.contains(event.target);

            if (isOutsideClick || isEnterKeyInsideInput) {
                await handleUpdate();
                setUpdateBoardTitle(false);
            }
        }
        document.addEventListener('mousedown', handleInteraction);
        document.addEventListener('keydown', handleInteraction);

        return () => {
            document.removeEventListener('mousedown', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };
    }, [updateBoardTitle]);

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
                        <input ref={inputRef} value={titleInput} className="title-input" maxLength="30"
                        onChange={(e) => setTitleInput(e.target.value)}autoFocus/>
                    )}
                </div>
                <List />
            </>
            }
        </div>
    )
}