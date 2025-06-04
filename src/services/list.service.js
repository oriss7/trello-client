import { httpService } from './http.service';

const ENDPOINT = 'list';

export async function create(boardId, title) {
    const response =  await httpService.post(`${ENDPOINT}/${boardId}`, { title })
    return response.list
}

// export async function get(boardId) {
//     const response = await httpService.get(`${ENDPOINT}/${boardId}`)
//     return response.board
// }

export async function query(boardId) {
    const response = await httpService.get(`${ENDPOINT}/query/${boardId}`)
    return response.lists
}

// export async function update(BoardId, data) {
//     const response =  await httpService.put(`${ENDPOINT}/${BoardId}`, data)
//     return response.updatedBoard
// }