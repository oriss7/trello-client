import { httpService } from './http.service';

const ENDPOINT = 'card';

export async function create(listId, title) {
    const response =  await httpService.post(`${ENDPOINT}/${listId}`, { title })
    return response.card
}

export async function query(listId) {
    const response = await httpService.get(`${ENDPOINT}/query/${listId}`)
    return response.cards
}

export async function update(cardId, data) {
    const response =  await httpService.put(`${ENDPOINT}/${cardId}`, data)
    return response.updatedCard
}