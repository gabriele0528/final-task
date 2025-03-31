import { API_BASE_URL } from '../config/api';

const http = {
    get: async (endpoint, config = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...config.headers
            },
        });
        return response.json();
    },

    post: async (endpoint, data, config = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...config.headers
            },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    put: async (endpoint, data, config = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...config.headers
            },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    getToken: (endpoint) => {
        return new Promise(resolve => {

            const options = {
                method: "GET",
                headers: {
                    authorization: localStorage.getItem('token'),
                    "content-type": "application/json"
                }
            }

            fetch(API_BASE_URL + endpoint, options)
                .then(res => res.json())
                .then(data => {
                    resolve(data)
                })

        })
    },

    postToken: (endpoint, data) => {
        return new Promise(resolve => {

            const options = {
                method: "POST",
                headers: {
                    authorization: localStorage.getItem('token'),
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            }

            fetch(API_BASE_URL + endpoint, options)
                .then(res => res.json())
                .then(data => {
                    resolve(data)
                })

        })
    },

    deleteToken: (endpoint) => {
        return new Promise(resolve => {
            const options = {
                method: "DELETE",
                headers: {
                    authorization: localStorage.getItem('token'),
                    "content-type": "application/json"
                }
            }
            fetch(API_BASE_URL + endpoint, options)
                .then(res => res.json())
                .then(data => {
                    resolve(data)
                })
        })
    }
}

export default http;