import React, { useState, useContext, useEffect } from 'react';
import { CardContext } from '../context/cardContext';

export default function Card({listId}) {
    const { cardState, loadCards, onCreateCard, onUpdateCard } = useContext(CardContext);
    const [isAddCard, setIsAddCard] = useState(false);
    const [cardToAdd, setCardToAdd] = useState('');

    useEffect(() => {
        (async () => {
            if (listId) {
                await loadCards(listId);
            }
        })();
    }, []);
    const cards = cardState.cardsByList[listId] || [];

    async function handleAddCard() {
        const cleanedInput = cardToAdd.replace(/\s+/g, ' ').trim();
        if (!cleanedInput) return;
        await onCreateCard(listId, cleanedInput)
        setCardToAdd('');
        setIsAddCard(false);
    }

    async function handleToggleComplete(cardId, currentValue) {
        await onUpdateCard(cardId, { complete: !currentValue });
    }

    return (
        <div className='cards'>
            {cards.map(card => (
                <div key={card._id} className='card pointer'>
                    <div className='card-content'>
                        <input type="checkbox" checked={card.complete} className='pointer'
                        onChange={() => handleToggleComplete(card._id, card.complete)}/>
                        <p className='card-title'>{card.title}</p>
                    </div>
                </div>
            ))}
            { !isAddCard ? (
                <div onClick={() => setIsAddCard(true)} className='add-card-button pointer'>
                    + Add a card
                </div>
            ) : (
                <div className='add-card-div'>
                    <input type="text" placeholder="Enter a title" maxLength="30"
                        value={cardToAdd} onChange={(e) => setCardToAdd(e.target.value)}/>
                    <div className='add-confirm card-confirm'>
                        <button className='confirm-button pointer' onClick={handleAddCard}>Add Card</button>
                        <button onClick={() => setIsAddCard(false)} className='x-button pointer'>&times;</button>
                    </div>
                </div>
            )}
        </div>
    );
}