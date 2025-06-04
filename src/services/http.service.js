import SERVER_URL from './const.service';

export async function apiRequest(endpoint = '', method = 'GET', body = null) {
        try {
                const response = await fetch(`${SERVER_URL}/${endpoint}`, {
                method,
                ...(body && { body: JSON.stringify(body) }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                
        })
        return response.json()
        } catch (error) {
                throw error
        }
}

export const httpService = {
	get: (endpoint) => apiRequest(endpoint, 'GET'),
	post: (endpoint, body) => apiRequest(endpoint, 'POST', body),
	put: (endpoint, body) => apiRequest(endpoint, 'PUT', body),
	delete: (endpoint, body) => apiRequest(endpoint, 'DELETE', body),
}