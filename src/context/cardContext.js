import { createContext, useState, useContext } from 'react'
import { create, query, update } from '../services/card.service'
export const CardContext = createContext({}) 

export function CardContextProvider({ children }) {
    const [cardState, setCardState] = useState({
        cardsByList: {},
        isLoading: false
    });

    function setIsLoading(value) {
        setCardState(prevState => ({
            ...prevState,
            isLoading: value
        }))
    }

    function setCards(listId, cards) {
        setCardState(prevState => ({
            ...prevState,
            cardsByList: {
                ...prevState.cardsByList,
                [listId]: cards
            }
        }));
    }

    function resetCardState() {
        setCardState({
            cardsByList: {},
            isLoading: false
        });
    }

    async function loadCards(listId){
        setIsLoading(true)
        const cards = await query(listId)
        setCards(listId, cards)
        setIsLoading(false)
    }
    
    async function onCreateCard(listId, title) {
        setIsLoading(true)
        const newCard = await create(listId, title)
        const existingCards = Array.isArray(cardState.cardsByList[listId])
            ? cardState.cardsByList[listId] : [];
        setCards(listId, [...existingCards, newCard]);
        setIsLoading(false)
    }

    async function onUpdateCard(cardId, data) {
        setIsLoading(true)
        const updatedCard = await update(cardId, data)
        const listId = updatedCard.list
        const existingCards = Array.isArray(cardState.cardsByList[listId])
            ? cardState.cardsByList[listId] : [];
        const updatedCards = existingCards.map(card =>
            card._id === updatedCard._id ? updatedCard : card)
        setCards(listId, updatedCards);
        setIsLoading(false)
    }
    
    async function onMoveCard({ cardId, fromListId, toListId, newIndex }) {
        setIsLoading(true);

        const fromCards = [...(cardState.cardsByList[fromListId] || [])];
        const toCards = fromListId === toListId ? fromCards : [...(cardState.cardsByList[toListId] || [])];

        const movingCardIndex = fromCards.findIndex(card => card._id === cardId);
        if (movingCardIndex === -1) {
            console.error('Card not found in source list');
            setIsLoading(false);
            return;
        }

        const [movingCard] = fromCards.splice(movingCardIndex, 1);
        
        movingCard.list = toListId;

        toCards.splice(newIndex, 0, movingCard);

        const updatedFromCards = fromListId === toListId ? [] : fromCards.map((card, index) => ({
            ...card,
            position: index,
        }));

        const updatedToCards = toCards.map((card, index) => ({
            ...card,
            position: index,
        }));

        if (fromListId !== toListId) {
            setCards(fromListId, updatedFromCards);
        }
        setCards(toListId, updatedToCards);

        const updates = []

        if (fromListId !== toListId) {
            updates.push(...updatedFromCards.map(card =>
                update(card._id, { list: card.list, position: card.position })
            ));
        }
        updates.push(...updatedToCards.map(card =>
            update(card._id, { list: card.list, position: card.position })
        ));

        await Promise.all(updates);
        setIsLoading(false);
    }

    return (
        <CardContext.Provider value={{ cardState, setCardState, setIsLoading, setCards, resetCardState,
                                        loadCards, onCreateCard, onUpdateCard, onMoveCard }}>
                                {children}
        </CardContext.Provider>
    )
}