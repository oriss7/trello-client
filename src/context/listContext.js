import { createContext, useState, useContext } from 'react'
import { create, query, update } from '../services/list.service'
import { BoardContext } from './boardContext';
export const ListContext = createContext({}) 

export function ListContextProvider({ children }) {
    const [listState, setListState] = useState({
        lists: [],
        isLoading: false
    });

    const { boardState } = useContext(BoardContext);

    function setIsLoading(value) {
        setListState(prevState => ({
            ...prevState,
            isLoading: value
        }))
    }

    function setLists(lists) {
        setListState(prevState => ({
            ...prevState,
            lists: lists
        }));
    }

    function resetListState() {
        setListState({
            lists: [],
            isLoading: false
        });
    }

    // async function loadList(listId) {
    //     const list = await get(listId)
    //     return list
    // }
    
    async function loadLists(){
        setIsLoading(true)
        const lists = await query(boardState.selectedBoard._id)
        setLists(lists)
        setIsLoading(false)
    }

    async function onCreateList(title) {
        setIsLoading(true)
        const newList = await create(boardState.selectedBoard._id, title)
        setLists([...(Array.isArray(listState.lists) ? listState.lists : []), newList]);
        setIsLoading(false)
    }
    
    async function onUpdateList(listId, data){
        setIsLoading(true)
        const updatedList = await update(listId, data)
        const updatedLists = listState.lists.map(list =>
            list._id === listId ? updatedList : list
        )
        setLists(updatedLists)
        setIsLoading(false)
    }

    async function onMoveList(reorderedLists) {
        setIsLoading(true)
        setLists(
            reorderedLists
                .map(l => ({ ...l }))
                .sort((a, b) => a.position - b.position)
        )
        await Promise.all(
            reorderedLists.map(list =>
                update(list._id, { position: list.position })
            )
        )
        setIsLoading(false);
    }

    return (
        <ListContext.Provider value={{ listState, setListState, setIsLoading, setLists, resetListState,
                                        loadLists, onCreateList, onUpdateList, onMoveList }}>
                                {children}
        </ListContext.Provider>
    )
}