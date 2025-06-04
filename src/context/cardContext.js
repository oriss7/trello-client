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
    
    return (
        <CardContext.Provider value={{ cardState, setCardState, setIsLoading, setCards, resetCardState,
                                        loadCards, onCreateCard, onUpdateCard }}>
                                {children}
        </CardContext.Provider>
    )
}