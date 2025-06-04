import React, { useState, useContext, useEffect } from 'react';
import Card from './Card';
import { ListContext } from '../context/listContext';
import { BoardContext } from '../context/boardContext';
// if lists > 0 : <div>+ Add another list</div>

export default function List() {
    const { listState, onCreateList, loadLists } = useContext(ListContext);
    const { boardState } = useContext(BoardContext);
    const [isAddList, setIsAddList] = useState(false);
    const [listToAdd, setListToAdd] = useState('');

    useEffect(() => {
        (async () => {
            if (boardState.selectedBoard) {
                await loadLists();
            }
        })();
    }, [boardState.selectedBoard]);

    async function handleAddList() {
        const cleanedInput = listToAdd.replace(/\s+/g, ' ').trim()
        if (!cleanedInput) return
        await onCreateList(cleanedInput)
        setListToAdd('')
        setIsAddList(false)
    }

    return (
        <div className="lists-wrapper">
        <div className='lists'>
            {listState.lists?.map(list => (
                <div className='list' key={list._id}>
                    <p className='list-title'>{list.title}</p>
                    <Card listId={list._id} />
                </div>
            ))}
            { !isAddList ? (
                <div onClick={() => setIsAddList(true)} className='add-list-button pointer'>
                    + Add a list
                </div>
            ) : (
                <div className='add-list-div'>
                    <input type="text" placeholder="Enter list name..." maxLength="30"
                        value={listToAdd} onChange={(e) => setListToAdd(e.target.value)}/>
                    <div className='add-confirm'>
                        <button className='confirm-button pointer' onClick={handleAddList}>Add List</button>
                        <button onClick={() => setIsAddList(false)} className='x-button pointer'>&times;</button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}