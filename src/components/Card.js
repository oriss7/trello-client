import React, { useState, useContext, useEffect, useRef } from 'react';
import { CardContext } from '../context/cardContext';
import DivOutsideEnter from './DivOutsideEnter';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Card({listId}) {
    const { cardState, loadCards, onCreateCard, onUpdateCard } = useContext(CardContext);
    const [isAddCard, setIsAddCard] = useState(false);
    const [cardToAdd, setCardToAdd] = useState('');
    const addCardRef = useRef(null);

    useEffect(() => {
        (async () => {
            if (listId) {
                await loadCards(listId);
            }
        })();
    }, []);
    const cards = cardState.cardsByList[listId] || [];

    async function handleAddCard() {
        const input = addCardRef.current?.querySelector('input');
        const cleanedInput = input?.value?.replace(/\s+/g, ' ').trim();
        if (!cleanedInput) return;
        await onCreateCard(listId, cleanedInput)
        setCardToAdd('');
        setIsAddCard(false);
    }

    const onDone = (type) => {
        const input = addCardRef.current?.querySelector('input');
        const cleaned = input?.value?.replace(/\s+/g, ' ').trim();
        if (type === 'enter' || type === 'clickOutside') {
            if (cleaned) {
                handleAddCard();
            } else {
                setIsAddCard(false);
            }
        }
    }

    async function handleToggleComplete(cardId, currentValue) {
        await onUpdateCard(cardId, { complete: !currentValue });
    }
    
    return (
        <Droppable droppableId={listId} type="card">
            {(provided) => (
        
        <div className='cards' ref={provided.innerRef} {...provided.droppableProps}>
            <div className='cards-wrapper'>
            {[...cards].sort((a, b) => a.position - b.position).map((card, index) => (
                <Draggable key={card._id} draggableId={card._id} index={index}>
                {(provided) => (
                <div className='card pointer' ref={provided.innerRef}
                {...provided.draggableProps} {...provided.dragHandleProps}>
                    <div className='card-content'>
                        <input type="checkbox" checked={card.complete} className='pointer'
                        onChange={() => handleToggleComplete(card._id, card.complete)}/>
                        <p className={`card-title ${card.complete ? 'completed' : ''}`}>{card.title}</p>
                    </div>
                </div>
                )}
                </Draggable>
            ))}
            {provided.placeholder}
            </div>
            { !isAddCard ? (
                <div onClick={() => setIsAddCard(true)} className='add-card-button pointer'>
                    + Add a card
                </div>
            ) : (
                <div className='add-card-div' ref={addCardRef}>
                    <input type="text" className='add-card-input'
                        maxLength="30" placeholder="Enter a title" value={cardToAdd}
                        onChange={(e) => setCardToAdd(e.target.value)}autoFocus/>
                    <DivOutsideEnter DivRef={addCardRef} onDone={onDone} />
                    <div className='add-confirm card-confirm'>
                        <button className='confirm-button pointer' onClick={handleAddCard}>Add Card</button>
                        <button onClick={() => setIsAddCard(false)} className='x-button pointer'>&times;</button>
                    </div>
                </div>
            )}
        </div>
        )}
        </Droppable>
    );
}