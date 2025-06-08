import React, { useState, useContext, useEffect, useRef } from 'react';
import Card from './Card';
import { ListContext } from '../context/listContext';
import { CardContext } from '../context/cardContext';
import { BoardContext } from '../context/boardContext';
import TitleInputHandler from './TitleInputHandler';
import DivOutsideEnter from './DivOutsideEnter';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// if lists > 0 : <div>+ Add another list</div>

export default function List() {
    const { listState, onCreateList, onUpdateList, loadLists, onMoveList} = useContext(ListContext);
    const { cardState, onMoveCard } = useContext(CardContext);
    const { boardState } = useContext(BoardContext);
    const [isAddList, setIsAddList] = useState(false);
    const [listToAdd, setListToAdd] = useState('');

    const [updatingListId, setUpdatingListId] = useState(null);
    const [titleInput, setTitleInput] = useState('');
    const inputRef = useRef(null);

    const addListRef = useRef(null);

    useEffect(() => {
        (async () => {
            if (boardState.selectedBoard) {
                await loadLists();
            }
        })();
    }, [boardState.selectedBoard]);

    async function handleAddList() {
        const input = addListRef.current?.querySelector('input');
        const cleanedInput = input?.value?.replace(/\s+/g, ' ').trim();
        
        if (!cleanedInput) return
        await onCreateList(cleanedInput)
        setListToAdd('')
        setIsAddList(false)
    }
    
    async function handleUpdate(listId) {
        const newTitle = inputRef.current?.value?.trim().replace(/\s+/g, ' ');
        if (!newTitle) return;

        const list = listState.lists.find(l => l._id === listId);
        if (!list) return;

        const valuesToUpdate = {};
        if (newTitle !== list.title) {
            valuesToUpdate.title = newTitle;
        }

        if (Object.keys(valuesToUpdate).length !== 0) {
            await onUpdateList(listId, valuesToUpdate);
        }
    }

    const onDone = (type) => {
        if (type === 'enter') {
            const input = addListRef.current?.querySelector('input');
            const cleaned = input?.value?.replace(/\s+/g, ' ').trim();
            if (cleaned) {
                handleAddList();
            } else {
                setIsAddList(false);
            }
        } else if (type === 'clickOutside') {
            setIsAddList(false);
        }
    };
    
    const handleOnDragEnd = async (result) => {
        const { destination, source, draggableId, type } = result;
        if (!destination) return;

        if (type === 'list') {
            if (destination.index === source.index) return;

            const updatedLists = [...listState.lists]
                .filter(list => list && list._id)
                .sort((a, b) => a.position - b.position);

            const [movedList] = updatedLists.splice(source.index, 1);
            updatedLists.splice(destination.index, 0, movedList);

            const reordered = updatedLists.map((list, index) => ({
                ...list,
                position: index
            }));
            
            await onMoveList(reordered);
        }
        if (type === 'card') {
            const sourceListId = source.droppableId;
            const destListId = destination.droppableId;

            if (sourceListId === destListId && source.index === destination.index) return;

            const sourceCards = [...(cardState.cardsByList[sourceListId] || [])];
            const [movedCard] = sourceCards.splice(source.index, 1);

            const destCards = [...(cardState.cardsByList[destListId] || [])];
            destCards.splice(destination.index, 0, movedCard);

            await onMoveCard({
                cardId: draggableId,
                fromListId: sourceListId,
                toListId: destListId,
                newIndex: destination.index,
            });
        }
    };
    
    return (
        <div className="lists-wrapper">
        <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type="list">
        {(provided) => (
        <div className='lists' ref={provided.innerRef} {...provided.droppableProps}>
            
            {listState.lists?.filter(list => list && list._id).sort((a, b) => a.position - b.position)
                                .map((list, index) => (
                <Draggable draggableId={list._id} index={index} key={list._id}>
                {(provided) => (
                
                <div className="list" ref={provided.innerRef}
                        {...provided.draggableProps} {...provided.dragHandleProps}>
                    {updatingListId === list._id ? (
                        <>
                        <input ref={inputRef} value={titleInput} className='update-list-input' maxLength={30}
                            onChange={(e) => setTitleInput(e.target.value)}autoFocus/>
                        <TitleInputHandler inputRef={inputRef}
                            onDone={async () => {await handleUpdate(list._id);
                            setUpdatingListId(null);}}/>
                        </>
                    ) : (
                        <p className='list-title pointer'
                            onClick={() => {setUpdatingListId(list._id);setTitleInput(list.title);}}>
                            {list.title}
                        </p>
                    )}
                    <Card listId={list._id} />
                </div>
                )}
                </Draggable>
            ))}
            {provided.placeholder}
            { !isAddList ? (
                <div onClick={() => setIsAddList(true)} className='add-list-button pointer'>
                    + Add a list
                </div>
            ) : (
                <>
                <div className='add-list-div' ref={addListRef}>
                    <input type="text" placeholder="Enter list name..." maxLength="30"
                        value={listToAdd} onChange={(e) => setListToAdd(e.target.value)}autoFocus/>
                    <div className='add-confirm'>
                        <button className='confirm-button pointer' onClick={handleAddList}>Add List</button>
                        <button onClick={() => setIsAddList(false)} className='x-button pointer'>&times;</button>
                    </div>
                </div>
                <DivOutsideEnter DivRef={addListRef} onDone={onDone} />
                </>
            )}
        </div>
        )}
        </Droppable>
        </DragDropContext>
        </div>
    );
}