import { httpService } from './http.service';

const ENDPOINT = 'board';

export async function create(accountId, title) {
    const response =  await httpService.post(`${ENDPOINT}/${accountId}`, { title })
    return response.board
}

export async function get(boardId) {
    const response = await httpService.get(`${ENDPOINT}/${boardId}`)
    return response.board
}

export async function query(accountId) {
    const response = await httpService.get(`${ENDPOINT}/query/${accountId}`)
    return response.boards
}

export async function update(boardId, data) {
    const response =  await httpService.put(`${ENDPOINT}/${boardId}`, data)
    return response.updatedBoard
}
// export async function remove(transactionId) {
//     const response = await httpService.delete(`transaction/${transactionId}`)
//     return response.deletedtransaction
// }

