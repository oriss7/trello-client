import { httpService } from './http.service';

const AUTH_ENDPOINT = 'auth';
const ACCOUNT_ENDPOINT = 'account';

export async function login(email, password) {
    return await httpService.post(`${AUTH_ENDPOINT}/login`, { email, password })
}

export async function signup(name, email, password) {
    return await httpService.post(`${AUTH_ENDPOINT}/signup`, { name, email, password });
}

export async function logout() {
    return await httpService.post(`${AUTH_ENDPOINT}/logout`)
}

export async function getLoggedInAccount() {
    return await httpService.get(`${ACCOUNT_ENDPOINT}`)
}

export async function get(accountId) {
    return await httpService.get(`${ACCOUNT_ENDPOINT}/${accountId}`)
}

export async function query() {
    const res = await httpService.get(`${ACCOUNT_ENDPOINT}/query`)
    return res
}

export async function update(accountId, data) {
    return await httpService.put(`${ACCOUNT_ENDPOINT}/${accountId}`, data)
}

export async function remove(accountId) {
    return await httpService.delete(`${ACCOUNT_ENDPOINT}/${accountId}`)
}